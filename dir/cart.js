"use strict";
const cartItems = document.querySelector("#cart-items");
const products = {
    "quest": {
        name: "Meta Quest 3",
        price: "$599.99",
        image: "Meta_Quest.jpg"
    },
    "oakley": {
        name: "Oakley Meta",
        price: "$499.00",
        image: "oakley_meta.jpg"
    },
    "rayban": {
        name: "Ray-Ban Meta",
        price: "$449.00",
        image: "rayban-meta.jpg"
    }
};
async function loadCartItems() {
    let total = 0;
    try {
        const response = await fetch("/api/cart", { method: "GET" });
        if (!response.ok || !cartItems)
            return;
        const cart = await response.json();
        cart.forEach(item => {
            const product = products[item.product_id];
            if (!product)
                return;
            total += Number(product.price.replace("$", "")) * item.quantity;
            const row = document.createElement("div");
            const image = document.createElement("img");
            const imageBox = document.createElement("div");
            const name = document.createElement("span");
            const price = document.createElement("span");
            const quantity = document.createElement("span");
            row.className = "cart-item";
            imageBox.className = "cart-item-image-visual";
            image.className = "cart-item-image";
            name.className = "cart-item-name";
            price.className = "cart-item-price";
            quantity.className = "cart-item-quantity";
            image.src = product.image;
            image.alt = product.name;
            imageBox.append(image);
            name.textContent = product.name;
            price.textContent = product.price;
            quantity.textContent = `Quantity: ${item.quantity}`;
            row.append(imageBox, name, price, quantity);
            cartItems.append(row);
            const Total = document.querySelector("#cart-total");
            if (Total) {
                Total.textContent = `Total Price : $${total}`;
            }
        });
    }
    catch (error) {
        console.error("Error loading cart items:", error);
    }
}
loadCartItems();
