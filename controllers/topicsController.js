const { fetchAllTopics, fetchAllEndpoints } = require ("../models/topicsModel")


exports.getAllTopics = (req, res, next) => { 
    fetchAllTopics() 
    .then((topics) => {
        return res.status(200).send({topics})
    }) 
    .catch(next)
}

exports.getAllEndpoints = (req, res, next) => {
    fetchAllEndpoints()
    .then((endpoints) => {
        return res.status(200).send({endpoints});
    })
    }