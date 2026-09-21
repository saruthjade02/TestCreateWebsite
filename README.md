# MOVE — HTML + CSS + TypeScript

เปิด index.html ใน browser ได้เลย ไฟล์ JavaScript ที่ build แล้วอยู่ใน dist/script.js

## ไฟล์ที่แก้ไข
- index.html: โครงสร้างเว็บ
- style.css: หน้าตา
- script.ts: ข้อมูลโปรแกรม การเลือกท่า และตัวจับเวลา พร้อมชนิดข้อมูล
- dist/script.js: ผลลัพธ์จาก compiler ให้ browser โหลด ไม่ควรแก้ไฟล์นี้โดยตรง
- tsconfig.json: ตั้งค่า TypeScript แบบ strict

## คำสั่ง (PowerShell)
```powershell
cd D:\TestTest
npm.cmd install
npm.cmd run build
Start-Process .\index.html
```
ติดตั้ง dependencies ครั้งแรกหรือเมื่อนำโปรเจกต์ไปเครื่องใหม่ ในเครื่องนี้ติดตั้งให้แล้ว

เมื่อแก้ script.ts ให้รัน npm.cmd run build แล้วรีเฟรช browser
ระหว่างแก้โค้ด ใช้ npm.cmd run watch เพื่อ build อัตโนมัติเมื่อบันทึกไฟล์ (ยังต้องรีเฟรช browser เอง) หยุดด้วย Ctrl+C
ตรวจชนิดข้อมูลอย่างเดียว: npm.cmd run check

## TypeScript ทำงานอย่างไร
script.ts → TypeScript compiler (tsc) → dist/script.js → browser
HTML ยังโหลด JavaScript เพราะ browser ไม่รัน syntax TypeScript โดยตรง
TypeScript เป็นเครื่องมือตรวจชนิดข้อมูล ไม่ใช่ backend หรือ server
โปรเจกต์นี้ไม่ใช้ framework และไม่ต้องเปิด server สำหรับตัวอย่างปัจจุบัน

ตัวอย่างชนิดข้อมูล: Program กำหนดโครงสร้างโปรแกรมฝึก; Exercise กำหนดข้อมูลแต่ละท่า; ProgramId จำกัดชื่อหมวด; Set<number> เก็บลำดับท่าที่ทำแล้ว
ความคืบหน้าเก็บเฉพาะหน้านี้ รีเฟรชแล้วเริ่มใหม่
ฟอนต์ Google Fonts ใช้อินเทอร์เน็ต หากโหลดไม่ได้จะใช้ฟอนต์สำรอง

