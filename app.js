const express = require("express"); 
const app = express(); 
const { getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getArticleComments, getAllUsers, postComment, patchArticle, deleteComment } = require("./controllers/appController")

app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/users", getAllUsers)

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

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