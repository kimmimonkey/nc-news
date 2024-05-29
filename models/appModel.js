const db = require("../db/connection");
const fs = require("fs/promises")
const format = require("pg-format")

exports.fetchAllTopics = () => {
    return db
        .query(`SELECT * FROM topics;`)
        .then((topics) => topics.rows);
}

exports.fetchAllEndpoints = async () => {
    const data = await fs.readFile("./endpoints.json");
    const endpoints = JSON.parse(data)
    return endpoints;
}

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC") => {
    return db
        .query(`
    SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM 
        articles 
    LEFT JOIN 
        comments
    ON 
        articles.article_id = comments.article_id
    GROUP BY 
        articles.article_id
    ORDER BY ${sort_by} ${order};`)
        .then((articles) => articles.rows)

}

exports.fetchArticleById = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then (({ rows }) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: "Not found"
                });
            }
            return article


        });
}

exports.fetchArticleComments = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then(({ rows: comments  }) => {
        if (comments.length === 0) {
            return exports.fetchArticleById(article_id) 
            .then(() => [])
        } else 
        return comments 
    })
}