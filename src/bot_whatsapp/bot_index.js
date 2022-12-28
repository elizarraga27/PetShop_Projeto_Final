const venom = require('venom-bot');
const mg = require('./mongo');
const mongoose = require("mongoose");
const express = require("express");
const usuarioSchema = require("../models/usuario");




venom
    .create({headless: false})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    console.log('Iniciando o BOT...');
    client.onMessage(async (message) => {
        try{
            //setar usuario no mongo
            const numero = message.from;
            console.log(numero);
            const getUser = await usuarioSchema.findOne({user: numero});;
            

            if(!getUser){
                const usuario = usuarioSchema( {user: numero} )
                await usuario.save();
                return
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

