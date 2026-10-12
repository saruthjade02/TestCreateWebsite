import { createServer } from "node:http";
const server = createServer((req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Hello from backend!");
});
server.listen(3000, "127.0.0.1", () => {
    console.log("เปิด http://127.0.0.1:3000");
});
