// // Description
// Should:

// be available on endpoint /api/topics.
// get all topics.
// Responds with:

// an array of topic objects, each of which should have the following properties:
// slug
// description
// As this is the first endpoint, you will need to set up your testing suite.

// Consider what errors could occur with this endpoint. As this is your first endpoint you may wish to also consider any general errors that could occur when making any type of request to your api. The errors that you identify should be fully tested for.

// Note: although you may consider handling a 500 error in your app, we would not expect you to explicitly test for this.

const request = require("supertest"); 
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed")


beforeEach(() => { 
    return seed(data)
})

afterAll(() => {
    return db.end();
})

describe.only(".all with any invalid endpoint", () => {
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
        .then(({ body: {body: rows} }) => {
            expect(Array.isArray(rows)).toBe(true); 
            rows.forEach((topic) => {
                expect(typeof topic).toBe("object");
            })
        })
    })
    test("responds with a topics array of objects with properties of slug and description", () => { 
        return request(app)
        .get("/api/topics")
        .then((({ body }) => {
            const topics = body.body; 
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String), 
                    slug: expect.any(String)
                })
            })
        }))
    })

})
