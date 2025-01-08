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

    // Validar que la cédula sea solo números
    if (!/^\d+$/.test(usuario.cedula)) {
        return "Error: La cédula debe contener solo números.";
    }

    // Validar que nombres y apellidos sean solo letras
    if (!/^[a-zA-Z\s]+$/.test(usuario.nombres)) {
        return "Error: Los nombres deben contener solo letras.";
    }

    if (!/^[a-zA-Z\s]+$/.test(usuario.apellidos)) {
        return "Error: Los apellidos deben contener solo letras.";
    }

    // Validar que la edad sea solo números
    if (!/^\d+$/.test(usuario.edad)) {
        return "Error: La edad debe contener solo números.";
    }

    // Validar que la conducta sea una letra A, B o C
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

app.all('/all', (req, res) => {
    const metodo = req.method;

    if (metodo === 'GET') {
        const usuarios = leerUsuarios();

        if (req.query.cedula) { // Filtrar usuario por cédula
            
            const usuario = usuarios.find((u) => u.cedula === req.query.cedula);
            if (!usuario) {
                return res.status(404).send('Usuario no encontrado.');
            }
            return res.json(usuario);
        }

        // Listar todos los usuarios
        res.json(usuarios);
    } else if (metodo === 'POST') {
        const usuarios = leerUsuarios();
        const error = validarUsuario(req.body);

        if (error) {
            return res.status(400).send(error);
        }

        usuarios.push(req.body);
        guardarUsuarios(usuarios);
        res.send('Usuario agregado.');
    } else if (metodo === 'PUT') {
        const usuarios = leerUsuarios();
        const cedula = req.query.cedula;

        if (!cedula) {
            return res.status(400).send("Error: Se requiere el parámetro 'cedula' para actualizar un usuario.");
        }

        const index = usuarios.findIndex((u) => u.cedula === cedula);
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
    } else if (metodo === 'DELETE') {
        const usuarios = leerUsuarios();
        const cedula = req.query.cedula;

        if (!cedula) {
            return res.status(400).send("Error: Se requiere el parámetro 'cedula' para eliminar un usuario.");
        }

        const nuevosUsuarios = usuarios.filter((u) => u.cedula !== cedula);
        if (usuarios.length === nuevosUsuarios.length) {
            return res.status(404).send('Usuario no encontrado.');
        }

        guardarUsuarios(nuevosUsuarios);
        res.send('Usuario eliminado.');
    } else {
        res.status(405).send('Método no permitido.');
    }
});

// Puerto del servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
