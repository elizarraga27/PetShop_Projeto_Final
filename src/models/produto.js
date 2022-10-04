const mongoose = require("mongoose");

const produtoSchema = mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required  : [ true, 'Se precisa o nome do produto' ]
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