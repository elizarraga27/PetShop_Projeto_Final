const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    Peso: {
        type: Number,
        required: true
    },
    raça: {
        type: String,
        required: true
    },
    
    tipo: {
        type: String,
        required: true
    },
    tutor: {type: Schema.ObjectId, ref: 'cliente', required: true }
},
{
    timestamps: true,
    versionKey: false
}

);

module.exports = mongoose.model('pet', petSchema);