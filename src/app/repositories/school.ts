import { getRepository } from 'typeorm';
import { Teachers, Students, Intersection } from '../entities';
import _ from 'lodash';

//Get list of user by emails
export const getUserByEmailQuery = async (entities: any, email: any) => {
  return await getRepository(entities)
    .createQueryBuilder('entity')
    .where('entity.status  = :status AND entity.email IN (:...email)', {
      status: true,
      email: email,
    })
    .getMany();
};

// common insert query
export const insertQuery = async (
  entities: any,
  data: object | Array<Object>,
) => {
  return await getRepository(entities)
    .createQueryBuilder()
    .insert()
    .into(entities)
    .values(data)
    .execute();
};

// student suspend query
export const studentSuspendQuery = async (
  email: string,
  suspended: boolean,
) => {
  return await getRepository(Students)
    .createQueryBuilder('students')
    .update()
    .set({
      suspended,
    })
    .where('students.status = :status AND students.email  = :email', {
      email: email,
      status: true,
    })
    .execute();
};

// bulk student insert query
export const bulkStudentInsertQuery = async (
  teacherDetails: any,
  array: Array<string>,
) => {
  return await Promise.all(
    array.map(async email => {
      let isUserExist = await getUserByEmailQuery(Students, email);
      if (!isUserExist.length) {
        let { generatedMaps } = await insertQuery(Students, {
          email: email,
        });
        await insertQuery(Intersection, {
          teacher: teacherDetails['id'],
          student: generatedMaps[0].id,
        });
      } else {
        await insertQuery(Intersection, {
          teacher: teacherDetails['id'],
          student: isUserExist[0]['id'],
        });
        return isUserExist[0]['suspended'] ? isUserExist[0]['email'] : null;
      }
    }),
  );
};

// get common student query
export const getCommonStudentsQuery = async (teachers: any) => {
  let query = await getRepository(Students).createQueryBuilder('student');
  let condition =
    'student.suspended  = :suspended AND student.status = :status AND ';
  let options = { suspended: false, status: true };
  teachers.forEach((teacher, index) => {
    query.innerJoinAndMapOne(
      `student.intersection${index}`,
      Intersection,
      `intersection${index}`,
      `student.id = intersection${index}.student_id`,
    );
    condition =
      condition + `intersection${index}.teacher_id = :id${index} AND `;
    options[`id${index}`] = teacher['id'];
  });
  let response = await query
    .select('DISTINCT  student.email')
    .where(condition.substring(0, condition.length - 4), options)
    .getRawMany();
  return response.map(value => value.email);
};
