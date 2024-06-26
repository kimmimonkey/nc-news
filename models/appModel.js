const db = require("../db/connection");
const fs = require("fs/promises")

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

exports.fetchAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
     const validSortColumns = ["topic", "created_at", "article_id"]
    const validOrders = ["ASC", "DESC"]

    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" })
    }
    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" })
    }

    let queryStr = `
    SELECT articles.author,
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN
    comments
    ON articles.article_id = comments.article_id
    `

    const queryValues = [];

    if (topic) {
        queryStr += `WHERE articles.topic = $1 `;
        queryValues.push(topic);
    }

    queryStr += `
    GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order};`;

    return db
        .query(queryStr, queryValues)
        .then(({ rows: articles }) => articles)
}

exports.fetchArticleById = (article_id) => {
    return db
        .query(`SELECT articles.author,
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.body,
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN
        comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
                
        .then(({ rows }) => {
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
        .then(({ rows: comments }) => {
            if (comments.length === 0) {
                return exports.fetchArticleById(article_id)
                    .then(() => [])
            } else
                return comments
        })
}

exports.fetchAllUsers = () => {
    return db
        .query(`SELECT * FROM users;`)
        .then((users => users.rows));
}

exports.addComment = (article_id, username, comment, date) => {
    return db
        .query(`SELECT * from articles WHERE article_id = $1`, [article_id])
        .then(({ rows: articles }) => {
            if (articles.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Not found"
                })
            }
        })
        .then(() => {
            return db
                .query(`SELECT * from users WHERE username = $1;`, [username])
                .then(({ rows: users }) => {
                    if (users.length === 0) {
                        return Promise.reject({
                            status: 401,
                            msg: "Unauthorized"
                        })
                    }
                })
        })
        .then(() => {
            return db
                .query(`INSERT INTO comments (body, votes, author, article_id, created_at) 
                VALUES($1, 0, $2, $3, $4) RETURNING *;`, [comment, username, article_id, date])
        })
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db
        .query(`SELECT * from articles WHERE article_id = $1`, [article_id])
        .then(({ rows: articles }) => {
            if (articles.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Not found"
                })
            }
        })
        .then(() => {
            return db
                .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
        })
        .then(({ rows: articles }) => articles[0])
}

exports.removeCommentById = (comment_id) => {
    return db
        .query(`SELECT * from comments WHERE comment_id = $1`, [comment_id])
        .then(({ rows: comments }) => {
            if (comments.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Not found"
                })
            }
        })
        .then(() => {
            return db
                .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
        })
}