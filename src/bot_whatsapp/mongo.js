const mongoose = require("mongoose");

const client = new mongoose('mongodb+srv://toti:toti@petshop.ktnnarp.mongodb.net/PetShop?retryWrites=true&w=majority');
const dbName = 'PetShop';


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
        await client.connect();
        //console.log('conected to server');
        const db = client.db(dbName);
        const collection = db.collection('usuarios');
        const consultaJson = await collection.findOne({user: user});
        return consultaJson.user;
    } catch(err){
        return false;
    }
}

const setUser = async(user) => {
    try{
        await client.connect();
        //console.log('conected to server');
        const db = client.db(dbName);
        const collection = db.collection('usuarios');
        const consultaJson = await collection.insertOne({user: user});
        return consultaJson;
    } catch(err) {
        return false;
    }
}

module.export = {
    //lerPergunta,
    setUser,
    getUser
}