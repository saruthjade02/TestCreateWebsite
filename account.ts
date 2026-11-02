async function loadAccount() {
    const response = await fetch("/api/me");

    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to load account");
        return;
    }
    const AccName = document.querySelector<HTMLInputElement>("#account-name");
    const AccEmail = document.querySelector<HTMLInputElement>("#account-email");

    if (AccName) {
        AccName.value = data.name;
    }

    if (AccEmail) {
        AccEmail.value = data.email;
    }
}

loadAccount();


const submitBtn = document.querySelector<HTMLButtonElement>("#submit-profile");
submitBtn?.addEventListener("click", async () => {
    const AccName = document.querySelector<HTMLInputElement>("#account-name");
    const AccEmail = document.querySelector<HTMLInputElement>("#account-email");


});