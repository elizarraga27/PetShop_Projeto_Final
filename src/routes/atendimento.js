const express = require("express");
const atendimento = require("../models/atendimento");
const atendimentoSchema = require("../models/atendimento");
const cliente = require("../models/cliente");
const clienteSchema = require("../models/cliente");
const produtoSchema = require("../models/produto");
const servicoSchema = require("../models/serviço");

const router = express.Router();


// create cliente
router.post('/atendimento', async (req, res) => {
  const { nroOrdem, clienteCpf, serviçoNome, produtoNome } = req.body;
  const cpfId = await clienteSchema.findOne({ cpf: clienteCpf });
  const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
  const produtoId = await produtoSchema.findOne({ nome: produtoNome });
  const validateCpf = (cpf) => {
    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
    return re.test(cpf);
  };

  try{

    if(!clienteCpf){
      res.status(400).json({ erro: 'precisa inserir cpf'})
      return;
    }

    if(!validateCpf(clienteCpf)){
      res.status(400).json({ message: 'cpf invalido', clienteCpf})
      return;
     } 

    if(!serviçoNome && !produtoNome){
      res.status(400).json({ erro: 'precisa inserir nome do serviço ou nome do produto'})
      return;
    }

    if(!cpfId){
      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf})
      return;
    }

    if(serviçoNome){
        if(!serviçoId){
        res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
        return;
       }
      }

    if(produtoNome){  
        if(!produtoId){
        res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
        return;
        }
      }    
    

      const cliente = cpfId._id;
      if(serviçoNome && produtoNome){
        const serviço = serviçoId._id;
        const produto = produtoId._id;
        const atendimento = atendimentoSchema({ nroOrdem, cliente, serviço, produto })
        const newAtendimento = await atendimento.save(atendimento)
        res.status(200).json(newAtendimento)
        return;
      }
      if(serviçoNome){
        const serviço = serviçoId._id;
        const atendimento = atendimentoSchema({ nroOrdem, cliente, serviço })
        const newAtendimento = await atendimento.save(atendimento)
        res.status(200).json(newAtendimento)
        return;
      }
      if(produtoNome){
        const produto = produtoId._id;
        const atendimento = atendimentoSchema({ nroOrdem, cliente, produto })
        const newAtendimento = await atendimento.save(atendimento)
        res.status(200).json(newAtendimento)
        return;
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
  const { nroOrdem, clienteCpf, serviçoNome, produtoNome } = req.body;

  
  try{

    if(!atendimento){
    res.status(404).json({ message: 'numero de ordem não encontrado, numero de ordem não existe', nroOrdem })
    return;
    }

    if(!clienteCpf && !serviçoNome && !produtoNome){
          atendimento.set( req.body );
          await atendimento.save();
          res.status(200).json({ message: 'numero de atendimento atualizado', atendimento })
      }
    
    if(!clienteCpf && !serviçoNome){
      const produtoId = await produtoSchema.findOne({ nome: produtoNome });
              
              if(!produtoId){
                  res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                  return;
              }

              else{
                  const produto = produtoId._id;
                  atendimento.set({ nroOrdem, produto });
                  await  atendimento.save();
                  res.status(200).json({ message: 'Dado de produto foi atualizado', atendimento })
                  return;
              }
      }

      if(!clienteCpf && !produtoNome){
        const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
                
                if(!serviçoId){
                    res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
                    return;
                }
  
                else{
                    const serviço = serviçoId._id;
                    atendimento.set({ nroOrdem, serviço });
                    await  atendimento.save();
                    res.status(200).json({ message: 'Dado de serviço foi atualizado', atendimento })
                    return;
                }
        }

        if(!produtoNome && !serviçoNome){
          const clienteId = await cliente.findOne({ cpf: clienteCpf });
          const validateCpf = (cpf) => {
            const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
            return re.test(cpf);
          };        
                  if(!validateCpf(clienteCpf)){
                    res.status(400).json({ message: 'cpf invalido', clienteCpf})
                    return;
                  }
          
                  if(!clienteId){
                      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf})
                      return;
                  }
    
                  else{
                      const cliente = clienteId._id;
                      atendimento.set({ nroOrdem, cliente });
                      await  atendimento.save();
                      res.status(200).json({ message: 'Dado de cliente foi atualizado', atendimento })
                      return;
                  }
          }

          if(!clienteCpf){
            const produtoId = await produtoSchema.findOne({ nome: produtoNome });
            const serviçoId = await servicoSchema.findOne({ nome: serviçoNome});      
                    if(!produtoId){
                        res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                        return;
                    }

                    if(!serviçoId){
                      res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome});
                      return;
                    }

      
                    else{
                        const serviço = serviçoId._id;
                        const produto = produtoId._id;
                        atendimento.set({ nroOrdem, serviço, produto });
                        await  atendimento.save();
                        res.status(200).json({ message: 'Dado de produto e serviço foi atualizado', atendimento })
                        return;
                    }
            }

            if(!serviçoNome){
              const produtoId = await produtoSchema.findOne({ nome: produtoNome });
              const clienteId = await clienteSchema.findOne({ cpf: clienteCpf});
              const validateCpf = (cpf) => {
                const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                return re.test(cpf);
            };
                      if(!validateCpf(clienteCpf)){
                          res.status(400).json({ message: 'cpf invalido', tutorCpf})
                          return;
                      }

                      if(!produtoId){
                          res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                          return;
                      }
  
                      if(!clienteId){
                        res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf});
                        return;
                      }
  
        
                      else{
                          const cliente = clienteId._id;
                          const produto = produtoId._id;
                          atendimento.set({ nroOrdem, cliente, produto });
                          await  atendimento.save();
                          res.status(200).json({ message: 'Dado de produto e cliente foi atualizado', atendimento })
                          return;
                      }
              }

              if(!produtoNome){
                const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
                const clienteId = await clienteSchema.findOne({ cpf: clienteCpf});
                const validateCpf = (cpf) => {
                  const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                  return re.test(cpf);
              };
                        if(!validateCpf(clienteCpf)){
                            res.status(400).json({ message: 'cpf invalido', tutorCpf})
                            return;
                        }
  
                        if(!serviçoId){
                            res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
                            return;
                        }
    
                        if(!clienteId){
                          res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf});
                          return;
                        }
    
          
                        else{
                            const cliente = clienteId._id;
                            const serviço = serviçoId._id;
                            atendimento.set({ nroOrdem, cliente, serviço });
                            await  atendimento.save();
                            res.status(200).json({ message: 'Dado de serviço e cliente foi atualizado', atendimento })
                            return;
                        }
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



//update pelo numero de ordem
router.put('/atendimento/nroOrdem/:nroOrdem', async (req, res) => {
  const { nroOrdem } = req.params;
  const atendimento = await atendimentoSchema.findOne({ nroOrdem: nroOrdem });
  const { clienteCpf, serviçoNome, produtoNome } = req.body;

  
  try{

    if(!atendimento){
    res.status(404).json({ message: 'numero de ordem não encontrado, numero de ordem não existe', nroOrdem })
    return;
    }


    
    if(!clienteCpf && !serviçoNome){
      const produtoId = await produtoSchema.findOne({ nome: produtoNome });
              
              if(!produtoId){
                  res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                  return;
              }

              else{
                  const produto = produtoId._id;
                  atendimento.set({ produto });
                  await  atendimento.save();
                  res.status(200).json({ message: 'Dado de produto foi atualizado', atendimento })
                  return;
              }
      }

      if(!clienteCpf && !produtoNome){
        const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
                
                if(!serviçoId){
                    res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
                    return;
                }
  
                else{
                    const serviço = serviçoId._id;
                    atendimento.set({ serviço });
                    await  atendimento.save();
                    res.status(200).json({ message: 'Dado de serviço foi atualizado', atendimento })
                    return;
                }
        }

        if(!produtoNome && !serviçoNome){
          const clienteId = await cliente.findOne({ cpf: clienteCpf });
          const validateCpf = (cpf) => {
            const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
            return re.test(cpf);
          };        
                  if(!validateCpf(clienteCpf)){
                    res.status(400).json({ message: 'cpf invalido', clienteCpf})
                    return;
                  }
          
                  if(!clienteId){
                      res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf})
                      return;
                  }
    
                  else{
                      const cliente = clienteId._id;
                      atendimento.set({ cliente });
                      await  atendimento.save();
                      res.status(200).json({ message: 'Dado de cliente foi atualizado', atendimento })
                      return;
                  }
          }

          if(!clienteCpf){
            const produtoId = await produtoSchema.findOne({ nome: produtoNome });
            const serviçoId = await servicoSchema.findOne({ nome: serviçoNome});      
                    if(!produtoId){
                        res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                        return;
                    }

                    if(!serviçoId){
                      res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome});
                      return;
                    }

      
                    else{
                        const serviço = serviçoId._id;
                        const produto = produtoId._id;
                        atendimento.set({ serviço, produto });
                        await  atendimento.save();
                        res.status(200).json({ message: 'Dado de produto e serviço foi atualizado', atendimento })
                        return;
                    }
            }

            if(!serviçoNome){
              const produtoId = await produtoSchema.findOne({ nome: produtoNome });
              const clienteId = await clienteSchema.findOne({ cpf: clienteCpf});
              const validateCpf = (cpf) => {
                const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                return re.test(cpf);
            };
                      if(!validateCpf(clienteCpf)){
                          res.status(400).json({ message: 'cpf invalido', tutorCpf})
                          return;
                      }

                      if(!produtoId){
                          res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                          return;
                      }
  
                      if(!clienteId){
                        res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf});
                        return;
                      }
  
        
                      else{
                          const cliente = clienteId._id;
                          const produto = produtoId._id;
                          atendimento.set({ cliente, produto });
                          await  atendimento.save();
                          res.status(200).json({ message: 'Dado de produto e cliente foi atualizado', atendimento })
                          return;
                      }
              }

              if(!produtoNome){
                const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
                const clienteId = await clienteSchema.findOne({ cpf: clienteCpf});
                const validateCpf = (cpf) => {
                  const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                  return re.test(cpf);
              };
                        if(!validateCpf(clienteCpf)){
                            res.status(400).json({ message: 'cpf invalido', tutorCpf})
                            return;
                        }
  
                        if(!serviçoId){
                            res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
                            return;
                        }
    
                        if(!clienteId){
                          res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf});
                          return;
                        }
    
          
                        else{
                            const cliente = clienteId._id;
                            const serviço = serviçoId._id;
                            atendimento.set({ cliente, serviço });
                            await  atendimento.save();
                            res.status(200).json({ message: 'Dado de serviço e cliente foi atualizado', atendimento })
                            return;
                        }
                }

                if(clienteCpf && serviçoNome && produtoNome){
                  const serviçoId = await servicoSchema.findOne({ nome: serviçoNome });
                  const clienteId = await clienteSchema.findOne({ cpf: clienteCpf});
                  const produtoId = await produtoSchema.findOne({ nome: produtoNome });
                  const validateCpf = (cpf) => {
                    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                    return re.test(cpf);
                  };
    
                  if(!validateCpf(clienteCpf)){
                    res.status(400).json({ message: 'cpf invalido', tutorCpf})
                    return;
                }
    
                if(!serviçoId){
                    res.status(404).json({ message: 'serviço não encontrado, serviço não cadastrado', serviçoNome})
                    return;
                }
    
                if(!clienteId){
                  res.status(404).json({ message: 'cliente não encontrado, cliente não cadastrado', clienteCpf});
                  return;
                }
    
                if(!produtoId){
                  res.status(404).json({ message: 'produto não encontrado, produto não cadastrado', produtoNome})
                  return;
                }
    
    
                else{
    
                    const produto = produtoId._id;
                    const cliente = clienteId._id;
                    const serviço = serviçoId._id;
                    atendimento.set({ nroOrdem, cliente, serviço, produto });
                    await  atendimento.save();
                    res.status(200).json({ message: 'Dados de atendimento foi atualizado', atendimento })
                    return;
                }
    
    
    
    
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

