const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let server;

beforeAll(async () => {
  // ใช้พอร์ต 0 เพื่อให้ Node.js เลือกพอร์ตที่ว่างโดยอัตโนมัติ
  server = app.listen(0);
});

afterAll(async () => {

  // ปิดเซิร์ฟเวอร์และการเชื่อมต่อกับ MongoDB หลังจากทดสอบเสร็จ
  await mongoose.connection.close();
  await server.close();
});

// describe('API Testing', () => {
//   it('GET /api/user - success', async () => {
//     const res = await request(server).get('/api/user'); // ใช้ server ที่กำหนดจาก beforeAll
//     expect(res.statusCode).toEqual(200); // ตรวจสอบ response status code
//     // เพิ่มการตรวจสอบ response body ตามต้องการ
//   });
// });


describe('User API Testing', () => {

    it('POST /api/user/create - success', async () => {

      const userData = {
        firstName: "Anecha",
        lastName: "Boonthongdee",
        email: "anecha.boon@gmail.com",
        password: "1234"
      };
  
      const res = await request(server)
        .post('/api/user')
        .send(userData);  // ส่งข้อมูลผ่าน .send()

        console.log(`🚀 log:res-create-user`,res )
  
      expect(res.statusCode).toEqual(201);  // ตรวจสอบว่าการสร้างสำเร็จ
      expect(res.body).toHaveProperty('message', 'User created successfully');
    });
  
    // it('POST /api/user/create - missing fields', async () => {
    //   const userData = {
    //     firstName: "Anecha",
    //     lastName: "Boonthongdee",
    //     password: "1234"
    //   };
  
    //   const res = await request(server)
    //     .post('/api/user')
    //     .send(userData);  // ส่งข้อมูลที่ไม่ครบ
  
    //   expect(res.statusCode).toEqual(400);  // ตรวจสอบว่า error เนื่องจากข้อมูลไม่ครบ
    // //   expect(res.body).toHaveProperty('message', 'All fields are required');
    // });
});
