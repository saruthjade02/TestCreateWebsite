//Setting
const button_setting = document.querySelectorAll<HTMLAnchorElement>(".nav-btn");
button_setting.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.classList.add("hovered");
  });

  button.addEventListener("mouseleave", () => {
    button.classList.remove("hovered");
  });
});


// ViewProfile  
const images = document.querySelectorAll<HTMLImageElement>(".ViewProfile__content img");
let currentIndex = 0;
const prev = document.querySelector<HTMLButtonElement>(".ViewProfile__controls .prev");
const next = document.querySelector<HTMLButtonElement>(".ViewProfile__controls .next");

function showImage() {
  images.forEach((image, index) => {
    if (index === currentIndex) {
      image.hidden = false;
    } else {
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
const slideTrack = document.querySelector<HTMLDivElement>(".SlideShow__content");
const slideImages = document.querySelectorAll<HTMLImageElement>(".SlideShow__content img");
const slidePrev = document.querySelector<HTMLButtonElement>(".slide-prev");
const slideNext = document.querySelector<HTMLButtonElement>(".slide-next");
const dots = document.querySelectorAll<HTMLSpanElement>(".SlideShow__dot");

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

// Stock META
const canvas = document.querySelector<HTMLCanvasElement>("#meta-chart");
const API_KEY: string = "86a7b668d85e411baac7d70046e8cb15";
const SettingStock = {
  "1D": { period: "1day", months: 3 },
  "1W": { period: "1week", months: 6 },
  "1M": { period: "1month", months: 12 },
  "1Y": { period: "1month", months: 60 }
}
type StockRange = keyof typeof SettingStock;

async function loadStock(range: StockRange) {
  const setting = SettingStock[range];
  const end = new Date();
  const start = new Date(end);

  start.setDate(1);
  start.setMonth(start.getMonth() - setting.months);

  const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const params = new URLSearchParams({
    symbol: "META",
    interval: setting.period,
    apikey: API_KEY,
    start_date: formatDate(start),
    end_date: formatDate(end)
  });

  //params มันคือ query parameter ที่ ใช้ระบุเงื่อนไขที่จะไปดึงข้อมูลได้แม่นขึ้น
  const response = await fetch(`https://api.twelvedata.com/time_series?${params}`, { method: "GET" });
  const data = await response.json();
  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
  }

  console.log(data.values);
}
function drawChart() {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#55607a"; // สีเส้น
  ctx.lineWidth = 2;          // ความหนาเส้น

  ctx.beginPath();
  ctx.moveTo(60, 20);
  ctx.lineTo(60, canvas.height - 40);
  ctx.lineTo(canvas.width - 20, canvas.height - 40);
  ctx.stroke();
}

drawChart();



//ปุ่มกด
const range_button = document.querySelectorAll<HTMLButtonElement>(".StockRange button");

range_button.forEach((button) => {
  button.addEventListener("click", () => {
    const range = button.dataset.range;
    if (
      range === "1D" ||
      range === "1W" ||
      range === "1M" ||
      range === "1Y"
    ) {
      loadStock(range);
    }
  });
});


// type StockRange = "1D" | "1W" | "1M" | "1Y";
// type StockPoint = { datetime: string; close: number };
// type StockResponse = {
//   status?: string;
//   message?: string;
//   values?: { datetime: string; close: string }[];
// };

// const API_KEY: string = "86a7b668d85e411baac7d70046e8cb15";

// const stockSettings = {
//   "1D": { interval: "1day", months: 3 },
//   "1W": { interval: "1week", months: 6 },
//   "1M": { interval: "1month", months: 12 },
//   "1Y": { interval: "1month", months: 60 },
// };

// const canvas = document.querySelector<HTMLCanvasElement>("#meta-chart")!;
// const statusText = document.querySelector<HTMLElement>("#stock-status")!;
// const rangeButtons =
//   document.querySelectorAll<HTMLButtonElement>("[data-range]");

// let activeRequest: AbortController | undefined;
// let chartPoints: { x: number; y: number; point: StockPoint }[] = [];

// // กล่องแสดงราคาเมื่อชี้จุด
// const tooltip = document.querySelector<HTMLDivElement>("#tooltip");

// function hideTooltip() {
//   if (tooltip) {
//     tooltip.style.display = "none";
//   }
// }

// // ย้อนเดือน โดยรองรับวันสิ้นเดือน
// function getStartDate(end: Date, months: number): string {
//   const start = new Date(end);
//   start.setUTCDate(1);
//   start.setUTCMonth(start.getUTCMonth() - months);

//   const lastDay = new Date(Date.UTC(
//     start.getUTCFullYear(), start.getUTCMonth() + 1, 0
//   )).getUTCDate();

//   start.setUTCDate(Math.min(end.getUTCDate(), lastDay));
//   return start.toISOString().slice(0, 10);
// }

// // วาดกราฟ ราคา และวันที่
// function drawChart(points: StockPoint[]) {
//   const ctx = canvas.getContext("2d");
//   if (!ctx || !points.length) return;

//   const w = canvas.width, h = canvas.height;
//   const left = 80, right = 25, top = 25, bottom = 45;

//   const prices = points.map(p => p.close);
//   const min = Math.min(...prices), max = Math.max(...prices);
//   const padding = Math.max((max - min) * 0.1, 1);
//   const low = min - padding, high = max + padding;

//   const times = points.map(p =>
//     Date.parse(`${p.datetime.slice(0, 10)}T00:00:00Z`)
//   );
//   const first = times[0]!;
//   const duration = times[times.length - 1]! - first;

//   const x = (time: number) =>
//     left + (duration ? (time - first) / duration : 0.5)
//     * (w - left - right);

//   const y = (price: number) =>
//     top + ((high - price) / (high - low)) * (h - top - bottom);

//   chartPoints = points.map((point, i) => ({
//     x: x(times[i]!),
//     y: y(point.close),
//     point,
//   }));
//   hideTooltip();

//   ctx.clearRect(0, 0, w, h);
//   ctx.fillStyle = "#ffffff";
//   ctx.fillRect(0, 0, w, h);
//   ctx.font = "13px sans-serif";
//   ctx.textAlign = "right";
//   ctx.textBaseline = "middle";

//   // ราคาแกนซ้ายและเส้นตาราง
//   for (let i = 0; i <= 4; i++) {
//     const price = high - ((high - low) * i) / 4;
//     const py = y(price);

//     ctx.fillStyle = "#475569";
//     ctx.fillText(`$${price.toFixed(2)}`, left - 10, py);

//     ctx.strokeStyle = "#e2e8f0";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(left, py);
//     ctx.lineTo(w - right, py);
//     ctx.stroke();
//   }

//   // วันที่เริ่ม กลาง และท้าย
//   ctx.fillStyle = "#475569";
//   ctx.textBaseline = "alphabetic";

//   const indices = [...new Set([
//     0, Math.floor((points.length - 1) / 2), points.length - 1,
//   ])];

//   indices.forEach((index, i) => {
//     ctx.textAlign = i === 0 ? "left"
//       : i === indices.length - 1 ? "right" : "center";

//     ctx.fillText(
//       points[index]!.datetime.slice(0, 10),
//       x(times[index]!),
//       h - 15
//     );
//   });

//   // เส้นราคา
//   ctx.strokeStyle = "#2563eb";
//   ctx.lineWidth = 2;
//   ctx.lineJoin = "round";
//   ctx.beginPath();

//   chartPoints.forEach((item, i) => {
//     if (i === 0) ctx.moveTo(item.x, item.y);
//     else ctx.lineTo(item.x, item.y);
//   });
//   ctx.stroke();

//   // แสดงจุดข้อมูล
//   ctx.fillStyle = "#2563eb";
//   chartPoints.forEach(item => {
//     ctx.beginPath();
//     ctx.arc(item.x, item.y, 2.5, 0, Math.PI * 2);
//     ctx.fill();
//   });
// }

// // โหลดข้อมูลตามปุ่มที่เลือก
// async function loadStock(range: StockRange) {
//   activeRequest?.abort();
//   const request = new AbortController();
//   activeRequest = request;

//   chartPoints = [];
//   hideTooltip();
//   canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
//   statusText.textContent = "กำลังโหลดราคาหุ้น META...";

//   rangeButtons.forEach(button => {
//     const selected = button.dataset.range === range;
//     button.classList.toggle("active", selected);
//     button.setAttribute("aria-pressed", String(selected));
//   });

//   try {
//     if (!API_KEY.trim() || API_KEY === "ใส่_API_KEY_ของคุณ") {
//       throw new Error("กรุณาใส่ API key ของ Twelve Data ก่อน");
//     }

//     const settings = stockSettings[range];
//     const end = new Date();
//     const params = new URLSearchParams({
//       symbol: "META",
//       interval: settings.interval,
//       start_date: getStartDate(end, settings.months),
//       end_date: end.toISOString().slice(0, 10),
//       apikey: API_KEY.trim(),
//     });

//     const response = await fetch(
//       `https://api.twelvedata.com/time_series?${params}`,
//       { signal: request.signal }
//     );
//     const data: StockResponse = await response.json();

//     if (!response.ok || data.status === "error") {
//       throw new Error(data.message || `โหลดไม่สำเร็จ (${response.status})`);
//     }
//     if (!Array.isArray(data.values)) {
//       throw new Error("ไม่มีข้อมูลราคาหุ้นในช่วงนี้");
//     }

//     let points: StockPoint[] = data.values
//       .map(p => ({ datetime: p.datetime, close: Number(p.close) }))
//       .filter(p =>
//         typeof p.datetime === "string" &&
//         Number.isFinite(Date.parse(`${p.datetime.slice(0, 10)}T00:00:00Z`)) &&
//         Number.isFinite(p.close) && p.close > 0
//       )
//       .sort((a, b) => a.datetime.localeCompare(b.datetime));

//     // รายปี: เก็บข้อมูลเดือนล่าสุดที่ได้รับของแต่ละปี
//     if (range === "1Y") {
//       const years = new Map<string, StockPoint>();
//       points.forEach(p => years.set(p.datetime.slice(0, 4), p));
//       points = [...years.values()];
//     }

//     if (!points.length) throw new Error("ไม่มีข้อมูลในช่วงนี้");
//     if (request.signal.aborted) return;

//     drawChart(points);
//     const latest = points[points.length - 1]!;

//     statusText.textContent =
//       `META · ${range} · ย้อนหลัง ${settings.months} เดือน` +
//       ` · ราคาปิดล่าสุดในข้อมูล $${latest.close.toFixed(2)} USD`;
//   } catch (error) {
//     if (!request.signal.aborted) {
//       statusText.textContent =
//         error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ";
//     }
//   }
// }

// // ชี้ใกล้จุดเพื่อดูวันที่และราคาปิด
// canvas.addEventListener("pointermove", event => {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = event.clientX - rect.left;
//   const mouseY = event.clientY - rect.top;

//   let nearest: StockPoint | undefined;
//   let distance = 20;

//   for (const item of chartPoints) {
//     const screenX = item.x * rect.width / canvas.width;
//     const screenY = item.y * rect.height / canvas.height;
//     const d = Math.hypot(mouseX - screenX, mouseY - screenY);

//     if (d <= distance) {
//       distance = d;
//       nearest = item.point;
//     }
//   }

//   if (!nearest) {
//     hideTooltip();
//     return;
//   }

//   if (!tooltip) return; // ถ้าหา tooltip ไม่เจอ หยุด callback นี้

//   tooltip.textContent =
//     `${nearest.datetime}\nราคาปิด $${nearest.close.toFixed(2)} USD`;

//   tooltip.style.display = "block";

//   tooltip.style.left = `${Math.max(
//     8,
//     Math.min(
//       event.clientX + 14,
//       window.innerWidth - tooltip.offsetWidth - 8
//     )
//   )}px`;

//   tooltip.style.top = `${Math.max(
//     8,
//     Math.min(
//       event.clientY + 14,
//       window.innerHeight - tooltip.offsetHeight - 8
//     )
//   )}px`;
// });

// canvas.addEventListener("pointerleave", hideTooltip);
// canvas.addEventListener("pointercancel", hideTooltip);
// window.addEventListener("scroll", hideTooltip, true);
// window.addEventListener("resize", hideTooltip);

// // ปุ่มเปลี่ยนช่วง
// rangeButtons.forEach(button => {
//   button.addEventListener("click", () => {
//     const range = button.dataset.range;
//     if (range === "1D" || range === "1W" || range === "1M" || range === "1Y") {
//       void loadStock(range);
//     }
//   });
// });

// // เริ่มที่รายวันย้อนหลัง 3 เดือน
// void loadStock("1D");
