const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const clienteRoutes = require("./routes/cliente");
const petRoutes = require("./routes/pet");
const servicoRoutes = require("./routes/serviço");
const produtoRoutes = require("./routes/produto");
const atendimentoRoutes = require("./routes/atendimento");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require("./swagger.json");
const venom = require('venom-bot');
const mg = require('./bot_whatsapp/mongo');


const app = express();
const port = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use('/api', clienteRoutes);
app.use('/api', petRoutes);
app.use('/api', servicoRoutes);
app.use('/api', produtoRoutes);
app.use('/api', atendimentoRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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

venom
    .create({headless: false})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    console.log('Iniciando o BOT...');
    client.onMessage(async (msg) => {
        try{
            //setar usuario no mongo
            const user = msg.from.replace(/\D/g, '');
            const getUser = await mg.getUser(user);

            if(getUser == false){
                setUserFrom = await mg.setUser(user);
            }

            //setar pergunta
           // const pergunta = msg.body;
            //const resposta = await mg.lerPergunta(pergunta);

            //if(resposta !== false){
            //    console.log('Reposta OK: ' + resposta);
            //    client.sendText(msg.from, resposta);
            //}

            //else if(reposta === false){
            //    client.sendText(msg.from, 'Não entendi sua pergunta.');
           // }


        }
        catch(e) {
            console.log(e);
        }
    });
}



app.listen(port, () => console.log(`servidor iniciado com sucesso! localhost:${port}/api`) );