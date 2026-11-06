const param = new URLSearchParams(window.location.search);
const productID = param.get("id");

const ProductTitle = document.querySelector<HTMLHeadingElement>("#product-title");
const ProductImage = document.querySelector<HTMLImageElement>("#product-image");
const ProductDes = document.querySelector<HTMLParagraphElement>("#product-description");
const ProductPrice = document.querySelector<HTMLParagraphElement>("#product-price");
const ButtonAddToCart = document.querySelector<HTMLButtonElement>(".product-add-to-cart");


if (ProductTitle && ProductImage && ProductDes && ProductPrice && ButtonAddToCart) {
    if (productID === "quest") {
        ProductTitle.textContent = "Meta Quest 3";
        ProductImage.src = "Meta_Quest.jpg";
        ProductImage.alt = "Meta Quest 3";
        ProductImage.hidden = false;
        ProductDes.textContent = "Explore virtual worlds and bring digital experiences into your surroundings " +
            "with Meta Quest 3. Featuring pancake lenses for clear visuals, " +
            "it opens up new ways to enjoy gaming, entertainment, and mixed reality.";
        ProductPrice.textContent = "$599.99";

    } else if (productID === "oakley") {
        ProductTitle.textContent = "Oakley Meta";
        ProductImage.src = "oakley_meta.jpg";
        ProductImage.alt = "Oakley Meta";
        ProductImage.hidden = false;
        ProductDes.textContent = "Bring a bold, sporty look to your everyday adventures with Oakley Meta. " +
            "Combining distinctive Oakley styling with a smart eyewear experience, " +
            "these glasses complement an active lifestyle.";
        ProductPrice.textContent = "$499.00";

    } else if (productID === "rayban") {
        ProductTitle.textContent = "Ray-Ban Meta";
        ProductImage.src = "rayban-meta.jpg";
        ProductImage.alt = "Ray-Ban Meta";
        ProductImage.hidden = false;
        ProductDes.textContent = "Classic style meets smart technology with Ray-Ban Meta. " +
            "Discover iconic Ray-Ban design with a modern twist, " +
            "bringing a fresh perspective to your everyday moments.";
        ProductPrice.textContent = "$449.00";

    }
    else {
        ProductTitle.textContent = "Product not found";
        ProductDes.textContent = "Please return to the product list and choose a product.";
        ProductPrice.textContent = "Price: Not available";
    }

    const loginRequiredDialog = document.querySelector<HTMLDialogElement>("#login-required");
    const closeLoginButton = document.querySelector<HTMLButtonElement>("#close-login");

    ButtonAddToCart.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/me", { method: "GET" });

            if (response.status === 401) {
                loginRequiredDialog?.showModal();
                return;
            }
            if (!response.ok) {
                console.error("Failed to load account");
                return;
            }

        }
        catch (error) {
            console.error("Error checking login status:", error);
        }

    });

    closeLoginButton?.addEventListener("click", () => {
        loginRequiredDialog?.close();
    });

}
