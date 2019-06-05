const logic = require('../../logic')
const handleErrors = require('../../middlewares/handle-errors')

module.exports = (req, res) => {
    const { userId, body: { newPin }, params: { id: mapId, colId: collectionId } } = req

    handleErrors(async () => {
        await logic.createPin(userId, mapId, collectionId, newPin)

        return res.status(201).json({ message: 'Ok, pin created' })
    }, res)

}