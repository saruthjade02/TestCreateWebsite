const signupForm = document.querySelector<HTMLFormElement>("#signup-form");

signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector<HTMLInputElement>("#signup-name")!;
    const email = document.querySelector<HTMLInputElement>("#signup-email")!;
    const password = document.querySelector<HTMLInputElement>("#signup-password")!;
    const confirm = document.querySelector<HTMLInputElement>("#confirm-password")!;

    if (password.value !== confirm.value) {
        alert("รหัสผ่านสองช่องไม่ตรงกัน");
        return;
    }

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();
        if (response.status === 201) {
            window.location.href = '/index.html';
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
});
