document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    let users = JSON.parse(localStorage.getItem('users')) || {};

    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', JSON.stringify({ username, name: users[username].name }));
            window.location.href = 'index.html';
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target['reg-username'].value;
        const name = e.target['reg-name'].value;
        const password = e.target['reg-password'].value;

        if (users[username]) {
            registerError.textContent = 'Username already exists.';
        } else {
            users[username] = { name, password };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ username, name }));
            window.location.href = 'index.html';
        }
    });
});