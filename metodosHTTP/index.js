const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bdd_simulada = 'usuarios.json';
const campos = ["cedula", "nombres", "apellidos", "edad", "curso", "conducta"];

const leerUsuarios = () => {
    if (fs.existsSync(bdd_simulada)) {
        return JSON.parse(fs.readFileSync(bdd_simulada, 'utf-8'));
    }
    return [];
};

const guardarUsuarios = (data) => {
    fs.writeFileSync(bdd_simulada, JSON.stringify(data, null, 2));
};

const validarUsuario = (usuario) => {
    const camposExtra = Object.keys(usuario).filter((campo) => !campos.includes(campo));
    if (camposExtra.length > 0) {
        return `Error: Los siguientes campos no son permitidos: ${camposExtra.join(', ')}.`;
    }

    for (const campo of campos) {
        if (usuario[campo] === undefined) {
            return `Error: El campo '${campo}' es obligatorio.`;
        }
    }

    if (!['A', 'B', 'C'].includes(usuario.conducta)) {
        return "Error: La 'conducta' debe ser una letra A, B o C.";
    }

    return null;
};

// Agregar usuario
app.post('/usuarios', (req, res) => {
    const usuarios = leerUsuarios();
    const error = validarUsuario(req.body);
    if (error) {
        return res.send(error); 
    }

    usuarios.push(req.body);
    guardarUsuarios(usuarios);
    res.send('Usuario agregado.');
});

// Listar todos los usuarios
app.get('/usuarios', (req, res) => {
    const usuarios = leerUsuarios();
    res.json(usuarios);
});

// Filtrar usuarios por cédula
app.get('/usuarios/cedula/:cedula', (req, res) => {
    const usuarios = leerUsuarios();
    const usuario = usuarios.find((u) => u.cedula === req.params.cedula);
    if (!usuario) {
        return res.status(404).send('Usuario no encontrado.');
    }
    res.json(usuario);
});

// Actualizar usuario
app.put('/usuarios/:cedula', (req, res) => {
    const usuarios = leerUsuarios();
    const index = usuarios.findIndex((u) => u.cedula === req.params.cedula);

    if (index === -1) {
        return res.status(404).send('Usuario no encontrado.');
    }

    const error = validarUsuario(req.body);
    if (error) {
        return res.status(400).send(error);
    }

    usuarios[index] = { ...usuarios[index], ...req.body };
    guardarUsuarios(usuarios);
    res.send('Usuario actualizado.');
});

// Eliminar usuario
app.delete('/usuarios/:cedula', (req, res) => {
    const usuarios = leerUsuarios();
    const nuevosUsuarios = usuarios.filter((u) => u.cedula !== req.params.cedula);
    guardarUsuarios(nuevosUsuarios);
    res.send('Usuario eliminado.');
});

// Puerto del servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
