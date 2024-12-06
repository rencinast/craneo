document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('loggedIn');

    // Mostrar/ocultar elementos según el estado de inicio de sesión
    if (isLoggedIn === 'true') {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('userIconContainer').style.display = 'block';
    } else {
        document.getElementById('loginLink').style.display = 'block';
        document.getElementById('userIconContainer').style.display = 'none';
    }

    // Manejar el pop-up
    const userIconButton = document.getElementById('userIconButton');
    const userPopup = document.getElementById('userPopup');

    // Mostrar el pop-up al pasar el cursor sobre el ícono
    userIconButton.addEventListener('mouseover', function() {
        userPopup.style.display = 'block'; // Mostrar el pop-up
    });

    // Ocultar el pop-up al salir del ícono y del pop-up
    userIconButton.addEventListener('mouseout', function() {
        if (!userPopup.matches(':hover')) {
            userPopup.style.display = 'none'; // Ocultar el pop-up
        }
    });

    userPopup.addEventListener('mouseover', function() {
        userPopup.style.display = 'block'; // Mantener visible el pop-up
    });

    userPopup.addEventListener('mouseout', function() {
        userPopup.style.display = 'none'; // Ocultar el pop-up
    });

    // Manejar el cierre de sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch('/api/profiles/logout', {
                method: 'POST',
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                localStorage.removeItem('loggedIn'); // Eliminar el estado de inicio de sesión
                window.location.href = '/'; // Redirigir a la página de inicio
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});