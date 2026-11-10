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
    "/account.html": ["account.html", "text/html; charset=utf-8"],
    "/cart.html": ["cart.html", "text/html; charset=utf-8"],
    "/style.css": ["style.css", "text/css; charset=utf-8"],
    "/dir/script.js": ["dir/script.js", "text/javascript; charset=utf-8"],
    "/dir/signup.js": ["dir/signup.js", "text/javascript; charset=utf-8"],
    "/dir/product.js": ["dir/product.js", "text/javascript; charset=utf-8"],
    "/dir/login.js": ["dir/login.js", "text/javascript; charset=utf-8"],
    "/dir/account.js": ["dir/account.js", "text/javascript; charset=utf-8"],
    "/dir/cart.js": ["dir/cart.js", "text/javascript; charset=utf-8"],
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
app.get("/api/cart", async (req, res) => {
    const userId = req.session.userId;
    if (userId === undefined) {
        res.status(401).send({
            message: "Please log in first"
        });
        return;
    }
    try {
        const [cartItems] = await db.execute("SELECT product_id , COUNT(*) as quantity FROM cart WHERE user_id = ? GROUP BY product_id", [userId]);
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).send({
            message: "Unable to fetch cart items"
        });
    }
});
app.get("/api/me", async (req, res) => {
    const userId = req.session.userId;
    if (userId === undefined) {
        res.status(401).send({
            message: "Not logged in"
        });
        return;
    }
    try {
        const [users] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [userId]);
        const user = users[0];
        if (!user) {
            res.status(401).send({
                message: "Not be founded"
            });
            return;
        }
        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email
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
            message: "An error occurred while logging in"
        });
    }
});
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send({
                message: "Log Out Failed!!"
            });
            return;
        }
        res.clearCookie("connect.sid");
        res.status(200).send({
            message: "Log Out Success"
        });
    });
});
app.post("/api/update-value", async (req, res) => {
    try {
        const userId = req.session.userId;
        if (userId === undefined) {
            return res.status(401).json({
                message: "Please log in first."
            });
        }
        const data = req.body;
        if (typeof data.name !== "string" || !data.name.trim()) {
            res.status(400).send({
                message: "Please provide your name."
            });
            return;
        }
        if (data.currentPassword === undefined && data.newPassword === undefined) {
            await db.execute("UPDATE users SET name = ? WHERE id = ?", [data.name.trim(), userId]);
        }
        else {
            if (typeof data.currentPassword !== "string" ||
                typeof data.newPassword !== "string" ||
                !data.currentPassword ||
                data.newPassword.length < 8) {
                res.status(400).send({
                    message: "Please enter the correct password."
                });
                return;
            }
            const [users] = await db.execute("SELECT id, name, password_hash FROM users WHERE id = ?", [userId]);
            const user = users[0];
            if (!user) {
                res.status(404).send({
                    message: "Not Found User"
                });
                return;
            }
            const passwordMatches = await argon2.verify(user.password_hash, data.currentPassword);
            if (!passwordMatches) {
                res.status(401).send({
                    message: "The current password is incorrect."
                });
                return;
            }
            const newPasswordHash = await argon2.hash(data.newPassword);
            await db.execute("UPDATE users SET name = ?, password_hash = ? WHERE id = ?", [data.name.trim(), newPasswordHash, userId]);
        }
        res.status(200).send({
            message: "Update successful",
            name: data.name
        });
    }
    catch (error) {
        console.error("Update name error:", error);
        return res.status(500).json({
            message: "Unable to save name"
        });
    }
});
app.post("/api/cart", async (req, res) => {
    const userId = req.session.userId;
    if (userId === undefined) {
        res.status(401).send({
            message: "Please log in first"
        });
        return;
    }
    const productId = req.body?.productId;
    if (!["quest", "oakley", "rayban"].includes(productId)) {
        return res.status(400).json({
            message: "Invalid product."
        });
    }
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS cart (
                user_id BIGINT UNSIGNED NOT NULL,
                product_id VARCHAR(50) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        await db.execute("INSERT INTO cart (user_id, product_id) VALUES (?, ?)", [userId, productId]);
        res.status(201).json({
            message: "Added to cart."
        });
    }
    catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).send({
            message: "Unable to add product to cart"
        });
        return;
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
