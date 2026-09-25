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

