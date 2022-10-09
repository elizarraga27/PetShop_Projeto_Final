const express = require("express");
const servicoSchema = require("../models/serviço");

const router = express.Router();

//get all serviços
router.get('/servicos', (req,res) => {
    servicoSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create serviço
router.post('/servicos', async (req,res) => {
    const serviço = servicoSchema(req.body);
    try{
        const newServiço = await serviço.save(serviço)
        res.status(200).json(newServiço)
    }
   
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000 && err.keyPattern.nroServiço == 1 ){
            res.status(400).send('Numero de Serviço já existe')
            return;
        }

        if(err.code == 11000 && err.keyPattern.nome == 1 ){
            res.status(400).send('serviço já existe')
            return;
            }

        else{
            res.status(500).json({message: err});
        }

    } 
});

//get serviço
router.get('/servicos/:id', (req,res) => {
    const { id } = req.params;
    servicoSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//get pelo nome

router.get('/servicos/nome/:nome', (req,res) => {
    const {nome}  = req.params;
    servicoSchema
    .findOne({ nome: nome})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get pelo numero serviço

router.get('/servicos/nroServico/:nroServico', (req,res) => {
    const {nroServico}  = req.params;
    servicoSchema
    .findOne({ nroServico: nroServico})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//update serviço
router.put('/servicos/:id', (req,res) => {
    const { id } = req.params;
    const { nroServiço, nome, valor, descrição } = req.body;
    servicoSchema
    .updateOne({ _id: id }, { $set: { nroServiço, nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pelo numero de serviço

router.put('/servicos/nroServico/:nroServico', (req,res) => {
    const { nroServico } = req.params;
    const { nome, valor, descrição } = req.body;
    servicoSchema
    .updateOne({ nroServiço: nroServico }, { $set: {nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pelo nome

router.put('/servicos/nome/:nome', (req,res) => {
    const { nome } = req.params;
    const {  valor, descrição } = req.body;
    servicoSchema
    .updateOne({ nome: nome }, { $set: { valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete serviço
router.delete('/servicos/:id', (req,res) => {
    const { id } = req.params;
    servicoSchema
    .remove({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete serviço pelo nome
router.delete('/servicos/nome/:nome', (req,res) => {
    const { nome } = req.params;
    servicoSchema
    .remove({ nome: nome })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete serviço pelo numero de serviço
router.delete('/servicos/nroServico/:nroServico', (req,res) => {
    const { nroServico } = req.params;
    servicoSchema
    .remove({ nroServiço: nroServico })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});


module.exports = router;