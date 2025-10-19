document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validasi sederhana
    if (email && password) {
        alert('Login berhasil! Selamat datang di MancingMo');
        // Redirect ke halaman utama
        window.location.href = 'index.html';
    } else {
        alert('Mohon lengkapi semua field');
    }
});