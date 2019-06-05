const logic = require('../../logic')
const handleErrors = require('../../middlewares/handle-errors')

module.exports = (req, res) => {
    handleErrors(async () => {
        const { userId, params: { id: mapId, colId: collectionId }, body: { title } } = req

        const user = await logic.updateCollection(userId, mapId, collectionId, title)

        return res.json(user)

    }, res)
}