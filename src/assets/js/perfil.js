document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userInfo = document.getElementById('userInfo');
    const completeProfileBtn = document.getElementById('completeProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const notification = document.getElementById('notification'); // Contenedor de notificaciones

    // Elementos de los labels
    const nameLabel = document.getElementById('nameLabel');
    const emailLabel = document.getElementById('emailLabel');
    const phoneLabel = document.getElementById('phoneLabel');
    const addressLabel = document.getElementById('addressLabel');
    const extNumberLabel = document.getElementById('extNumberLabel');
    const coloniaLabel = document.getElementById('coloniaLabel');
    const zipLabel = document.getElementById('zipLabel');
    const cityLabel = document.getElementById('cityLabel');
    const stateLabel = document.getElementById('stateLabel');
    const sendButton = profileForm.querySelector('button[type="submit"]');

    if (username) {
        welcomeMessage.textContent = `Bienvenido, ${username}!`;
        loadUserInfo(username);
    } else {
        welcomeMessage.textContent = 'Bienvenido!';
    }

    completeProfileBtn.addEventListener("click", function () {
        const userId = localStorage.getItem("userId");
        if (userId) {
            document.getElementById("id").value = userId;
        } else {
            showNotification("ID del usuario es requerido.", 'error');
            return;
        }
    
        // Asignar valores de los labels a los inputs
        document.getElementById("name").value = nameLabel.textContent === "Sin información" ? "" : nameLabel.textContent;
        document.getElementById("email").value = emailLabel.textContent === "Sin información" ? "" : emailLabel.textContent;
        document.getElementById("phone").value = phoneLabel.textContent === "Sin información" ? "" : phoneLabel.textContent;
        document.getElementById("address").value = addressLabel.textContent === "Sin información" ? "" : addressLabel.textContent;
        document.getElementById("extNumber").value = extNumberLabel.textContent === "Sin información" ? "" : extNumberLabel.textContent;
        document.getElementById("colonia").value = coloniaLabel.textContent === "Sin información" ? "" : coloniaLabel.textContent;
        document.getElementById("zip").value = zipLabel.textContent === "Sin información" ? "" : zipLabel.textContent;
        document.getElementById("city").value = cityLabel.textContent === "Sin información" ? "" : cityLabel.textContent;
        document.getElementById("state").value = stateLabel.textContent === "Sin información" ? "" : stateLabel.textContent;
    
        // Ocultar labels y mostrar inputs
        hideLabelsAndShowInputs();
    
        // Ocultar botones de actualizar y eliminar
        completeProfileBtn.style.display = "none";
        document.getElementById("deleteAccountBtn").style.display = "none";
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const zip = document.getElementById('zip').value;
        const extNumber = document.getElementById('extNumber').value;

        // Verificar que el número exterior tenga entre 1 y 10 dígitos
        if (extNumber.length < 1 || extNumber.length > 10) {
            showNotification("El número exterior debe tener entre 1 y 10 dígitos.", 'error');
            return; // Detener el envío del formulario
        }
    
        // Verificar que el número exterior sea un número válido
        if (!/^\d+$/.test(extNumber)) {
            showNotification("El número exterior debe ser un número válido.", 'error');
            return; // Detener el envío del formulario
        }

        // Verificar que el código postal tenga exactamente 5 dígitos
        if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
            showNotification("El código postal debe ser exactamente de 5 dígitos.", 'error');
            return; // Detener el envío del formulario
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
            showNotification('ID del usuario es requerido.', 'error');
            return;
        }

        const data = {
            user_id: userId,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            extNumber: document.getElementById('extNumber').value,
            colonia: document.getElementById('colonia').value,
            zip: document.getElementById('zip').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
        };

        console.log('Datos a enviar:', data);

        fetch('/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showNotification('Perfil actualizado con éxito!', 'success');
                hideInputsAndShowLabels();
                completeProfileBtn.style.display = "block"; // Mostrar "Actualizar Perfil"
                document.getElementById("deleteAccountBtn").style.display = "block"; // Mostrar "Eliminar Cuenta"
            } else {
                showNotification('Error al actualizar el perfil: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error al actualizar el perfil.', 'error');
        });
    });

    function hideInputsAndShowLabels() {
        // Ocultar inputs
        document.getElementById('name').style.display = 'none';
        document.getElementById('email').style.display = 'none';
        document.getElementById('phone').style.display = 'none';
        document.getElementById('address').style.display = 'none';
        document.getElementById('extNumber').style.display = 'none';
        document.getElementById('colonia').style.display = 'none';
        document.getElementById('zip').style.display = 'none';
        document.getElementById('city').style.display = 'none';
        document.getElementById('state').style.display = 'none';
        sendButton.style.display = 'none'; // Ocultar el botón "Enviar"

        // Mostrar labels
        nameLabel.style.display = 'block';
        emailLabel.style.display = 'block';
        phoneLabel.style.display = 'block';
        addressLabel.style.display = 'block';
        extNumberLabel.style.display = 'block';
        coloniaLabel.style.display = 'block';
        zipLabel.style.display = 'block';
        cityLabel.style.display = 'block';
        stateLabel.style.display = 'block';

        // Actualizar labels con los nuevos valores
        nameLabel.textContent = document.getElementById('name').value || 'Sin información';
        emailLabel.textContent = document.getElementById('email').value || 'Sin información';
        phoneLabel.textContent = document.getElementById('phone').value || 'Sin información';
        addressLabel.textContent = document.getElementById('address').value || 'Sin información';
        extNumberLabel.textContent = document.getElementById('extNumber').value || 'Sin información';
        coloniaLabel.textContent = document.getElementById('colonia').value || 'Sin información';
        zipLabel.textContent = document.getElementById('zip').value || 'Sin información';
        cityLabel.textContent = document.getElementById('city').value || 'Sin información';
        stateLabel.textContent = document.getElementById('state').value || 'Sin información';
    }

    function hideLabelsAndShowInputs() {
        // Ocultar labels
        nameLabel.style.display = 'none';
        emailLabel.style.display = 'none';
        phoneLabel.style.display = 'none';
        addressLabel.style.display = 'none';
        extNumberLabel.style.display = 'none';
        coloniaLabel.style.display = 'none';
        zipLabel.style.display = 'none';
        cityLabel.style.display = 'none';
        stateLabel.style.display = 'none';

        // Mostrar inputs
        document.getElementById("name").style.display = "block";
        document.getElementById("email").style.display = "block";
        document.getElementById("phone").style.display = "block";
        document.getElementById("address").style.display = "block";
        document.getElementById("extNumber").style.display = "block";
        document.getElementById("colonia").style.display = "block";
        document.getElementById("zip").style.display = "block";
        document.getElementById("city").style.display = "block";
        document.getElementById("state").style.display = "block";
        sendButton.style.display = "block"; // Mostrar el botón "Enviar"
    }

    function loadUserInfo(username) {
        fetch(`/get-user-info?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    nameLabel.textContent = data.name || 'Sin información';
                    emailLabel.textContent = data.email || 'Sin información';
                    phoneLabel.textContent = data.phone || 'Sin información';
                    addressLabel.textContent = data.address || 'Sin información';
                    extNumberLabel.textContent = data.extNumber || 'Sin información';
                    coloniaLabel.textContent = data.colonia || 'Sin información';
                    zipLabel.textContent = data.zip || 'Sin información';
                    cityLabel.textContent = data.city || 'Sin información';
                    stateLabel.textContent = data.state || 'Sin información';
                } else {
                    userInfo.innerHTML = '<p>Sin información disponible.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar la información del usuario:', error);
                userInfo.innerHTML = '<p>Error al cargar la información del usuario.</p>';
            });
    }

    // Eliminar cuenta
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    deleteAccountBtn.addEventListener("click", function () {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            showNotification("ID del usuario es requerido.", 'error');
            return; // Detener la acción si no hay ID
        }

        if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            fetch(`/api/users/${userId}`, { // Cambiar la URL aquí
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Cerrar sesión después de eliminar la cuenta
                    return fetch('/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    showNotification('Error al eliminar la cuenta: ' + data.message, 'error');
                }
            })
            .then(logoutResponse => {
                if (!logoutResponse.ok) {
                    throw new Error('Error al cerrar sesión: ' + logoutResponse.status);
                }
                return logoutResponse.json();
            })
            .then(logoutData => {
                if (logoutData.status === 'success') {
                    showNotification('Cuenta eliminada y sesión cerrada con éxito!', 'success');
                    // Redirigir al usuario a la página de inicio de sesión
                    window.location.href = 'login.html'; // Cambia esto a la URL de tu página de inicio de sesión
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error al eliminar la cuenta o cerrar sesión.', 'error');
            });
        }
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