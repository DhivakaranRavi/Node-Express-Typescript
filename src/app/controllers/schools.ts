import { Router, Request, Response, NextFunction } from 'express';
import { Exception } from '../exceptions/index';
import { validationMiddleware, redisMiddleware } from '../middlewares';
import { Students, Teachers } from '../entities';
import { logger } from '../utils';
import {
  getUserByEmailQuery,
  studentSuspendQuery,
  bulkStudentInsertQuery,
  getCommonStudentsQuery,
  insertQuery,
} from '../repositories';
import {
  CreateStudentDTO,
  StudentSuspendDTO,
  SendNotificationDTO,
  CommonStudentDTO,
} from '../dtos';
import _ from 'lodash';

export class SchoolController {
  public path = '/api';
  public router = Router();
  public logger: any;

  constructor() {
    this.logger = logger();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /api/register:
     *   post:
     *     tags:
     *       - name: School | School Controller
     *     summary: create a new students
     *     description: create a new customer
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: register
     *         description: create a new students
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/create_student_dto'
     *     responses:
     *       204:
     *         description: students created successfully
     * definitions:
     *   create_student_dto:
     *    description: create student dto
     *    properties:
     *     teacher:
     *        type: string
     *     students:
     *        type: array
     *        items:
     *         type: string
     */
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateStudentDTO),
      this.createStudent,
    );

    /**
     * @swagger
     * /api/commonstudents:
     *   get:
     *     tags:
     *       - name: School | School Controller
     *     summary: retrieve a list of students
     *     description: retrieve a list of students
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: query
     *         name: teacher
     *         schema:
     *           type: object
     *           additionalProperties:
     *            type: string
     *         style: form
     *         explode: true
     *     responses:
     *       200:
     *         description: student suspend successfully
     */

    this.router.get(
      `${this.path}/commonstudents`,
      validationMiddleware(CommonStudentDTO),
      redisMiddleware(),
      this.getCommonStudents,
    );

    /**
     * @swagger
     * /api/suspend:
     *   post:
     *     tags:
     *       - name: School | School Controller
     *     summary: suspend a student
     *     description: suspend a student
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: suspend
     *         description: suspend a student
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/student_suspend_dto'
     *     responses:
     *       204:
     *         description: student suspend successfully
     * definitions:
     *   student_suspend_dto:
     *    description: create student dto
     *    properties:
     *     student:
     *        type: string
     */
    this.router.post(
      `${this.path}/suspend`,
      validationMiddleware(StudentSuspendDTO),
      this.studentSuspend,
    );

    /**
     * @swagger
     * /api/retrievefornotifications:
     *   post:
     *     tags:
     *       - name: School | School Controller
     *     summary: send a notifications to student
     *     description: send a notifications to student
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: retrievefornotifications
     *         description: send a notifications to student
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/send_notification_dto'
     *     responses:
     *       200:
     *         description: notification send successfully
     * definitions:
     *   send_notification_dto:
     *    description: send a notifications to student
     *    properties:
     *     teacher:
     *        type: string
     *     notification:
     *        type: string
     */
    this.router.post(
      `${this.path}/retrievefornotifications`,
      validationMiddleware(SendNotificationDTO),
      redisMiddleware(),
      this.sendNotifications,
    );
  }

  private createStudent = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { teacher, students }: CreateStudentDTO = request.body;
      const isTeacherExist = await getUserByEmailQuery(Teachers, teacher);
      let createTeacher;
      !isTeacherExist.length
        ? (createTeacher = await insertQuery(Teachers, { email: teacher }))
        : null;
      await bulkStudentInsertQuery(
        isTeacherExist.length
          ? isTeacherExist[0]
          : createTeacher.generatedMaps[0],
        students,
      );
      response.status(204).send();
    } catch (error) {
      this.logger.info(error);
      next(new Exception(500, 'Internal Server Error'));
    }
  };

  private getCommonStudents = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { teacher }: CommonStudentDTO = request.query;
      const teachers = await getUserByEmailQuery(Teachers, teacher);
      if (teachers.length) {
        let students = await getCommonStudentsQuery(teachers);
        students.length
          ? response.status(200).json({ students })
          : next(
              new Exception(
                404,
                `No student found for the given teacher ${teacher}`,
              ),
            );
      } else {
        next(new Exception(404, `Teacher ${teacher} does not exist`));
      }
    } catch (error) {
      this.logger.info(error);
      next(new Exception(500, 'Internal Server Error'));
    }
  };

  private studentSuspend = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { student }: StudentSuspendDTO = request.body;
      const isStudentExist = await getUserByEmailQuery(Students, student);
      if (isStudentExist.length) {
        if (!isStudentExist[0]['suspended']) {
          await studentSuspendQuery(student, true);
          response.status(204).send();
        } else {
          next(new Exception(404, `Student ${student} already suspended`));
        }
      } else {
        next(new Exception(404, `Student ${student} does not exist`));
      }
    } catch (error) {
      this.logger.info(error);
      next(new Exception(500, 'Internal server error'));
    }
  };

  private sendNotifications = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { teacher, notification }: SendNotificationDTO = request.body;
      const isTeacherExist = await getUserByEmailQuery(Teachers, teacher);
      if (isTeacherExist.length) {
        let email = notification.match(
          /@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
        );
        email ? (email = email.map(list => list.substr(1))) : null;
        let students;
        email
          ? (students = await bulkStudentInsertQuery(isTeacherExist[0], email))
          : null;
        let recipients = _.union([
          ...(await getCommonStudentsQuery(isTeacherExist)),
          ...(email ? _.xor(_.compact(students), email) : []),
        ]);
        response.status(200).json({ recipients });
      } else {
        next(new Exception(404, `Teacher ${teacher} does not exist`));
      }
    } catch (error) {
      this.logger.info(error);
      next(new Exception(500, 'Internal server error'));
    }
  };
}
