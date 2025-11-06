// login-script.js (fixed)
// Simple client-side mock login for demo only.
// Valid credentials: admin / 123456

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const err = document.getElementById('error-message');

    const validUsername = 'admin';
    const validPassword = '123456';

    if (username === validUsername && password === validPassword) {
        localStorage.setItem('adminLoggedIn', 'true');
        // Optional: store a simple admin name
        localStorage.setItem('adminName', 'Admin MangaXYZ');
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        err.classList.remove('d-none');
    }
});
