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
    test("responds with status: 404 and an error message", () => {
        return request(app)
        .get("/api/animals")
        .expect(404)
        .then(({body}) => { 
            expect(body).toEqual({msg: "We don't have that here, sorry!"})
        })
    })
})

describe("GET /api/topics", () => { 
    test("status: 200", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
    })
    test("responds with a topics array of objects from database", () => {
        return request(app)
        .get("/api/topics")
        .then(({ body: { topics }}) => {
            expect(Array.isArray(topics)).toBe(true); 
            topics.forEach((topic) => {
                expect(typeof topic).toBe("object");
            })
        })
    })
    test("responds with a topics array of objects with properties of slug and description", () => { 
        return request(app)
        .get("/api/topics")
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
    test("status: 200", () => { 
        return request(app)
        .get("/api")
        .expect(200)

    })
    test("responds with an object describing all other endpoints available", () => { 
        return request(app)
        .get("/api")
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