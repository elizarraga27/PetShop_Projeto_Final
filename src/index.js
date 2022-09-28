const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const clienteRoutes = require("./routes/cliente");
const petRoutes = require("./routes/pets");
const servicoRoutes = require("./routes/serviços");

const app = express();
const port = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use('/api', clienteRoutes);
app.use('/api', petRoutes);
app.use('/api', servicoRoutes);

app.get('/', (req, res) => {
    res.send("teste a api");

})

// mongodb connection
mongoose.connect(process.env.mongodb_uri)
.then(() => console.log('Conexão a base de dados atlas com succeso!'))
.catch((erro) => console.log(erro));


app.listen(port, () => console.log('servidor iniciado com sucesso!', port) );