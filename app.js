const express = require("express"); 
const app = express(); 
const { getAllTopics, getAllEndpoints, getArticleById, getAllArticles } = require("./controllers/appController")


app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById)

app.all("/*", (req, res) => { 
    res.status(404).send({msg: "We don't have that here, sorry!"})
})

app.use((err, req, res, next) => { 
    if(err.status) {
        res.status(err.status).send({msg: err.msg}); 
    } else next(err)
})

app.use((err, req, res, next) => { 
    if(err.code === "22P02") {
        res.status(400).send({msg: "Invalid input"})
    } else next(err); 
})

app.use((err, req, res, next) => { 
    console.log(err); 
    res.status(500).send({msg: "Internal Server Error"})
})


    module.exports = app