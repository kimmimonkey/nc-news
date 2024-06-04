const { fetchAllTopics, fetchAllEndpoints, fetchArticleById, fetchAllArticles, fetchArticleComments, fetchAllUsers, addComment, updateArticleVotes, removeCommentById } = require("../models/appModel")


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
    const { sort_by, order } = req.query
    const topic = req.query.topic
    fetchAllArticles(topic, sort_by, order)
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

exports.getAllUsers = (req, res, next) => { 
    fetchAllUsers()
    .then((users) => {
        return res.status(200).send({ users })
    })
    .catch(next)
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    if (!username || !body) {
        return res.status(400).send({msg: "Invalid input"})
    }
    const date = new Date(Date.now());
    addComment(article_id, username, body, date)
        .then(({ rows }) => {
            res.status(201).send({ comment: rows[0] })
        })
        .catch(next);
}

exports.patchArticle = (req, res, next) => { 
    const { article_id } = req.params; 
    const { inc_votes } = req.body;
    if (!inc_votes) {
        return res.status(400).send({msg: "Invalid input"})
    } 
    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    if (!comment_id) {
        return res.status(400).send({msg: "Invalid input"})
    }
    removeCommentById(comment_id)
    .then(({ rows }) => {
        res.status(204).send(rows[0])
    })
    .catch(next)
}