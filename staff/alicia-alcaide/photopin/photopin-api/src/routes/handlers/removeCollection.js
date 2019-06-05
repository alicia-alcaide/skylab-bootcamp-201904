const logic = require('../../logic')
const handleErrors = require('../../middlewares/handle-errors')

module.exports = (req, res) => {
    handleErrors(async () => {

        const { userId, params: { id: mapId, colId: collectionId } } = req

        const user = await logic.removeCollection(userId, mapId, collectionId)

        return res.json(user)

    }, res)
}