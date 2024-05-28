const express = require("express"); 
const app = express(); 
const { getAllTopics, getAllEndpoints } = require("./controllers/topicsController")


app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.all("/*", (req, res) => { 
    res.status(404).send({msg: "We don't have that here, sorry!"})
})
app.use((err, req, res, next) => { 
    console.log(err); 
    res.status(500).send({msg: "Internal Server Error"})
})

app.use((err, req, res, next) => { 
    if(err.code === "22P02") {
        res.status(500).send({msg: "Bad request"})
    }
    else next(err)
})

module.exports = app