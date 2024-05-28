const express = require("express"); 
const app = express(); 
const { getAllTopics } = require("./controllers/topics.controller")

app.get("/api/topics", getAllTopics);



app.all("/*", (req, res) => { 
    res.status(404).send({msg: "We don't have that here, sorry!"})
})
app.use((err, req, res, next) => { 
    console.log(err); 
    res.status(500).send({msg: "Internal Server Error"})
})

app.use((err, req, res, next) => { 
    console.log('hello from errors', err)
    if(err.code === "22P02") {
        res.status(500).send({msg: "Bad request"})
    }
    else next(err, req, res, next)
})


app.listen(3030, () => {
    console.log("server is listening on port 3030")
})
module.exports = app