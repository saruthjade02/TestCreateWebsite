import { readFile } from "node:fs/promises";
import * as argon2 from "argon2";
import express from "express";
import mysql from "mysql2/promise";
import { loadEnvFile } from "node:process";
import session from "express-session";
const file = {
    "/": ["index.html", "text/html; charset=utf-8"],
    "/index.html": ["index.html", "text/html; charset=utf-8"],
    "/signup.html": ["signup.html", "text/html; charset=utf-8"],
    "/product.html": ["product.html", "text/html; charset=utf-8"],
    "/style.css": ["style.css", "text/css; charset=utf-8"],
    "/dir/script.js": ["dir/script.js", "text/javascript; charset=utf-8"],
    "/dir/signup.js": ["dir/signup.js", "text/javascript; charset=utf-8"],
    "/dir/product.js": ["dir/product.js", "text/javascript; charset=utf-8"],
    "/dir/login.js": ["dir/login.js", "text/javascript; charset=utf-8"],
    "/anonymous.png": ["anonymous.png", "image/png"],
    "/META.png": ["META.png", "image/png"],
    "/mark1.jpg": ["mark1.jpg", "image/jpeg"],
    "/mark2.png": ["mark2.png", "image/png"],
    "/mark3.jpg": ["mark3.jpg", "image/jpeg"],
    "/facebook.png": ["facebook.png", "image/png"],
    "/Instagram.png": ["Instagram.png", "image/png"],
    "/Messenger.png": ["Messenger.png", "image/png"],
    "/Threads.png": ["Threads.png", "image/png"],
    "/Meta_Quest.jpg": ["Meta_Quest.jpg", "image/jpeg"],
    "/oakley_meta.jpg": ["oakley_meta.jpg", "image/jpeg"],
    "/rayban-meta.jpg": ["rayban-meta.jpg", "image/jpeg"],
    "/Linked-in.jpg": ["Linked-in.jpg", "image/jpeg"],
    "/github.png": ["github.png", "image/png"],
};
loadEnvFile(".env");
const app = express();
app.use(express.json());
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("Please set SESSION_SECRET in .env");
}
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.get("/api/me", async (req, res) => {
    const userId = req.session.userId;
    if (userId === undefined) {
        res.status(401).send({
            message: "Not logged in"
        });
        return;
    }
    try {
        const [users] = await db.execute("SELECT id, name FROM users WHERE id = ?", [userId]);
        const user = users[0];
        if (!user) {
            res.status(401).send({
                message: "Not be founded"
            });
            return;
        }
        res.status(200).send({
            id: user.id,
            name: user.name
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).send({
            message: "Unable to load user data"
        });
    }
});
app.get(/.*/, async (req, res) => {
    const selectedFile = file[req.path];
    if (!selectedFile) {
        res.status(404).send("File not found");
        return;
    }
    const [filename, contentType] = selectedFile;
    try {
        const data = await readFile(filename);
        res.setHeader("Content-Type", contentType);
        res.end(data);
    }
    catch (error) {
        res.status(404).send("File not found");
    }
});
app.post("/api/signup", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const data = req.body;
        if (!data ||
            typeof data.name !== "string" ||
            typeof data.email !== "string" ||
            typeof data.password !== "string" ||
            !data.name.trim() ||
            !data.email.trim() ||
            !data.password.trim()) {
            res.status(400).send({
                message: "Incomplete information"
            });
            return;
        }
        const result = await db.execute('SELECT id FROM users WHERE email = ?', [data.email.trim().toLowerCase()]);
        const users = result[0];
        if (Array.isArray(users) && users.length > 0) {
            res.status(400).send({
                message: "This email has already been used."
            });
            return;
        }
        const passwordHash = await argon2.hash(data.password);
        await db.execute(`INSERT INTO users (name, email, password_hash)
                 VALUES (?, ?, ?)`, [
            data.name.trim(),
            data.email.trim().toLowerCase(),
            passwordHash
        ]);
        res.status(201).send({
            message: "Registration failed"
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Registration failed"
        });
    }
    return;
});
app.post("/api/login", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const data = req.body;
        const result = await db.execute("SELECT id, name, password_hash FROM users WHERE email = ?", [data.email.trim().toLowerCase()]);
        const users = result[0]; // row , column = 0 , 1  is array
        if (!Array.isArray(users) || users.length === 0) {
            res.status(401).send({
                message: "Incorrect email or password"
            });
            return;
        }
        const user = users[0];
        const checkpass = await argon2.verify(user.password_hash, data.password);
        if (!checkpass) {
            res.status(401).send({
                message: "Incorrect email or password"
            });
            return;
        }
        req.session.regenerate((error) => {
            if (error) {
                res.status(500).send({
                    message: "Unsuccessful Session"
                });
                return;
            }
            req.session.userId = user.id;
            res.status(200).send({
                message: "Login successful",
                name: user.name
            });
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
        });
    }
});
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
app.listen(3000, "localhost", () => {
    console.log("Server is running on http://localhost:3000");
});
