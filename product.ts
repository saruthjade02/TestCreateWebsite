const param = new URLSearchParams(window.location.search);
const productID = param.get("id");

const ProductTitle = document.querySelector<HTMLHeadingElement>("#product-title");
const ProductImage = document.querySelector<HTMLImageElement>("#product-image");
const ProductDes = document.querySelector<HTMLParagraphElement>("#product-description");



if (ProductTitle && ProductImage && ProductDes) {
    if (productID === "quest") {
        ProductTitle.textContent = "Meta Quest 3";
        ProductImage.src = "Meta_Quest.jpg";
        ProductImage.alt = "Meta Quest 3";
        ProductImage.hidden = false;
        ProductDes.textContent = "Explore virtual worlds and bring digital experiences into your surroundings " +
            "with Meta Quest 3. Featuring pancake lenses for clear visuals, " +
            "it opens up new ways to enjoy gaming, entertainment, and mixed reality.";

    } else if (productID === "oakley") {
        ProductTitle.textContent = "Oakley Meta";
        ProductImage.src = "oakley_meta.jpg";
        ProductImage.alt = "Oakley Meta";
        ProductImage.hidden = false;
        ProductDes.textContent = "Bring a bold, sporty look to your everyday adventures with Oakley Meta. " +
    "Combining distinctive Oakley styling with a smart eyewear experience, " +
    "these glasses complement an active lifestyle.";

    } else if (productID === "rayban") {
        ProductTitle.textContent = "Ray-Ban Meta";
        ProductImage.src = "rayban-meta.jpg";
        ProductImage.alt = "Ray-Ban Meta";
        ProductImage.hidden = false;
        ProductDes.textContent = "Classic style meets smart technology with Ray-Ban Meta. " +
    "Discover iconic Ray-Ban design with a modern twist, " +
    "bringing a fresh perspective to your everyday moments.";

    }
    else {
        ProductTitle.textContent = "Product not found";
        ProductDes.textContent = "Please return to the product list and choose a product.";
    }
}
