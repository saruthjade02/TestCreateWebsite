const login = document.querySelector<HTMLFormElement>("#login-form");


login?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector<HTMLInputElement>("#login-form #email")!;
    const password = document.querySelector<HTMLInputElement>("#login-form #password")!;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();
        if (response.ok) {
            const loginButton = document.querySelector<HTMLButtonElement>("#login-btn");

            if (loginButton) {
                loginButton.textContent = `🫪 ${data.name}`;
            }

            const modal = document.querySelector<HTMLDialogElement>("#login-modal");
            modal?.close();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Login failed");
        console.error("An error occurred due to:", error);
    }
});