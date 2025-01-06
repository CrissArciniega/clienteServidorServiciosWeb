//PROTOCOLO DE INTERCAMBIO
const express = require('express');
const app = express();
app.use(express.json());

//SERVICIO WEB
app.post('/mpost', function (req, res) {
    const body=req.body;
    let resultado=parseInt(body.num1)+parseInt(body.num2);

    res.send('Metodo post resultado: '+body.num1+'+'+body.num2+'='+resultado);
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
    res.send(`Se recibió una solicitud ${req.method} en la ruta /info.`);
});

//llamada al puerto por defecto de node 3000
app.listen(3000, () => {
    console.log('Escuchando a través del puerto 3000')
});
