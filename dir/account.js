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
