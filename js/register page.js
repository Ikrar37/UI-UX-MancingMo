// Password strength checker
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    strengthBar.className = 'strength-bar-fill';
    
    if (strength === 0) {
        strengthText.textContent = '';
    } else if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Password lemah';
        strengthText.style.color = '#f44336';
    } else if (strength === 3) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Password sedang';
        strengthText.style.color = '#ff9800';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Password kuat';
        strengthText.style.color = '#4caf50';
    }
});

// Form validation
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validasi
    if (!firstName || !lastName || !email || !phone || !password) {
        alert('Mohon lengkapi semua field yang wajib diisi (*)');
        return;
    }

    if (password.length < 8) {
        alert('Password harus minimal 8 karakter');
        return;
    }

    if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak cocok');
        return;
    }

    if (!terms) {
        alert('Anda harus menyetujui Syarat & Ketentuan');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Format email tidak valid');
        return;
    }

    // Phone validation
    if (phone.length < 10) {
        alert('Nomor telepon tidak valid');
        return;
    }

    // Success
    alert('Pendaftaran berhasil! Selamat datang di MancingMo');
    window.location.href = 'login page.html';
});