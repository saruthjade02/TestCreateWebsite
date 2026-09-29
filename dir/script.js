"use strict";
//Setting
const button_setting = document.querySelectorAll(".nav-btn");
button_setting.forEach((button) => {
    button.addEventListener("mouseenter", () => {
        button.classList.add("hovered");
    });
    button.addEventListener("mouseleave", () => {
        button.classList.remove("hovered");
    });
});
// ViewProfile  
const images = document.querySelectorAll(".ViewProfile__content img");
let currentIndex = 0;
const prev = document.querySelector(".ViewProfile__controls .prev");
const next = document.querySelector(".ViewProfile__controls .next");
function showImage() {
    images.forEach((image, index) => {
        if (index === currentIndex) {
            image.hidden = false;
        }
        else {
            image.hidden = true;
        }
    });
}
prev?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
});
next?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
});
showImage();
// SlideShow Application
const slideTrack = document.querySelector(".SlideShow__content");
const slideImages = document.querySelectorAll(".SlideShow__content img");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const dots = document.querySelectorAll(".SlideShow__dot");
let slideIndex = 0;
function moveSlide() {
    if (slideTrack) {
        slideTrack.style.transform =
            `translateX(-${slideIndex * 100}%)`;
    }
    dots.forEach((dot, index) => {
        dot.classList.toggle("selected", index === slideIndex);
    });
}
slideNext?.addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % slideImages.length;
    moveSlide();
});
slidePrev?.addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + slideImages.length) % slideImages.length;
    moveSlide();
});
moveSlide();
const API_KEY = "86a7b668d85e411baac7d70046e8cb15";
const stockSettings = {
    "1D": { interval: "1day", months: 3 },
    "1W": { interval: "1week", months: 6 },
    "1M": { interval: "1month", months: 12 },
    "1Y": { interval: "1month", months: 60 },
};
const canvas = document.querySelector("#meta-chart");
const statusText = document.querySelector("#stock-status");
const rangeButtons = document.querySelectorAll("[data-range]");
let activeRequest;
let chartPoints = [];
// กล่องแสดงราคาเมื่อชี้จุด
const tooltip = document.createElement("div");
Object.assign(tooltip.style, {
    position: "fixed",
    display: "none",
    pointerEvents: "none",
    background: "#1e293b",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    font: "14px sans-serif",
    whiteSpace: "pre",
    zIndex: "2000",
});
document.body.appendChild(tooltip);
function hideTooltip() {
    tooltip.style.display = "none";
}
// ย้อนเดือน โดยรองรับวันสิ้นเดือน
function getStartDate(end, months) {
    const start = new Date(end);
    start.setUTCDate(1);
    start.setUTCMonth(start.getUTCMonth() - months);
    const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    start.setUTCDate(Math.min(end.getUTCDate(), lastDay));
    return start.toISOString().slice(0, 10);
}
// วาดกราฟ ราคา และวันที่
function drawChart(points) {
    const ctx = canvas.getContext("2d");
    if (!ctx || !points.length)
        return;
    const w = canvas.width, h = canvas.height;
    const left = 80, right = 25, top = 25, bottom = 45;
    const prices = points.map(p => p.close);
    const min = Math.min(...prices), max = Math.max(...prices);
    const padding = Math.max((max - min) * 0.1, 1);
    const low = min - padding, high = max + padding;
    const times = points.map(p => Date.parse(`${p.datetime.slice(0, 10)}T00:00:00Z`));
    const first = times[0];
    const duration = times[times.length - 1] - first;
    const x = (time) => left + (duration ? (time - first) / duration : 0.5)
        * (w - left - right);
    const y = (price) => top + ((high - price) / (high - low)) * (h - top - bottom);
    chartPoints = points.map((point, i) => ({
        x: x(times[i]),
        y: y(point.close),
        point,
    }));
    hideTooltip();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    // ราคาแกนซ้ายและเส้นตาราง
    for (let i = 0; i <= 4; i++) {
        const price = high - ((high - low) * i) / 4;
        const py = y(price);
        ctx.fillStyle = "#475569";
        ctx.fillText(`$${price.toFixed(2)}`, left - 10, py);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, py);
        ctx.lineTo(w - right, py);
        ctx.stroke();
    }
    // วันที่เริ่ม กลาง และท้าย
    ctx.fillStyle = "#475569";
    ctx.textBaseline = "alphabetic";
    const indices = [...new Set([
            0, Math.floor((points.length - 1) / 2), points.length - 1,
        ])];
    indices.forEach((index, i) => {
        ctx.textAlign = i === 0 ? "left"
            : i === indices.length - 1 ? "right" : "center";
        ctx.fillText(points[index].datetime.slice(0, 10), x(times[index]), h - 15);
    });
    // เส้นราคา
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    chartPoints.forEach((item, i) => {
        if (i === 0)
            ctx.moveTo(item.x, item.y);
        else
            ctx.lineTo(item.x, item.y);
    });
    ctx.stroke();
    // แสดงจุดข้อมูล
    ctx.fillStyle = "#2563eb";
    chartPoints.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
}
// โหลดข้อมูลตามปุ่มที่เลือก
async function loadStock(range) {
    activeRequest?.abort();
    const request = new AbortController();
    activeRequest = request;
    chartPoints = [];
    hideTooltip();
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    statusText.textContent = "กำลังโหลดราคาหุ้น META...";
    rangeButtons.forEach(button => {
        const selected = button.dataset.range === range;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
    try {
        if (!API_KEY.trim() || API_KEY === "ใส่_API_KEY_ของคุณ") {
            throw new Error("กรุณาใส่ API key ของ Twelve Data ก่อน");
        }
        const settings = stockSettings[range];
        const end = new Date();
        const params = new URLSearchParams({
            symbol: "META",
            interval: settings.interval,
            start_date: getStartDate(end, settings.months),
            end_date: end.toISOString().slice(0, 10),
            apikey: API_KEY.trim(),
        });
        const response = await fetch(`https://api.twelvedata.com/time_series?${params}`, { signal: request.signal });
        const data = await response.json();
        if (!response.ok || data.status === "error") {
            throw new Error(data.message || `โหลดไม่สำเร็จ (${response.status})`);
        }
        if (!Array.isArray(data.values)) {
            throw new Error("ไม่มีข้อมูลราคาหุ้นในช่วงนี้");
        }
        let points = data.values
            .map(p => ({ datetime: p.datetime, close: Number(p.close) }))
            .filter(p => typeof p.datetime === "string" &&
            Number.isFinite(Date.parse(`${p.datetime.slice(0, 10)}T00:00:00Z`)) &&
            Number.isFinite(p.close) && p.close > 0)
            .sort((a, b) => a.datetime.localeCompare(b.datetime));
        // รายปี: เก็บข้อมูลเดือนล่าสุดที่ได้รับของแต่ละปี
        if (range === "1Y") {
            const years = new Map();
            points.forEach(p => years.set(p.datetime.slice(0, 4), p));
            points = [...years.values()];
        }
        if (!points.length)
            throw new Error("ไม่มีข้อมูลในช่วงนี้");
        if (request.signal.aborted)
            return;
        drawChart(points);
        const latest = points[points.length - 1];
        statusText.textContent =
            `META · ${range} · ย้อนหลัง ${settings.months} เดือน` +
                ` · ราคาปิดล่าสุดในข้อมูล $${latest.close.toFixed(2)} USD`;
    }
    catch (error) {
        if (!request.signal.aborted) {
            statusText.textContent =
                error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ";
        }
    }
}
// ชี้ใกล้จุดเพื่อดูวันที่และราคาปิด
canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let nearest;
    let distance = 20;
    for (const item of chartPoints) {
        const screenX = item.x * rect.width / canvas.width;
        const screenY = item.y * rect.height / canvas.height;
        const d = Math.hypot(mouseX - screenX, mouseY - screenY);
        if (d <= distance) {
            distance = d;
            nearest = item.point;
        }
    }
    if (!nearest) {
        hideTooltip();
        return;
    }
    tooltip.textContent =
        `${nearest.datetime}\nราคาปิด $${nearest.close.toFixed(2)} USD`;
    tooltip.style.display = "block";
    tooltip.style.left = `${Math.max(8, Math.min(event.clientX + 14, window.innerWidth - tooltip.offsetWidth - 8))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(event.clientY + 14, window.innerHeight - tooltip.offsetHeight - 8))}px`;
});
canvas.addEventListener("pointerleave", hideTooltip);
canvas.addEventListener("pointercancel", hideTooltip);
window.addEventListener("scroll", hideTooltip, true);
window.addEventListener("resize", hideTooltip);
// ปุ่มเปลี่ยนช่วง
rangeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const range = button.dataset.range;
        if (range === "1D" || range === "1W" || range === "1M" || range === "1Y") {
            void loadStock(range);
        }
    });
});
// เริ่มที่รายวันย้อนหลัง 3 เดือน
void loadStock("1D");
