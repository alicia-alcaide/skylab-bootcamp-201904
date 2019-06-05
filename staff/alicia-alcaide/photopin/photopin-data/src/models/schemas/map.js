const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')
const Collection = require('./collection.js')


const pmap = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    collections: [Collection]
    // collections: [{
    //     title: String,
    //     pins: [{ type: ObjectId, ref: 'Pin' }]
    // }]
})

module.exports = pmap