const bcrypt = require('bcrypt');

const password = 'admin'; // La contraseña en texto claro
const hashedPassword = '$2b$10$gWFLlWoUb20uCR.se2Gzaei1iQ5FjEvSlVaWxOp3vmE69A8l90JNe'; // El hash de la contraseña

bcrypt.compare(password, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error('Error en la comparación:', err);
    } else {
        console.log('¿La contraseña coincide?', isMatch); // Debe imprimir true
    }
});

const passwordgen = 'admin'; // La contraseña en texto claro

bcrypt.hash(passwordgen, 10, (err, hashedPasswordgen) => {
    if (err) {
        console.error('Error al generar el hash:', err);
    } else {
        console.log('Hash generado:', hashedPasswordgen);
    }
});