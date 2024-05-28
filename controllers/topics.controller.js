const { fetchAllTopics } = require ("../models/topics.model")

exports.getAllTopics = (req, res, next) => { 
    fetchAllTopics() 
    .then((body) => res.status(200).send({body}))
    .catch(next)
}