const request = require('supertest');
const mongoose = require('mongoose');

const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let rental;


    beforeEach( async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        payload = { customerId, movieId }

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
    let payload;
    

    const exec = async () => {
        return await request(server)
        .post('/api/returns') 
        .set('x-auth-token', token)
        .send( payload );
    } 


    it('should work!', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });


    it('should return 401 if client is not logged in', async () => {
        
        token = ''; // set token to empty string to disable authentication
        const res = await exec();

        expect(res.status).toBe(401)

    });

    it('should return 400 if customerId is not provided', async () => {
        
        delete payload.customerId;
        const res = await exec();

        expect(res.status).toBe(400)

    });

    it('return 400 if movieId is not provided', async () => {
        
        delete payload.movieId;
        const res = await exec( );

        expect(res.status).toBe(400)

    });

    it('should return 404 if no rental found for customer/movie combination', async () => {
        
        // remove rentals so no rental will be found 
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404)

    });

    it('should return 400 if rental is already processed - return date is already set', async () => {

        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400)

    });

    it('should return 200 if request is valid', async () => {

        const res = await exec();

        expect(res.status).toBe(200)

    });

    it('should set the returnDate if input is valid', async () => {
        
        const res = await exec();

        savedRental = await Rental.findById(rental._id);

        // find difference between when dateReturned value was added and the now
        const diff = new Date() - savedRental.dateReturned;

        expect(diff).toBeLessThan(10 * 1000); // check if time difference is less than 10 seconds 

    });

});