const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let server;

beforeAll(async () => {
  server = app; // ใช้เซิร์ฟเวอร์ที่ส่งคืนจาก app.js
});

afterAll(async () => {
  await mongoose.connection.close(); // ปิดการเชื่อมต่อ mongoose
  await server.close(); // ปิดเซิร์ฟเวอร์
});

describe('API Testing', () => {
  it('GET /api/user - success', async () => {
    const res = await request(server).get('/api/user'); // ใช้ server ที่กำหนดจาก beforeAll
    expect(res.statusCode).toEqual(200); // ตรวจสอบ response status code
    // เพิ่มการตรวจสอบ response body ตามต้องการ
  });
});

describe('User API Testing', () => {
  it('POST /api/user/create - success', async () => {
    const userData = {
      firstName: "Anecha",
      lastName: "Boonthongdee",
      email: "anecha.boon+1@gmail.com",
      password: "1234"
    };

    const res = await request(server)
      .post('/api/user')
      .send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');

    // ตรวจสอบว่าผู้ใช้ถูกสร้างขึ้นและมี ID
    const userId = res.body.user._id; // ปรับเปลี่ยนให้ดึง ID ที่ถูกต้อง
    expect(userId).toBeDefined();

    const deleteUserRes = await request(server)
      .delete(`/api/user/${userId}`); // ใช้ userId ที่ได้จากการสร้างผู้ใช้

    expect(deleteUserRes.statusCode).toEqual(200);
  });

  it('POST /api/user/create - missing fields', async () => {
      const userData = {
        firstName: "Anecha",
        lastName: "Boonthongdee",
        password: "1234"
      };
  
      const res = await request(server)
        .post('/api/user')
        .send(userData);  // ส่งข้อมูลที่ไม่ครบ
  
      expect(res.statusCode).toEqual(400);  // ตรวจสอบว่า error เนื่องจากข้อมูลไม่ครบ
    //   expect(res.body).toHaveProperty('message', 'All fields are required');
    });
});
