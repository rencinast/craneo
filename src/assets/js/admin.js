document.getElementById('logout').addEventListener('click', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    logout(); // Llamar a la función de cerrar sesión
});

// Función para mostrar notificaciones
function showNotification(message, type) {
    const notification = document.getElementById('notification');
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

// Función para obtener usuarios
async function fetchUsers() {
    try {
        const response = await fetch('/api/users/usuarios');
        const users = await response.json();

        if (!Array.isArray(users)) {
            console.error('La respuesta no es un array:', users);
            return; // Salir de la función si no es un array
        }

        const tbody = document.querySelector('#userList tbody');

        // Limpiar el contenido previo
        tbody.innerHTML = '';

        // Agregar cada usuario a la tabla
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.address}</td>
                <td>${user.extNumber}</td>
                <td>${user.colonia}</td>
                <td>${user.zip}</td>
                <td>${user.city}</td>
                <td>${user.state}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser (${user.user_id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        showNotification('Error al obtener usuarios.', 'error');
    }
}

// Función para eliminar un usuario
async function deleteUser (userId) {
    const confirmation = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmation) {
        try {
            const response = await fetch(`/api/users/usuario/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                showNotification(result.message, 'success'); // Mensaje de éxito
                fetchUsers(); // Volver a cargar la lista de usuarios
            } else {
                showNotification(result.message , 'error'); // Mensaje de error
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            showNotification('Ocurrió un error al intentar eliminar el usuario.', 'error');
        }
    }
}

// Función para cerrar sesión
async function logout() {
    try {
        const response = await fetch('/api/profiles/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.status === 'success') {
            localStorage.removeItem('loggedIn'); // Eliminar el estado de inicio de sesión
            window.location.href = '/'; 
        } else {
            showNotification(data.message, 'error'); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showNotification('Ocurrió un error al intentar cerrar sesión.', 'error');
    }
}

// Llamar a la función cuando se carga la página
window.onload = fetchUsers;