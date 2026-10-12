const signupForm = document.querySelector<HTMLFormElement>('#signup-form');

signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
    };});