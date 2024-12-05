document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    console.log('Datos a enviar:', data);

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.status === 'success') {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);

            // Redirigir según el rol
            if (data.role === 'admin') {
                window.location.href = '/admin'; // Redirigir al panel de administración
            } else {
                window.location.href = '/'; // Redirigir a la página de usuario normal
            }
        } else {
            console.log('Error en el inicio de sesión:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar iniciar sesión.');
    });
});