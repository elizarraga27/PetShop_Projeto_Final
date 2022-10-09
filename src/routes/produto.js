const express = require("express");
const produto = require("../models/produto");
const produtoSchema = require("../models/produto");

const router = express.Router();

//get all produtos
router.get('/produtos', (req,res) => {
    produtoSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create produto
router.post('/produtos', async (req,res) => {
    const produto = produtoSchema(req.body);
    try{
        const newProduto = await produto.save(produto)
        res.status(200).json(newProduto)
    }
   
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000 && err.keyPattern.nroProduto == 1 ){
            res.status(400).send('Numero de Produto já existe')
            return;
        }

        if(err.code == 11000 && err.keyPattern.nome == 1 ){
            res.status(400).send('Produto já existe')
            return;
            }

        else{
            res.status(500).json({message: err});
        }

    } 
});


//get pelo nome

router.get('/produtos/nome/:nome', (req,res) => {
    const {nome}  = req.params;
    produtoSchema
    .findOne({ nome: nome})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get pelo nroProduto

router.get('/produtos/nroProduto/:nroProduto', (req,res) => {
    const {nroProduto}  = req.params;
    produtoSchema
    .findOne({ nroProduto: nroProduto})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get produto
router.get('/produtos/:id', (req,res) => {
    const { id } = req.params;
    produtoSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update produto
router.put('/produtos/:id', (req,res) => {
    const { id } = req.params;
    const {nroProduto, nome, valor, descrição } = req.body;
    produtoSchema
    .updateOne({ _id: id }, { $set: { nroProduto, nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});
//update pelo numero de produto

router.put('/produtos/nroProduto/:nroProduto', (req,res) => {
    const { nroProduto } = req.params;
    const { nome, valor, descrição } = req.body;
    produtoSchema
    .updateOne({ nroProduto: nroProduto }, { $set: {nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pelo nome

router.put('/produtos/nome/:nome', (req,res) => {
    const { nome } = req.params;
    const {  valor, descrição } = req.body;
    produtoSchema
    .updateOne({ nome: nome }, { $set: { valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete produto
router.delete('/produtos/:id', (req,res) => {
    const { id } = req.params;
    produtoSchema
    .remove({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete produto pelo nome
router.delete('/produtos/nome/:nome', (req,res) => {
    const { nome } = req.params;
    produtoSchema
    .remove({ nome: nome })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete produto pelo nroProduto
router.delete('/produtos/nroProduto/:nroProduto', (req,res) => {
    const { nroProduto } = req.params;
    produtoSchema
    .remove({ nroProduto: nroProduto })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});


module.exports = router;