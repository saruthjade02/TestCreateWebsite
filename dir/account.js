"use strict";
async function loadAccount() {
    const response = await fetch("/api/me");
    const data = await response.json();
    if (!response.ok) {
        console.error("Failed to load account");
        return;
    }
    const AccName = document.querySelector("#account-name");
    const AccEmail = document.querySelector("#account-email");
    if (AccName) {
        AccName.value = data.name;
    }
    if (AccEmail) {
        AccEmail.value = data.email;
    }
}
loadAccount();
const passwordFields = document.querySelector("#password-fields");
const passwordOption = document.querySelectorAll("input[name='ChangePassword']");
passwordOption.forEach(option => {
    option.addEventListener("change", () => {
        if (!passwordFields) {
            return;
        }
        if (option.value === "yes") {
            passwordFields.hidden = false; // Show
        }
        else {
            passwordFields.hidden = true; // Hide
        }
    });
});
const profileForm = document.querySelector("#profile-form");
profileForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const AccName = document.querySelector("#account-name");
    if (!AccName) {
        return;
    }
    let accountData = { name: AccName.value };
    if (passwordFields && !passwordFields.hidden) {
        const currentPassword = document.querySelector("#account-current-password");
        const newPassword = document.querySelector("#account-new-password");
        const confirmPassword = document.querySelector("#account-confirm-password");
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Password fields are missing");
            return;
        }
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            alert("Please fill in all password fields");
            return;
        }
        if (newPassword.value.length < 8) {
            alert("New password must be at least 8 characters long");
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            alert("New passwords do not match");
            return;
        }
        if (newPassword.value === currentPassword.value) {
            alert("รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม");
            return;
        }
        accountData = {
            name: AccName.value,
            currentPassword: currentPassword.value,
            newPassword: newPassword.value
        };
    }
    try {
        const res = await fetch("/api/update-value", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accountData)
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.message);
            return;
        }
        alert("Completely Record");
        window.location.href = "/";
    }
    catch (error) {
        console.error("Unable to save name:", error);
        alert("Unable to connect to the server");
    }
});
