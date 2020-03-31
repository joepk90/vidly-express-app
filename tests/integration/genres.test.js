const request = require('supertest');
const { Genre } = require('../../models/genre.js');
const { User } = require('../../models/user.js');

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
            expect(res.body.some(g => g.name === "genre1")).toBeTruthy();
            expect(res.body.some(g => g.name === "genre2")).toBeTruthy();            
        });
    });


    describe('GET /:id', () => {

        it('should return genre if valid ID is passed', async () => {

            const genre = new Genre({ name: 'genre1' });
            
            // add genres to test database 
            await genre.save();
       
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);

        });

        it('should return 404 if invalid ID is passed', async () => {

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);

        });

    });

    describe('POST /', () => {

        it('should return a 401 if client is not logged in', async () => {

            const res = await request(server)
            .post('/api/genres')
            .send( { name: 'genre1' } );

            expect(res.status).toBe(401)

        });

        it('should return a 400 if genre less than 5 characters', async () => {

            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/genres') 
            .set('x-auth-token', token)
            .send( { name: '1234' } );

            expect(res.status).toBe(400);

        });

        it('should return a 400 if genre more than 50 characters', async () => {

            const token = new User().generateAuthToken();

            const name = new Array(52).join('a'); // will equeal 51 characters

            const res = await request(server)
            .post('/api/genres') 
            .set('x-auth-token', token)
            .send( { name: name } );

            expect(res.status).toBe(400);

        });

    });
});