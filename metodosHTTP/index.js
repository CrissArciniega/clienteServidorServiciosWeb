const express = require('express');
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Middleware para procesar application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Servicio POST
app.post('/mpost', function (req, res) {
    console.log("Cuerpo recibido (form-urlencoded):", req.body); // Log para depuración

    const num1 = req.body.num1;
    const num2 = req.body.num2;

    if (!num1 || !num2) {
        return res.status(400).send('Error: num1 o num2 no proporcionados.');
    }

    let resultado = parseInt(num1) + parseInt(num2);
    res.send('Metodo post resultado: ' + num1 + '+' + num2 + '=' + resultado);
});

app.put('/mput', function (req, res) {
    const body=req.body;
    let area=parseInt(body.lado)*parseInt(body.lado);
    let perimetro=parseInt(body.lado)*4;

    res.send('Método Put: Area: '+area+' Perimetro: '+perimetro);
});

app.delete('/mdelete', function (req, res) {
    const body=req.body;
    let cedula=body.cedula;
    
    res.send('Método Delete: Usuario de cédula '+cedula+'  eliminado');
});

app.all('/mall', (req, res) => {
    res.send('Se recibió una solicitud ${req.method} en la ruta /mall.');
});

//llamada al puerto por defecto de node 3000
app.listen(3000, () => {
    console.log('Escuchando a través del puerto 3000')
});