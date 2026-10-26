# Meta Product Showcase

A learning project showcasing Meta products, built to practice responsive design and full-stack web development.

โปรเจกต์ฝึกพัฒนาเว็บด้วย HTML, CSS, TypeScript และ Node.js พร้อมระบบสมัครสมาชิกที่เก็บข้อมูลใน MySQL โดยไม่ใช้ frontend framework

## ฟีเจอร์ปัจจุบัน

- หน้าแรกแนะนำสินค้าและแอปของ Meta พร้อม slideshow
- หน้ารายละเอียด Meta Quest 3, Oakley Meta และ Ray-Ban Meta เลือกสินค้าผ่าน query parameter เช่น `/product.html?id=quest`
- กราฟหุ้น META จาก Twelve Data พร้อมปุ่ม Day, Week, Month และ Year
- เมนูด้านข้างและหน้าต่าง Login แบบ dialog
- สมัครสมาชิกผ่าน `POST /api/signup` ตรวจอีเมลซ้ำและ hash รหัสผ่านด้วย Argon2 ก่อนบันทึกลง MySQL
- สมัครสมาชิกสำเร็จแล้วกลับหน้าแรก ส่วนข้อผิดพลาดแสดงผ่าน alert

หน้าต่าง Login ยังเป็นส่วนติดต่อผู้ใช้ ยังไม่มี API สำหรับเข้าสู่ระบบหรือ session

## สิ่งที่ต้องมี

- Node.js และ npm (เครื่องที่ใช้พัฒนาใช้ Node.js 26)
- MySQL ที่เปิด service อยู่ โดย port เริ่มต้นคือ `3306`
- DBeaver หรือเครื่องมือ SQL สำหรับสร้างฐานข้อมูลและตาราง
- อินเทอร์เน็ตสำหรับ Google Fonts และข้อมูลหุ้นจาก Twelve Data

## เริ่มใช้งาน

รันคำสั่งจากโฟลเดอร์โปรเจกต์:

```powershell
npm install
```

### 1. สร้างฐานข้อมูล

เชื่อมต่อ MySQL ใน DBeaver แล้วรัน SQL นี้สำหรับการติดตั้งใหม่:

```sql
CREATE DATABASE IF NOT EXISTS meta_app CHARACTER SET utf8mb4;
USE meta_app;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Server ใช้ตารางนี้ แต่ไม่ได้สร้างฐานข้อมูลหรือตารางให้อัตโนมัติ

### 2. ตั้งค่า .env

สร้างไฟล์ `.env` ที่โฟลเดอร์หลัก โดยใส่ข้อมูล MySQL ของเครื่องคุณ:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD="your_mysql_password"
DB_NAME=meta_app
```

`server.ts` อ่านไฟล์นี้ด้วย `loadEnvFile(".env")` แล้วใช้ค่าต่าง ๆ สร้าง connection pool อย่าใส่รหัสผ่านจริงลง README หรือ commit ไฟล์ `.env`

### 3. Build และเปิด server

```powershell
npm run build
node dir/server.js
```

เปิด **http://localhost:3000** ใน browser และเปิด Terminal ของ server ค้างไว้ หยุด server ด้วย `Ctrl + C`

ต้องเปิดผ่าน server เพื่อใช้ API สมัครสมาชิก การเปิด `index.html` ตรง ๆ หรือใช้ static server อย่าง `serve .` จะไม่เรียก backend ของโปรเจกต์นี้

หากใช้ Node.js ที่รองรับการรัน TypeScript โดยตรง สามารถใช้ `node server.ts` แทน `node dir/server.js` ได้ แต่ยังต้อง build ไฟล์ TypeScript ฝั่ง browser

## ระหว่างพัฒนา

| คำสั่ง | หน้าที่ |
| --- | --- |
| `npm run build` | ตรวจและแปลง TypeScript เป็น JavaScript ใน `dir/` |
| `npm run check` | ตรวจชนิดข้อมูลโดยไม่สร้างไฟล์ JavaScript |
| `npm run watch` | Build อัตโนมัติเมื่อบันทึกไฟล์ TypeScript |
| `node dir/server.js` | เปิด backend และให้บริการไฟล์หน้าเว็บ |

เปิด `npm run watch` ในอีก Terminal ระหว่างพัฒนา หลังแก้ frontend ให้รีเฟรช browser หลังแก้ `server.ts` ให้รอ build เสร็จแล้วหยุดและเปิด server ใหม่

หาก PowerShell ไม่อนุญาตให้รัน `npm.ps1` ใช้ `npm.cmd` แทน `npm` ในคำสั่งข้างต้น

## โครงสร้างไฟล์

| ไฟล์ | หน้าที่ |
| --- | --- |
| `index.html` | หน้าแรก ส่วนแอป กราฟหุ้น สินค้า และ footer |
| `product.html` | โครงหน้ารายละเอียดสินค้า |
| `signup.html` | แบบฟอร์มสมัครสมาชิก |
| `style.css` | รูปแบบและ responsive layout ของเว็บไซต์ |
| `script.ts` | การโต้ตอบบนหน้าแรก เช่น slideshow, dialog และกราฟหุ้น |
| `product.ts` | อ่าน `id` จาก URL แล้วแสดงข้อมูลสินค้า |
| `signup.ts` | อ่านข้อมูลจากฟอร์มและส่ง request สมัครสมาชิก |
| `server.ts` | HTTP server, เส้นทางไฟล์, API สมัครสมาชิก และการเชื่อมต่อ MySQL |
| `dir/` | JavaScript ที่สร้างจาก TypeScript ไม่ควรแก้โดยตรง |
| `package.json` | dependencies และคำสั่งของโปรเจกต์ |
| `package-lock.json` | ล็อกเวอร์ชัน dependencies ที่ติดตั้ง |
| `tsconfig.json` | กำหนดวิธีตรวจและแปลง TypeScript |

## การทำงานของระบบ

```text
Browser ขอหน้าเว็บ → Node.js ส่ง HTML, CSS และ JavaScript กลับมา

กรอกแบบฟอร์ม → signup.js ส่ง POST /api/signup
             → server ตรวจข้อมูลและอีเมลซ้ำ
             → hash รหัสผ่าน → บันทึกใน MySQL
             → ส่ง JSON กลับ → frontend แสดงผล
```

Server ใช้ port `3000` ส่วน MySQL ใช้ port ตาม `DB_PORT` Browser ติดต่อ API ของ server และ server เป็นผู้ติดต่อฐานข้อมูล

## รูปภาพและข้อมูลภายนอก

- ไฟล์ที่ browser ขอได้ต้องมีรายการอยู่ใน object `file` ใน `server.ts` เมื่อเพิ่มรูปหรือหน้าใหม่ ให้เพิ่ม path, ชื่อไฟล์ และ Content-Type แล้วเปิด server ใหม่
- ถ้า URL มี query parameter เช่น `/product.html?id=quest` server ใช้ `pathname` เพื่อเลือกไฟล์ ส่วน `product.ts` อ่าน `id` เพื่อเลือกข้อมูลสินค้า
- กราฟหุ้นเรียก Twelve Data จาก `script.ts` ต้องมี API key ที่ใช้งานได้ และขึ้นอยู่กับข้อจำกัดของบริการ หากกราฟโหลดไม่ได้ให้ดูข้อความสถานะและ Network ใน DevTools
- Google Fonts ใช้อินเทอร์เน็ต หากโหลดไม่ได้ browser จะใช้ฟอนต์สำรอง

## ผู้จัดทำ

**Saruth Latthitham**

- [LinkedIn](https://www.linkedin.com/in/saruth-latthitham-a11519382/)
- [GitHub](https://github.com/saruthjade02)
- ช่วงเวลาพัฒนา: October 2026 – Present
