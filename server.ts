import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import * as argon2 from "argon2";

const file: Record<string, [string, string]> = {
    "/": ["index.html", "text/html; charset=utf-8"],
    "/index.html": ["index.html", "text/html; charset=utf-8"],
    "/signup.html": ["signup.html", "text/html; charset=utf-8"],

    "/style.css": ["style.css", "text/css; charset=utf-8"],
    "/dir/script.js": ["dir/script.js", "text/javascript; charset=utf-8"],
    "/dir/signup.js": ["dir/signup.js", "text/javascript; charset=utf-8"],

    "/META.png": ["META.png", "image/png"],
    "/mark1.jpg": ["mark1.jpg", "image/jpeg"],
    "/mark2.png": ["mark2.png", "image/png"],
    "/mark3.jpg": ["mark3.jpg", "image/jpeg"],

    "/facebook.png": ["facebook.png", "image/png"],
    "/Instagram.png": ["Instagram.png", "image/png"],
    "/Messenger.png": ["Messenger.png", "image/png"],
    "/Threads.png": ["Threads.png", "image/png"],

    "/Meta_Quest.jpg": ["Meta_Quest.jpg", "image/jpeg"],
    "/oakley_meta.png": ["oakley_meta.png", "image/png"],
    "/rayban-meta.jpg": ["rayban-meta.jpg", "image/jpeg"]
};

const server = createServer(async (req, res) => {
    let url = "";

    if (req.url !== undefined) {
        url = req.url;
    }

    const selectedFile = file[url];

    if (req.method === "GET" && selectedFile) {
        const [filename, contentType] = selectedFile;
        try {
            const data = await readFile(filename);
            res.setHeader("Content-Type", contentType);
            res.end(data);
        } catch (error) {
            res.statusCode = 404;
            res.end("File not found");
        }
        return;
    }
    if (req.method === "POST" && req.url === "/api/signup") {
        res.setHeader("Content-Type", "application/json");

        try {
            const chunks: Buffer[] = [];
            let bytes = 0;

            for await (const chunk of req) {
                bytes += chunk.length;
                chunks.push(chunk);

                if (bytes > 8192) {
                    res.statusCode = 413;
                    res.end(JSON.stringify({
                        message: "ข้อมูลยาวเกินไป"
                    }));
                    return;
                }
            }
            const body = Buffer.concat(chunks).toString("utf8");

            const data = JSON.parse(body);

            if (!data ||
                typeof data.name !== "string" ||
                typeof data.email !== "string" ||
                typeof data.password !== "string" ||
                !data.name.trim() ||
                !data.email.trim() ||
                !data.password.trim()) {
                    
                res.statusCode = 400;
                res.end(JSON.stringify({
                    message: "กรุณากรอกข้อมูลให้ครบ"
                }));
                return;
            }




            const result = await db.execute(
                'SELECT id FROM users WHERE email = ?',
                [data.email.trim().toLowerCase()]
            );

            const users = result[0];

            if (Array.isArray(users) && users.length > 0) {
                res.statusCode = 409;
                res.end(JSON.stringify({
                    message: "อีเมลนี้ถูกใช้แล้ว"
                }));
                return;
            }

            const passwordHash = await argon2.hash(data.password);
            await db.execute(
                `INSERT INTO users (name, email, password_hash)
                 VALUES (?, ?, ?)`,
                [
                    data.name.trim(),
                    data.email.trim().toLowerCase(),
                    passwordHash
                ]
            );

            res.end(JSON.stringify({
                message: "สมัครสมาชิกสำเร็จ"
            }));
        }
        catch (error) {
            res.statusCode = error instanceof SyntaxError ? 400 : 500;

            res.end(JSON.stringify({
                message: error instanceof SyntaxError
                    ? "ข้อมูล JSON ไม่ถูกต้อง"
                    : "สมัครสมาชิกไม่สำเร็จ"
            }));
        }

        return;
    }
    res.statusCode = 404;
    res.end("Not found");
});

import mysql from "mysql2/promise";
import { loadEnvFile } from "node:process";

loadEnvFile(".env");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


server.listen(3000, "localhost", () => {
    console.log("Server is running on http://localhost:3000");
});
