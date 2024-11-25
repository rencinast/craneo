document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const notification = document.getElementById('notification');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(registrationForm);
        const data = {
            username: formData.get('username').trim(),
            password: formData.get('password').trim(),
            confirmPassword: formData.get('confirmPassword').trim(),
            role: 'user'
        };

        console.log(data);

        // Validación de campos
        if (!data.username || !data.password || !data.confirmPassword) {
            showNotification('Por favor completa todos los campos.', 'error');
            return;
        }

        if (data.password !== data.confirmPassword) {
            showNotification('Las contraseñas no coinciden.', 'error');
            return;
        }

        fetch('/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(message => { throw new Error(message); });
            }
            return response.json();
        })
        .then(data => {
            showNotification(data.message, 'success'); // Muestra el mensaje de éxito
            if (data.status === 'success') {
                // Redirige a login.html después del registro exitoso
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            showNotification(error.message, 'error');
        });
    });

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        notification.style.opacity = '1'; // Asegura que la notificación sea visible

        // Ocultar la notificación después de 5 segundos
        setTimeout(() => {
            notification.style.opacity = '0'; // Transición de desvanecimiento
            setTimeout(() => {
                notification.style.display = 'none'; // Ocultar después de la transición
            }, 500); // Esperar a que termine la transición
        }, 5000);
    }
});