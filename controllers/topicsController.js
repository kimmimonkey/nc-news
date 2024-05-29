const { fetchAllTopics, fetchAllEndpoints, fetchArticleById } = require("../models/topicsModel")


exports.getAllTopics = (req, res, next) => {
    fetchAllTopics()
        .then((topics) => {
            return res.status(200).send({ topics })
        })
        .catch(next)
};

exports.getAllEndpoints = (req, res, next) => {
    fetchAllEndpoints()
        .then((endpoints) => {
            return res.status(200).send({ endpoints });
        });
        
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => res.status(200).send({ article }))
    .catch(next);
    };