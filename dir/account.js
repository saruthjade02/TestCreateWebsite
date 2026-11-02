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
const profileForm = document.querySelector("#profile-form");
profileForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const AccName = document.querySelector("#account-name");
    if (!AccName) {
        return;
    }
    try {
        const res = await fetch("/api/update-value", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: AccName.value
            })
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
