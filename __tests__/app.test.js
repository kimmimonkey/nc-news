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
        .then(({body}) => { 
            expect(body).toEqual({msg: "We don't have that here, sorry!"})
        })
    })
})

describe("GET /api/topics", () => { 
    test("responds with a topics array of objects with properties of slug and description", () => { 
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((({ body: { topics} }) => {
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
        .then(({body: {endpoints}}) => {
            expect(typeof endpoints).toBe("object")
        })
    })
    test("responds with an endpoints object, where each endpoint has a description property", () => {
        return request(app)
        .get("/api")
        .then( async ({body: {endpoints}}) => {
            const data = await fs.readFile("./endpoints.json")
            const parsedData = JSON.parse(data)
            expect(endpoints).toEqual(parsedData)
        })

    })
})

    describe("GET /api/articles/:article_id/", () => {
        test("status: 200, responds with the specified article object with the properties author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
            return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then(({body}) => { 
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