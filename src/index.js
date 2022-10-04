const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const clienteRoutes = require("./routes/cliente");
const petRoutes = require("./routes/pet");
const servicoRoutes = require("./routes/serviço");
const produtoRoutes = require("./routes/produto");
const atendimentoRoutes = require("./routes/atendimento");

const app = express();
const port = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use('/api', clienteRoutes);
app.use('/api', petRoutes);
app.use('/api', servicoRoutes);
app.use('/api', produtoRoutes);
app.use('/api', atendimentoRoutes);
app.get('/api', (req, res) => {
    res.send("Projeto Api PetShop, insira rota certa!, e Bom trabalho!");

})
app.get('/', (req, res) => {
    res.send("Projeto Api PetShop, insira rota certa!, e Bom trabalho!");

})

// mongodb connection
mongoose.connect(process.env.mongodb_uri)
.then(() => console.log('Conexão a base de dados atlas com succeso!'))
.catch((erro) => console.log(erro));


app.listen(port, () => console.log('servidor iniciado com sucesso!', port) );