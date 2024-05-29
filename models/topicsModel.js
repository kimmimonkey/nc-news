const db = require("../db/connection");
const fs = require("fs/promises")

exports.fetchAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((topics) => topics.rows); 
}

exports.fetchAllEndpoints = async() => {
    const data = await fs.readFile("./endpoints.json");
    const endpoints = JSON.parse(data)
    return endpoints;
}

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => { 
        const article =  rows[0];
        if(!article) {
            return Promise.reject({
                status: 404,
                msg: "Not found"
            });
        }
        return article


    });
 }