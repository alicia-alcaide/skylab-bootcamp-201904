const { Schema } = require('mongoose')

const gameDeck = new Schema({
    "A": { type: String, trim: true, required: true },
    "B": { type: String, trim: true, required: true }
})

module.exports = gameDeck