const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed")
const fs = require("fs/promises");


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end();
})

describe(".all with any invalid endpoint", () => {
    test("status: 404, responds with an error message", () => {
        return request(app)
            .get("/api/animals")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "We don't have that here, sorry!" })
            })
    })
})

describe("GET /api/topics", () => {
    test("responds with a topics array of objects with properties of slug and description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((({ body: { topics } }) => {
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
            }))
    })
})

describe("GET /api", () => {
    test("status: 200 responds with an object describing all other endpoints available", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(typeof endpoints).toBe("object")
            })
    })
    test("responds with an endpoints object, where each endpoint has a description property", () => {
        return request(app)
            .get("/api")
            .then(async ({ body: { endpoints } }) => {
                const data = await fs.readFile("./endpoints.json")
                const parsedData = JSON.parse(data)
                expect(endpoints).toEqual(parsedData)
            })

    })
})

describe("GET /api/articles/:article_id", () => {
    test("status: 200, responds with the specified article object with the properties author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
        return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
            })
    })
    test("status: 400, responds with an error message when passed a bad article_id", () => {
        return request(app)
            .get("/api/articles/notAnId")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 404, responds with an error message when passed a valid article_id that doesn't exist in the database", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })
})

describe("/api/articles", () => {
    test("status: 200, responds with an array of article objects with the properties author, title, article_id, topic, created_at, votes, article_img_url and comment_count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((({ body: { articles } }) => {
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            }))
    })
    test("responds with articles sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .then((({ body: { articles } }) => {
                expect(articles).toBeSortedBy("created_at", { descending: true })
            }))
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test("status: 200, responds with an array of comment objects on specified article, with the properties comment_id, votes, created_at, author, body and article_id", () => {
        return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments.length).toBe(2)
                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                })
            })
    })
    test("status: 400, responds with an error message when passed a bad article_id", () => {
        return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 404, responds with an error message when passed a valid article_id that doesn't exist in the database", () => {
        return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201, responds with a comment object with the properties body,votes, author, article_id and created_at", () => {
        return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "butter_bridge", body: "Focus, Hiccup!" })
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: expect.any(Number),
                    body: "Focus, Hiccup!",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 5,
                    created_at: expect.any(String)
                })
            })
    })
    test("status: 400, responds with an error message when passed a bad article_id", () => {
        return request(app)
            .post("/api/articles/notAnId/comments")
            .send({ username: "butter_bridge", body: "Focus, Hiccup!" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 400, responds with an error message when passed an empty comment body", () => {
        return request(app)
            .post("/api/articles/5/comments")
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })

    })
    test("status: 404, responds with an error message when passed a valid article_id that doesn't exist yet", () => {
        return request(app)
            .post("/api/articles/9999/comments")
            .send(({ username: "butter_bridge", body: "Focus, Hiccup!" }))
            .expect((404))
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })
    test("status: 401, responds with an error message when passed a username that doesn't exist", () => {
        return request(app)
            .post("/api/articles/5/comments")
            .send(({ username: "notAUsername", body: "Focus, Hiccup!" }))
            .expect((401))
            .then(({ body }) => {
                expect(body.msg).toBe("Unauthorized")
            })
    })

})

describe("PATCH /api/articles/:article_id", () => {
    test("status: 200, responds with the specified article object with the properties author, title, article_id, body, topic, created_at, votes and article_img_url where votes has been updated", () => {
        return request(app)
            .patch("/api/articles/5")
            .expect(200)
            .send({ inc_votes: 5 })
            .then(({ body: { article } }) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
                expect(article.votes).toBe(5)
            })
    })
    test("status: 400, responds with an error message when passed a bad article_id", () => {
        return request(app)
            .patch("/api/articles/notAnId")
            .expect(400)
            .send({ inc_votes: 5 })
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 400, responds with an error message when passed an empty inc_votes body", () => {
        return request(app)
            .patch("/api/articles/5")
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 400 responds with an error message when passed an invalid inc_votes value", () => { 
        return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: "notANumber" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input")
            })
    })
    test("status: 404, responds with an error message when passed an article that doesn't exist", () => {
        return request(app)
            .patch("/api/articles/9999")
            .expect(404)
            .send({ inc_votes: 5 })
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })

})

describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204, no response body", () => {
        return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(({body}) => {
            expect(body).toEqual({})
        })
    })

//     test.only("status: 400, responds with an error when passed a bad comment_id", () => {
//         return request(app)
//         .delete("/api/comments/notAnId")
//         .expect(400)
//         .then(({ body }) => {
//             expect(body.msg).toBe("Invalid input")
//         })
//     })

})

// // finish 400 
// // 404 : comment doesn't exist 