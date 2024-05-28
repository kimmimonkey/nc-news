const db = require("../db/connection");

exports.fetchAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((body) => body.rows); 
}

