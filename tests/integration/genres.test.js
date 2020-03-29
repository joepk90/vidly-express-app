// import { describe } from "joi";
const request = require('supertest');
const { Genre } = require('../../models/genre.js');
let server;

describe('/api/genres/', () => {

    beforeEach(() => {
        server = require('../../index');
    });

    afterEach( async () => {
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {

        it('should return all genres', async () => {

            // add genres to test database 
            await Genre.collection.insertMany([
                    {name: 'genre1'},
                    {name: 'genre2'},
                    ],
                );

            const res = await request(server).get('/api/genres/');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            
        });

    });
});