const request = require('supertest');
const mongoose = require('mongoose');

const { Rental } = require('../../models/rental');
// const { User } = require('../../models/user');

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let rental;


    beforeEach( async () => {
        server = require('../../index');

        // token = new User().generateAuthToken();

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '123456'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    afterEach( async () => {
        await server.close();
        await Rental.remove({});
    });

    let token;
    let name;

    // const exec = async () => {
    //     return await request(server)
    //     .post('/api/returns') 
    //     .set('x-auth-token', token)
    //     .send( { customerId, movieId });
    // } 


    it('should work!', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });


    it('return 401 if client is not logged in', async () => {
        
        // token = ''; // set token to empty string to disable authentication
        // const res = await exec(server);

        const res = await request(server)
        .post('/api/returns')
        .send({customerId, movieId});

        expect(res.status).toBe(401)

    });

});