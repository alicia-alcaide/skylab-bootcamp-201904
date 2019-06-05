const { model } = require('mongoose')
const { user, pmap, pin, Collection } = require('./schemas/index')

module.exports = {
    User: model('User', user),
    PMap: model('PMap', pmap),
    Pin: model('Pin', pin),
    Collection: model('Collection', Collection)
}

