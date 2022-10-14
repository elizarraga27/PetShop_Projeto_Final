const express = require("express");
const produto = require("../models/produto");
const produtoSchema = require("../models/produto");

const router = express.Router();

//get todos os produtos
router.get('/produtos', (req, res) => {
    produtoSchema
    .find()
    .then((data) => res.json({ Produtos: data }))
    .catch((err) => res.json({message: err}));
});

// create produto
router.post('/produto', async (req, res) => {
    const produto = produtoSchema(req.body);
    try{
        const newProduto = await produto.save(produto)
        res.status(201).json({ Novo_Produto: newProduto })
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

router.get('/produto/nome/:nome', (req, res) => {
    const {nome}  = req.params;
    produtoSchema
    .findOne({ nome: nome})
    .then((data) =>{
       
        if(data == null){
            res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', nome })
            return;
        }
        else{
            res.status(200).json({ Produto: data })
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});

//get pelo nroProduto

router.get('/produto/nroProduto/:nroProduto', (req, res) => {
    const {nroProduto}  = req.params;
    produtoSchema
    .findOne({ nroProduto: nroProduto})
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'numero de produto não encontrado, numero de produto não cadastrado', nroProduto})
            return;
        }
        else{
            res.status(200).json({ Produto: data })
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});

//get produto pela id
router.get('/produto/:id', (req, res) => {
    const { id } = req.params;
    produtoSchema
    .findById(id)
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, a id não existe', id})
            return;
        }
        else{
            res.status(200).json({Produto: data})
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});

//update produto pela id
router.put('/produto/:id', async (req, res) => {
    const { id } = req.params;
    const produto = await produtoSchema.findOne({ _id: id });
    const {nroProduto, nome, valor, descrição } = req.body;

   try{

        if(!produto){
        res.status(404).json({ message: 'id não encontrado, id não existe', id })
        return;
      }
        else{
        produto.set(req.body);
         await  produto.save();
        res.status(200).json({ message: 'os dados do produto foi atualizado com sucesso!', produto})
        }
        
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
//update pelo numero de produto

router.put('/produto/nroProduto/:nroProduto', async (req, res) => {
    const { nroProduto } = req.params;
    const produto = await produtoSchema.findOne({ nroProduto: nroProduto });
    const { nome, valor, descrição } = req.body;

    try{

        if(!produto){
        res.status(404).json({ message: 'numero de produto não encontrado, numero de produto não existe', nroProduto })
        return;
      }
        else{
        produto.set(req.body);
         await  produto.save();
        res.status(200).json({ message: 'os dados do produto foi atualizado com sucesso!', produto})
        }
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
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

//update pelo nome

router.put('/produto/nome/:nome', async (req,res) => {
    const { nome } = req.params;
    const produto = await produtoSchema.findOne({ nome: nome });
    const { nroProduto, valor, descrição } = req.body;

   try{

        if(!produto){
        res.status(404).json({ message: 'nome de produto não encontrado, nome de produto não existe', nome })
        return;
      }
        else{
        produto.set(req.body);
         await  produto.save();
        res.status(200).json({ message: 'os dados do produto foi atualizado com sucesso!', produto})
        }
        
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

        else{
            res.status(500).json({message: err});
        }

    }
});

//delete produto pela id
router.delete('/produto/:id', (req, res) => {
    const { id } = req.params;
    produtoSchema
    .findOneAndDelete({ _id: id })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, id não existe', id})
            return;
        }
        else{
            res.status(200).json({ message: 'o produto foi excluido com sucesso!' })
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});

//delete produto pelo nome
router.delete('/produto/nome/:nome', (req, res) => {
    const { nome } = req.params;
    produtoSchema
    .findOneAndDelete({ nome: nome })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'nome do produto não encontrado, nome do produto não existe', nome})
            return;
        }
        else{
            res.status(200).json({ message: 'o produto foi excluido com sucesso!' })
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});

//delete produto pelo nroProduto
router.delete('/produto/nroProduto/:nroProduto', (req, res) => {
    const { nroProduto } = req.params;
    produtoSchema
    .findOneAndDelete({ nroProduto: nroProduto })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'numero de produto não encontrado, numero de produto não existe', nroProduto})
            return;
        }
        else{
            res.status(200).json({ message: 'o produto foi excluido com sucesso!' })
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})
});


module.exports = router;