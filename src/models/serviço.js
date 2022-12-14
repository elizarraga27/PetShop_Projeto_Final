const mongoose = require("mongoose");

const servicoSchema = mongoose.Schema({
    
    nroServiço: {
        type: Number,
        unique: true,
        required  : [ true, 'Se precisa o Numero de serviço' ]
    },
    
    nome: {
        type: String,
        unique: true,
        required  : [ true, 'Se precisa o nome do serviço' ]
    },
    valor: {
        type: Number,
        required  : [ true, 'Se precisa o valor do serviço' ]
    },
    descrição: {
        type: String,
        required: false
    }
},
{
    timestamps: true,
    versionKey: false
}

);

module.exports = mongoose.model('servico', servicoSchema);