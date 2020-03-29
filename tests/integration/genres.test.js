// import { describe } from "joi";
const request = require('supertest');
let server;

describe('/api/genres/', () => {

    beforeEach(() => {
        server = require('../../index');
    });

    afterEach(() => {
        server.close();
    });

    describe('GET /', () => {

        it('should retrun all genres', async () => {
            const res = await request(server).get('/api/genres/');
            expect(res.status).toBe(200);
        });

    });


});