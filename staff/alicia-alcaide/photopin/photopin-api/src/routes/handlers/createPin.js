const logic = require('../../logic')
const handleErrors = require('../../middlewares/handle-errors')

module.exports = (req, res) => {
    const { userId, body: { newPin }, params: { id: mapId } } = req

    handleErrors(async () => {
        await logic.createPin(userId, mapId, newPin)

        return res.status(201).json({ message: 'Ok, pin created' })
    }, res)

}