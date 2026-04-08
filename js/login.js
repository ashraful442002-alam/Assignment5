 document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
      } else {
        alert('Login Failed!\n\nUsername: admin\nPassword: admin123');
      }
    });

    // Optional: Auto focus username field
    window.onload = () => {
      document.getElementById('username').focus();
    };