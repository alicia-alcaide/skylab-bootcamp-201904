const { models: { User, PMap, Pin, Collection } } = require('photopin-data')
const bcrypt = require('bcrypt')
const { LogicError } = require('photopin-errors')
const validate = require('photopin-validate')


const logic = {


    /**
     * Register an user into the database
     * 
     * @param {String} name The user name
     * @param {String} surname The user surname
     * @param {String} email The user email 
     * @param {String} password The user password 
     * 
     * @throws {TypeError, RequirementError, ValueError, FormatError} if a validation error happens
     * @throws {LogicError} if the use is already registered
     * 
     * @returns {String} id 
     */
    registerUser(name, surname, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'surname', value: surname, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {

            const user = await User.findOne({ email })

            if (user) throw new LogicError(`user with email ${email} already exists`)

            const hash = await bcrypt.hash(password, 10)

            const newUser = await User.create({ name, surname, email, password: hash })

            return newUser.id
        })()
    },

    /**
     * Authenticate an user to retrieve the id or throw an error if an email doesn't exists or the password not match.
     * 
     * @param {String} email The user email to authenticate
     * @param {String} password The user email to match
     * 
     * @returns {String} The user id
     */
    authenticateUser(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            const user = await User.findOne({ email })

            if (!user) throw new LogicError(`user with email ${email} doesn't exists`)

            if (await bcrypt.compare(password, user.password)) return user.id
            else throw new LogicError('wrong credentials')
        })()
    },


    /**
     * Retrieve the complete user data (name, surname, email, avatar, language and )
     * 
     * @param {String} userId The user id
     * 
     * @returns {Object} The user data
     */
    retrieveUser(userId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
        ])

        return (async () => {
            const user = await User.findById(userId).select('-_id name surname email avatar language favoritePublicMap').lean()

            if (!user) throw new LogicError(`user with id ${userId} doesn't exists`)

            delete user.password

            return user
        })()
    },

    /**
     * Update the user with new data
     * 
     * @param {string} userId 
     * @param {Object} data 
     * 
     * @throws {Error} if user not found
     * @return {Object} user data before update
     */
    updateUser(userId, data) {

        validate.arguments([
            { name: 'id', value: userId, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        return (async () => {

            try {
                let result = await User.findByIdAndUpdate(userId, { $set: data }).select('-__v  -password').lean()

                result.id = result._id.toString()
                delete result._id

                return result

            } catch (error) {
                throw new LogicError(`user with id ${userId} doesn't exists`)
            }

        })()
    },


    /**
     * Delete user, also delete all the pins and maps that the user is the author
     * 
     * @param {String} id The user id
     * @param {String} password The user password 
     * 
     * @return {Object} user deleted
     */
    removeUser(userId) {

        validate.arguments([
            { name: 'id', value: userId, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const user = await User.findById(userId)
            if (!user) throw new LogicError(`user with id ${userId} doesn't exists`)

            await Pin.deleteMany({ author: userId })

            await PMap.deleteMany({ author: userId })

            return await User.findByIdAndDelete(userId)

        })()
    },


    //-------------------------------------------------------------------------------------------


    /**
     * Retrieve the complete user data (name, surname, email, avatar, language and )
     * 
     * @param {String} userId The user id
     * 
     * @returns {Object} The user data
     */
    retrieveUserMaps(userId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
        ])

        return (async () => {
            const maps = await PMap.find({ author: userId }).lean()

            if (!maps) throw new LogicError(`no maps for user with id ${userId}`)

            return maps
        })()
    },


    /**
     * Retrieve the complete user data (name, surname, email, avatar, language and )
     * 
     * @param {String} userId The user id
     * 
     * @returns {Object} The user data
     */
    retrieveUserMap(userId, mapId) {
        validate.arguments([
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
        ])

        return (async () => {

            const map = await PMap.findById(mapId).populate('collections.pins').lean()

            if (!map) throw new LogicError(`no maps for user with id ${mapId}`)

            if (!map.isPublic && !map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            return map
        })()
    },


    createMap(userId, title, description, coverImage, tags) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true },
            { name: 'coverImage', value: coverImage, type: 'string', notEmpty: true },
            { name: 'tags', value: tags, type: 'object', notEmpty: true }
        ])

        return (async () => {
            const newMap = await PMap.create({ title, description, coverImage, tags, author: userId })
            return newMap.id
        })()
    },


    updateMap(userId, mapId, data) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        return (async () => {

            const map = await PMap.findById(mapId)

            if (!map) throw new LogicError(`no map with id ${mapId}`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            try {
                const mapUpdated = await PMap.findByIdAndUpdate(mapId, { $set: data }).select('-__v').lean()
                return mapUpdated
            } catch (error) {
                throw new LogicError(`map with id ${mapId} doesn't exists`)
            }

        })()
    },


    createCollection(userId, mapId, collectionTitle) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
            { name: 'collectionTitle', value: collectionTitle, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const map = await PMap.findById(mapId)

            if (!map) throw new LogicError(`no maps with id ${mapId}`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            try {
                const mapUpdated = map.collections.push(new Collection({ title: collectionTitle }))
                await map.save()
                return mapUpdated
            } catch (error) {
                throw new LogicError(`error creating new collection on map ${mapId}`)
            }
        })()
    },

    updateCollection(userId, mapId, collectionId, title) {

        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
            { name: 'collectionId', value: collectionId, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const map = await PMap.findById(mapId)

            if (!map) throw new LogicError(`no maps with id ${mapId}`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            try {
                const colIndex = map.collections.findIndex(col => col.id === collectionId)
                PMap.collections[colIndex].title = title
                await map.save()
            } catch (error) {
                throw new LogicError(`error updating collection ${collectionId} on map ${mapId}`)
            }
        })()
    },


    createPin(userId, mapId, collectionId, newPin) {

        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
            { name: 'collectionId', value: collectionId, type: 'string', notEmpty: true },
            { name: 'newPin', value: newPin, type: 'object', notEmpty: true }
        ])

        return (async () => {

            const map = await PMap.findById(mapId)

            if (!map) throw new LogicError(`no maps for user with id ${mapId}`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            try {
                const pinCreated = Pin.create({
                    mapId,
                    collectionId,
                    author: userId,
                    title: newPin.title,
                    description: newPin.description,
                    urlImage: newPin.urlImage,
                    bestTimeOfYear: newPin.bestTimeOfYear,
                    bestTimeOfDay: newPin.bestTimeOfDay,
                    photographyTips: newPin.photographyTips,
                    travelInformation: newPin.travelInformation,
                    coordinates: newPin.coordinates
                })

                const colIndex = map.collections.findIndex(col => col.id === collectionId)
                PMap.collections[colIndex].pins.push(pinCreated.id)
                await map.save()
                return pinCreated.id
            } catch (error) {
                throw new LogicError(`error creating new pin on map ${mapId}`)
            }
        })()
    },

    updatePin(userId, pinId, data) {

        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'pinId', value: pinId, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        return (async () => {

            const pin = await Pin.findById(pinId)

            if (!pin) throw new LogicError(`no pin with id ${pinId}`)

            if (!pin.author.equals(userId)) throw new LogicError(`pin ${pinId} is not from user ${userId}`)

            try {
                let result = await Pin.findByIdAndUpdate(pinId, { $set: data }).select('-__v').lean()
                return result
            } catch (error) {
                throw new LogicError(`error updating pin with id ${pinId}`)
            }

        })()
    },

    removeMap(userId, mapId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const map = await PMap.findById(mapId)
            if (!map) throw new LogicError(`map with id ${mapId} doesn't exists`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)

            await Pin.deleteMany({ mapId })

            return await PMap.findByIdAndDelete(mapId)
        })()
    },

    removeCollection(userId, mapId, collectionId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'mapId', value: mapId, type: 'string', notEmpty: true },
            { name: 'collectionId', value: collectionId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const map = await PMap.findById(mapId)
            if (!map) throw new LogicError(`map with id ${mapId} doesn't exists`)

            if (!map.author.equals(userId)) throw new LogicError(`map ${mapId} is not from user ${userId}`)


            const colIndex = map.collections.findIndex(col => col.id === collectionId)
            PMap.collections.splice(colIndex, 1)
            await map.save()

            await Pin.deleteMany({ mapId, collectionId })

            return map
        })()
    },

    removePin(userId, pinId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true },
            { name: 'pinId', value: pinId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const pin = await Pin.findById(pinId)
            if (!pin) throw new LogicError(`pin with id ${pinId} doesn't exists`)

            if (!pin.author.equals(userId)) throw new LogicError(`pin ${pinId} is not from user ${userId}`)

            return await User.findByIdAndDelete(pinId)
        })()
    },

}

module.exports = logic