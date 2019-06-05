const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')


const Collection = new Schema({
    title: { type: String, required: true },
    pins: [{ type: ObjectId, ref: 'Pin' }]
})

module.exports = Collection