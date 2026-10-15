import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const file: Record<string, [string, string]> = {
    // ถ้าเบราว์เซอร์ขอเส้นทางนี้ ให้ส่งไฟล์ไหน และบอกว่าเป็นไฟล์ชนิดอะไร
    "/signup.html": ["signup.html", "text/html; charset=utf-8"],
    "/style.css": ["style.css", "text/css; charset=utf-8"],
    "/dir/signup.js": ["dir/signup.js", "text/javascript; charset=utf-8"]
};

const server = createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/api/signup") {
        res.setHeader("Content-Type", "application/json");
            
            const chunks: Buffer[] = [];
            let bytes = 0;

            for await (const chunk of req) 
            {
                bytes += chunk.length;
                chunks.push(chunk);

                if (bytes > 8192) 
                {
                    res.statusCode = 413;
                    res.end(JSON.stringify({
                        message: "ข้อมูลยาวเกินไป"
                    }));
                    return;
                }
            }
            const body = Buffer.concat(chunks).toString("utf8");
            const data = JSON.parse(body);
        
            if(typeof data.email !== "string" || typeof data.password !== "string" 
            || !data.email.trim() || !data.password)
            {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    message: "กรุณากรอกข้อมูลให้ครบ"
                }));
                return;
            }
        }
});