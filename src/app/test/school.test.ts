
import http from 'supertest';
import { App } from '../app';
import { config } from 'dotenv';
import { join } from 'path';
import { SchoolController } from '../controllers';
import { getConnectionManager } from 'typeorm';
import { dbConfig } from '../ormconfig';
import sample from './sample.json';
config({ path: join(__dirname, '../.env') });
const connectionManager = getConnectionManager();
const connection = connectionManager.create(dbConfig);
const server = new App([ new SchoolController()],process.env.PORT)['app'];

beforeAll(async ()=>{
  await connection.connect();
})

describe("SCHOOL CONTROLLER API", () => {
    test("POST /api/register register new teacher and  students which return 204", async (done) => {
        const response = await http(server)
            .post("/api/register")
            .send(sample.registerPayload1);
        expect(response.status).toBe(204);
        done();
    });
    test("POST /api/register resgister existing students for new teachers return 204", async (done) => {
        const response = await http(server)
            .post("/api/register")
            .send(sample.registerPaylaod2);
        expect(response.status).toBe(204);
        done();
    });
    test("POST /api/register  register with invalid email address return 400", async (done) => {
        const response = await http(server)
            .post("/api/register")
            .send(sample.registerPaylaod3);
        expect(response.status).toBe(400);
        done();
    });
    test("GET /api/commonstudents return response for teacher1@example.com retrun 200", async (done) => {
        const response = await http(server)
            .get("/api/commonStudents")
            .query(sample.commonStudentsPayload1);       
        expect(response.status).toBe(200);
        done();
    });
    test("GET /api/commonstudents return response of common student for teacher1@example.com & teacher2@example.com retrun 200", async (done) => {
        const response = await http(server)
            .get("/api/commonStudents")
            .query(sample.commonStudentsPayload2);
        expect(response.status).toBe(200);
        done();
    });
    test("GET /api/commonstudents return response of common student for teacher1@example.com & teacher retrun 400", async (done) => {
        const response = await http(server)
            .get("/api/commonStudents")
            .query(sample.commonStudentsPayload3);
        expect(response.status).toBe(400);
        done();
    });
    test("POST /api/suspend to suspend  student2@example.com with return response 204", async (done) => {
        const response  = await http(server)
            .post("/api/suspend")
            .send(sample.suspendPayload1);
        expect(response.status).toBe(404);
        done();
    });
    test("POST /api/suspend to suspend student8@example.com and return status 400", async (done) => {
        const response  = await http(server)
            .post("/api/suspend")
            .send(sample.suspendPayload2);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`Student ${sample.suspendPayload2.student} does not exist`);
        done();
    });
    test("POST /api/retrievefornotifications retrieve notification for student @ with email without duplicates who are also not suspended  and return 200", async (done) => {
        const response = await http(server)
            .post("/api/retrievefornotifications")
            .send(sample.sendNotificationPayload1);
            expect(response.status).toBe(200);
        done();
    });
    test("POST /api/retrievefornotifications to return list of recipient to every one student who are not suspended and return  200", async (done) => {
        const response  = await http(server)
            .post("/api/retrievefornotifications")
            .send(sample.sendNotificationPayload2);
        expect(response.status).toBe(200);
        done();
    });
});

afterAll(async () => {
    await connection.close();
})
