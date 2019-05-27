const { Schema } = require ('mongoose')


const issues= new Schema({
    key: {type: String, required: true},
    issueType: {type: String, required: true},
    country: {type: String, required: true},
    createdDate :{type: Date, required: true},
    dueDate : {type: Date, required: true},
    status: {type: String, required: true},
    resolutionType : {type: String, required: true},
    resolutionDate : {type: Date, required: true},
    overdue : {type: String}

})

issues.statics.findIssuesByCountryAndDate = function (issueType, country, startDate, endDate) {
    let query= {$and:[{issueType: issueType},{country: country}, { createdDate: { $gte: startDate} }, { createdDate: { $lte: endDate} }]}
    return this.find(query)
}

module.exports = {issues}