const db = require("../db/connection");
const fs = require("fs/promises")

exports.fetchAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((body) => body.rows); 
}

exports.fetchAllEndpoints = async() => {
    const data = await fs.readFile("./endpoints.json");
    const endpoints = JSON.parse(data)
    return endpoints;
}