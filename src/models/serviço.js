const mongoose = require("mongoose");

const servicoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
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