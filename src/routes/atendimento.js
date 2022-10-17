const express = require("express");
const atendimento = require("../models/atendimento");
const atendimentoSchema = require("../models/atendimento");
const clienteSchema = require("../models/cliente");
const produtoSchema = require("../models/produto");
const servicoSchema = require("../models/serviço");

const router = express.Router();


// create cliente
router.post('/atendimento', async (req ,res) => {
  const atendimento = atendimentoSchema(req.body);
  const clienteId = atendimento.cliente;
  const servicoId = atendimento.serviço;
  const produtoId = atendimento.produto;
  const cliente = await clienteSchema.findById(clienteId);
  const servico = await servicoSchema.findById(servicoId);
  const produto = await produtoSchema.findById(produtoId);

  try{

    if(!cliente){
      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteId})
      return;
    }

    if(!servico){
      res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', servicoId})
      return;
    }

    if(!produto){
      res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoId})
      return;
    }

    else{
      const newAtendimento = await atendimento.save(atendimento)
      res.status(200).json(newAtendimento)
    }
  }
 
  catch(err){
      if(err.name == "ValidationError"){
          res.status(400).json({message: err})
          return;
      }
      if(err.code == 11000){
          res.status(400).send('numero de ordem já existe')
          return;
      }
      else{
          res.status(500).json({message: err});
      }

  } 
});
//Get All atendimentos
router.get('/atendimentos', (req, res) => {

atendimento
  .find()
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) => res.json({ Atendimento: data }))
  .catch((err) => res.json({message: err}));
  
});

//get pelo cpf
router.get('/atendimento/cpf/:cpf', async (req, res) => {
  const {cpf}  = req.params;
  const cliente = await clienteSchema.findOne({cpf});
  const validateCpf = (cpf) => {
    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
    return re.test(cpf);
};

try{

  if(!validateCpf(cpf)){
      res.status(400).json({ message: 'cpf invalido', cpf})
      return;
  } 
      
  if(!cliente){
      res.status(404).json({ message: 'cpf não encontrado, cpf não cadastrado', cpf})
      return;
  } 
  else{
      const clienteId = cliente._id;
      const tutorId = await atendimentoSchema.find({ cliente: clienteId})
      .populate({path:'cliente', select: 'nome cpf'})
      .populate({path:'produto', select:'nome valor'})
      .populate({path:'serviço', select:'nome valor'})
      const clienteVal = await atendimentoSchema.findOne({ cliente: clienteId});
        if(!clienteVal){
            res.status(404).json({ message: 'atendimento não encontrado, o cliente existe mais não tem atendimento cadastrado', cpf })
            return;
        }
        else{    
            res.status(200).json({ atendimento: tutorId})
            return;
        }
  }
      
  }
  
  
  catch(err){
      res.status(500).json({message: err});
      } 
    });

//get Id atendimento

router.get('/atendimento/:id', (req, res) => {
  const { id } = req.params;
  atendimentoSchema
  .findById(id)
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'serviço', select:'nome valor'})
  .populate({path:'produto', select:'nome valor'})
  
  .then((data) =>{
        
    if(data == null){
        res.status(404).json({ message: 'id não encontrado, a id não existe', id})
        return;
    }
    else{
        res.status(200).json({atendimento: data})
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

//get pelo numero de ordem
router.get('/atendimento/nroOrdem/:nroOrdem', (req, res) => {
  const { nroOrdem }  = req.params;
  atendimentoSchema
  .findOne({ nroOrdem: nroOrdem})
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) =>{
        
    if(data == null){
        res.status(404).json({ message: 'numero de ordem não encontrado, numero de ordem não cadastrado', nroOrdem})
        return;
    }
    else{
        res.status(200).json({ atendimento: data })
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

//Update Atendimento pelo id

router.put('/atendimento/:id', async (req, res) => {
  const { id } = req.params;
  const atendimento = await atendimentoSchema.findOne({ _id: id });
  const { nroOrdem, cliente, produto, serviço } = req.body;
  const clienteId = { nroOrdem, cliente, produto, serviço }.cliente;
  const servicoId = { nroOrdem, cliente, produto, serviço }.serviço;
  const produtoId = { nroOrdem, cliente, produto, serviço }.produto;
  const clienteVal = await clienteSchema.findById(clienteId);
  const servicoVal = await servicoSchema.findById(servicoId);
  const produtoVal = await produtoSchema.findById(produtoId);

  try{

    if(!atendimento){
    res.status(404).json({ message: 'id não encontrado, id não existe', id })
    return;
    }

    if(!clienteVal){
      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteId})
      return;
    }

    if(!servicoVal){
      res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', servicoId})
      return;
    }

    if(!produtoVal){
      res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoId})
      return;
    }

    else{
    atendimento.set(req.body);
     await  atendimento.save();
    res.status(200).json({ message: 'os dados do atendimento foi atualizado com sucesso!', atendimento})
    }
    
}
catch(err){
  
    if(err.name == "ValidationError"){
        res.status(400).json({message: err})
        return;
    }
    if(err.code == 11000 ){
        res.status(400).send('Numero de ordem já existe')
        return;
    }

    else{
        res.status(500).json({message: err});
    }

}
 

});



//update pelo numero de ordem
router.put('/atendimento/nroOrdem/:nroOrdem', async (req, res) => {
  const { nroOrdem } = req.params;
  const { cliente, produto, serviço } = req.body;
  const atendimento = await atendimentoSchema.findOne({ nroOrdem: nroOrdem });
  const clienteId = { cliente, produto, serviço }.cliente;
  const servicoId = { cliente, produto, serviço }.serviço;
  const produtoId = { cliente, produto, serviço }.produto;
  const clienteVal = await clienteSchema.findById(clienteId);
  const servicoVal = await servicoSchema.findById(servicoId);
  const produtoVal = await produtoSchema.findById(produtoId);
  
  

  try{

    if(!atendimento){
    res.status(404).json({ message: 'numero de ordem não encontrado, numero de ordem não existe', nroOrdem })
    return;
    }

    if(!clienteVal){
      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteId})
      return;
    }

    if(!servicoVal){
      res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', servicoId})
      return;
    }

    if(!produtoVal){
      res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoId})
      return;
    }

    else{
    atendimento.set(req.body);
     await  atendimento.save();
    res.status(200).json({ message: 'os dados do atendimento foi atualizado com sucesso!', atendimento})
    }
    
}
catch(err){
  
    if(err.name == "ValidationError"){
        res.status(400).json({message: err})
        return;
    }
  

    else{
        res.status(500).json({message: err});
    }

}
});

//delete atendimento pelo id
router.delete('/atendimento/:id', (req, res) => {
  const { id } = req.params;
  atendimentoSchema
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



//delete atendimento pelo numero ordem
router.delete('/atendimento/nroOrdem/:nroOrdem', (req, res) => {
  const { nroOrdem } = req.params;
  atendimentoSchema
  .findOneAndDelete({ nroOrdem: nroOrdem })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'numero de ordem não encontrado, numero de ordem não existe', nroOrdem})
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