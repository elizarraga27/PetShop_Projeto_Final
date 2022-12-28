const mongoose = require("mongoose");
const express = require("express");
const usuarioSchema = require("../models/usuario");



//const lerPergunta = async (pergunta) => {
//    try{
//        await client.connect();
//        //console.log('conected to server');
//        const db = client.db(dbName);
//        const collection = db.collection = db.collection('perguntas');
//        const consultaJson = await collection.findOne({pergunta: pergunta});
//        return consultaJson.reposta;
//    } catch(err){
//        return false;
//    }
//}

const getUser = async (user) => {
    try{
        
        const consultaJson = await usuarioSchema.findOne({user: user});
        return consultaJson.user;
    } catch(err){
        return false;
    }
}

const setUser = async(user) => {
    try{

        const consultaJson = await usuarioSchema.insertOne({user: user});
        return consultaJson.user;
    } catch(err) {
        return false;
    }
}

module.export = {
    setUser,
    getUser
}