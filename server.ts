import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("users.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    );
`);


// import { createServer } from "node:http";

// const server = createServer(async (req, res) => {
//     if (req.method === "POST" && req.url === "/api/signup") {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");

//         try {
//             let body = "";
//             for await (const chunk of req) {
//                 body += chunk;
//             }
//             if (body.length > 8000) {
//                 res.statusCode = 413;
//                 res.end("Payload too large");
//                 return;
//             }

//             const data = JSON.parse(body);
//             if (typeof data.email !== "string" || typeof data.password !== "string") {
//                 res.statusCode = 400;
//                 res.end("Bad request");
//                 return;
//             }
//             res.end(JSON.stringify({
//                 message: "รับข้อมูลแล้ว แต่ยังไม่ได้สร้างบัญชี"
//             }));
//         } catch (error) {
//             res.statusCode = 400;
//             res.end("Bad request");
//         }
//     }
//     if (req.method === "GET" && req.url === "/api/health") {
//         res.setHeader("Content-Type", "application/json");
//         res.end(JSON.stringify({ message: "Backend is running" }));
//         return;
//     }
//     if (req.method === "GET" && req.url === "/") {
//     res.setHeader("Content-Type", "text/plain; charset=utf-8");
//     res.end("Hello from backend!");
//     return;
// }
// });

// server.listen(3000, "127.0.0.1", () => {
//     console.log("เปิด http://127.0.0.1:3000");
// });



