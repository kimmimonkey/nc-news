const { fetchAllTopics, fetchAllEndpoints, fetchArticleById, fetchAllArticles, fetchArticleComments } = require("../models/appModel")


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


exports.getAllArticles = (req, res, next) => {
    const { sort_by } = req.query;
    fetchAllArticles(sort_by)
        .then((articles) => {
            return res.status(200).send({ articles });
        });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id).then((article) => res.status(200).send({ article }))
        .catch(next);
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id).then((comments) => res.status(200).send({ comments }))
        .catch(next);
};