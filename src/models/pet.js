const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = mongoose.Schema({
    nome: {
        type: String,
        required  : [ true, 'Se precisa o nome' ]
    },

    tipo: {
        type: String,
        required  : [ true, 'Se precisa o tipo' ]
    },

    raça: {
        type: String,
        required  : [ true, 'Se precisa a raça' ]
    },

    idade: {
        type: Number,
        required  : [ true, 'Se precisa a idade' ]
    },
    peso: {
        type: Number,
        required  : [ true, 'Se precisa o peso' ]
    },
    
    
    tutor: {type: Schema.ObjectId, ref: 'cliente', required  : [ true, 'Se precisa o tutor' ] }
},
{
    timestamps: true,
    versionKey: false
}

);

module.exports = mongoose.model('pet', petSchema);