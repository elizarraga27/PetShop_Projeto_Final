const mongoose = require("mongoose");

const produtoSchema = mongoose.Schema({
    nroProduto: {
        type: Number,
        required  : [ true, 'Se precisa o numero de produto' ],
        unique: true
    },

    nome: {
        type: String,
        required  : [ true, 'Se precisa o nome do produto' ],
        unique: true
    },
    valor: {
        type: Number,
        required  : [ true, 'Se precisa o valor do produto' ]
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

module.exports = mongoose.model('produto', produtoSchema);