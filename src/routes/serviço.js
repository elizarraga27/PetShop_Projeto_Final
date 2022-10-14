const express = require("express");
const servicoSchema = require("../models/serviço");

const router = express.Router();

//get todos os serviços
router.get('/servicos', (req, res) => {
    servicoSchema
    .find()
    .then((data) => res.json({ Serviços: data }))
    .catch((err) => res.json({message: err}));
});

// create serviço
router.post('/servico', async (req, res) => {
    const serviço = servicoSchema(req.body);
    try{
        const newServiço = await serviço.save(serviço)
        res.status(201).json(newServiço)
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

//get serviço pela id
router.get('/servico/:id', (req, res) => {
    const { id } = req.params;
    servicoSchema
    .findById(id)
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, a id não existe', id})
            return;
        }
        else{
            res.status(200).json({Serviço: data})
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

//get pelo nome

router.get('/servico/nome/:nome', (req, res) => {
    const {nome}  = req.params;
    servicoSchema
    .findOne({ nome: nome})
    .then((data) =>{
       
        if(data == null){
            res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', nome })
            return;
        }
        else{
            res.status(200).json({ Serviço: data })
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

//get pelo numero serviço

router.get('/servico/nroServico/:nroServico', (req, res) => {
    const {nroServico}  = req.params;
    servicoSchema
    .findOne({ nroServico: nroServico})
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'numero de serviço não encontrado, numero de serviço não cadastrado', nroServico})
            return;
        }
        else{
            res.status(200).json({ Serviço: data })
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

//update serviço pela id
router.put('/servico/:id', async (req, res) => {
    const { id } = req.params;
    const servico = await servicoSchema.findOne({ _id: id });
    const { nroServiço, nome, valor, descrição } = req.body;

     try{

        if(!servico){
        res.status(404).json({ message: 'id não encontrado, id não existe', id })
        return;
      }
        else{
        servico.set(req.body);
         await  servico.save();
        res.status(200).json({ message: 'os dados do serviço foi atualizado com sucesso!', servico})
        }
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000 && err.keyPattern.nroServico == 1 ){
            res.status(400).send('Numero de serviço já existe')
            return;
        }

        if(err.code == 11000 && err.keyPattern.nome == 1 ){
            res.status(400).send('Serviço já existe')
            return;
            }
        else{
            res.status(500).json({message: err});
        }

    }
});

//update pelo numero de serviço

router.put('/servico/nroServico/:nroServico', async (req, res) => {
    const { nroServico } = req.params;
    const servico = await servicoSchema.findOne({ nroServico: nroServico });
    const { nome, valor, descrição } = req.body;

     try{

        if(!servico){
        res.status(404).json({ message: 'numero de serviço não encontrado, numero de serviço não existe', nroServico })
        return;
      }
        else{
        servico.set(req.body);
         await  servico.save();
        res.status(200).json({ message: 'os dados do serviço foi atualizado com sucesso!', servico})
        }
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
      
        if(err.code == 11000 && err.keyPattern.nome == 1 ){
            res.status(400).send('Serviço já existe')
            return;
            }
        else{
            res.status(500).json({message: err});
        }

    }
});

//update pelo nome

router.put('/servico/nome/:nome', async (req, res) => {
    const { nome } = req.params;
    const servico = await servicoSchema.findOne({ nome: nome });
    const { nroServico, valor, descrição } = req.body;

    try{

        if(!servico){
        res.status(404).json({ message: 'nome de serviço não encontrado, nome de serviço não existe', nome })
        return;
      }
        else{
        servico.set(req.body);
         await  servico.save();
        res.status(200).json({ message: 'os dados do serviço foi atualizado com sucesso!', servico})
        }
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000 && err.keyPattern.nroServico == 1 ){
            res.status(400).send('Numero de serviço já existe')
            return;
        }

        else{
            res.status(500).json({message: err});
        }

    }
});

//delete serviço pela id
router.delete('/servico/:id', (req, res) => {
    const { id } = req.params;
    servicoSchema
    .findOneAndDelete({ _id: id })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, id não existe', id})
            return;
        }
        else{
            res.status(200).json({ message: 'o serviço foi excluido com sucesso!' })
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

//delete serviço pelo nome
router.delete('/servico/nome/:nome', (req, res) => {
    const { nome } = req.params;
    servicoSchema
    .findOneAndDelete({ nome: nome })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'nome de serviço não encontrado, nome de serviço não existe', nome})
            return;
        }
        else{
            res.status(200).json({ message: 'o serviço foi excluido com sucesso!' })
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

//delete serviço pelo numero de serviço
router.delete('/servico/nroServico/:nroServico', (req, res) => {
    const { nroServico } = req.params;
    servicoSchema
    .findOneAndDelete({ nroServiço: nroServico })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'numero de serviço não encontrado, numero de serviço não existe', nroServico})
            return;
        }
        else{
            res.status(200).json({ message: 'o serviço foi excluido com sucesso!' })
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