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
    .then(() =>{
    return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])})
}