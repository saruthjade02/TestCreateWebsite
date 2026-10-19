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
// tooltip
const tooltip = document.querySelector("#tooltip");
// Stock META
const canvas = document.querySelector("#meta-chart");
const API_KEY = "86a7b668d85e411baac7d70046e8cb15";
const SettingStock = {
    "1D": { period: "1day", months: 3 },
    "1W": { period: "1week", months: 6 },
    "1M": { period: "1month", months: 12 },
    "1Y": { period: "1month", months: 60 }
};
async function loadStock(range) {
    const setting = SettingStock[range];
    const end = new Date();
    const start = new Date(end);
    start.setDate(1);
    start.setMonth(start.getMonth() - setting.months);
    const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    //params มันคือ query parameter ที่ ใช้ระบุเงื่อนไขที่จะไปดึงข้อมูลได้แม่นขึ้น
    const params = new URLSearchParams({
        symbol: "META",
        interval: setting.period,
        apikey: API_KEY,
        start_date: formatDate(start),
        end_date: formatDate(end)
    });
    const response = await fetch(`https://api.twelvedata.com/time_series?${params}`, { method: "GET" });
    const data = await response.json();
    if (!response.ok || data.status === "error") {
        throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
    }
    console.log(data.values);
    const points = data.values.map((item) => ({
        datetime: item.datetime,
        close: Number(item.close)
    }));
    points.sort((a, b) => a.datetime.localeCompare(b.datetime));
    drawChart(points);
}
let chartPoints = [];
function drawChart(points) {
    chartPoints = [];
    if (!canvas || points.length < 2)
        return;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const left = 60, top = 20;
    const right = canvas.width - 20, bottom = canvas.height - 40;
    const graphWidth = right - left, graphHeight = bottom - top;
    const prices = points.map(point => point.close);
    const minPrice = Math.min(...prices), maxPrice = Math.max(...prices);
    const padding = Math.max((maxPrice - minPrice) * 0.1, 1);
    const low = minPrice - padding, high = maxPrice + padding;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#55607a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
    points.forEach((point, index) => {
        const x = left + (index / (points.length - 1)) * graphWidth;
        const y = bottom - ((point.close - low) / (high - low)) * graphHeight;
        chartPoints.push({ x, y, point });
    });
    // Fade the blue area
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, "rgba(37, 99, 235, 0.22)");
    gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    chartPoints.forEach(item => ctx.lineTo(item.x, item.y));
    ctx.lineTo(right, bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "#2563eb";
    ctx.beginPath();
    chartPoints.forEach((item, index) => {
        if (index === 0)
            ctx.moveTo(item.x, item.y);
        else
            ctx.lineTo(item.x, item.y);
    });
    ctx.stroke();
    ctx.font = "12px Mali, sans-serif";
    ctx.fillStyle = "#475569";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= 4; i++) {
        const ratio = i / 4;
        const price = high - ratio * (high - low);
        const y = top + ratio * graphHeight;
        ctx.fillText(price.toFixed(2), left - 8, y);
    }
    ctx.textBaseline = "top";
    const labelIndices = [0, Math.floor((points.length - 1) / 2), points.length - 1];
    [...new Set(labelIndices)].forEach(index => {
        const point = points[index];
        if (!point)
            return;
        const x = left + (index / (points.length - 1)) * graphWidth;
        ctx.textAlign = index === 0 ? "left" : index === points.length - 1 ? "right" : "center";
        ctx.fillText(point.datetime.slice(0, 10), x, bottom + 10);
    });
}
// Install tooltip listeners once, outside drawChart.
canvas?.addEventListener("pointermove", event => {
    if (!canvas || !tooltip)
        return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height)
        return;
    const mouseX = event.clientX - rect.left, mouseY = event.clientY - rect.top;
    let nearest;
    let closestDistance = 12;
    for (const item of chartPoints) {
        const x = item.x * rect.width / canvas.width;
        const y = item.y * rect.height / canvas.height;
        const distance = Math.hypot(mouseX - x, mouseY - y);
        if (distance <= closestDistance) {
            closestDistance = distance;
            nearest = item.point;
        }
    }
    if (!nearest) {
        tooltip.style.display = "none";
        return;
    }
    tooltip.textContent = `${nearest.datetime}\nราคา $${nearest.close.toFixed(2)}`;
    tooltip.style.display = "block";
    tooltip.style.left = `${Math.max(8, Math.min(event.clientX + 16, window.innerWidth - tooltip.offsetWidth - 8))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(event.clientY + 16, window.innerHeight - tooltip.offsetHeight - 8))}px`;
});
canvas?.addEventListener("pointerleave", () => {
    if (tooltip)
        tooltip.style.display = "none";
});
window.addEventListener("scroll", () => {
    if (tooltip)
        tooltip.style.display = "none";
}, true);
const range_button = document.querySelectorAll(".StockRange button");
range_button.forEach((button) => {
    button.addEventListener("click", () => {
        const range = button.dataset.range;
        if (range === "1D" ||
            range === "1W" ||
            range === "1M" ||
            range === "1Y") {
            loadStock(range);
        }
    });
});
loadStock("1D");
const loginBtn = document.querySelector("#login-btn");
const loginModal = document.querySelector("#login-modal");
const closeModalBtn = document.querySelector("#close-login");
loginBtn?.addEventListener("click", () => {
    loginModal?.showModal();
});
closeModalBtn?.addEventListener("click", () => {
    loginModal?.close();
});
const menuBtn = document.querySelector("#menu-btn");
const menuDialog = document.querySelector("#menu-dialog");
const closeMenuBtn = document.querySelector("#close-menu-btn");
menuBtn?.addEventListener("click", () => {
    menuDialog?.showModal();
});
closeMenuBtn?.addEventListener("click", () => {
    menuDialog?.close();
});
