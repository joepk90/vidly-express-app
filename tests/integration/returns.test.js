const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');

const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;


    beforeEach( async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken(); 
        payload = { customerId, movieId }

        movie = new Movie({
            _id: movieId,
            dailyRentalRate: 2,
            title: '12345',
            numberInStock: 1,
            genre: {
                name: '12345'
            }
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '123456',
            },
            movie: {
                _id: movieId,
                dailyRentalRate: 2,
                title: '12345',
            }
        });

        await rental.save();
    });

    afterEach( async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
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

    it('should calculate the rental fee (number of days x movie.dailyRentalRate)', async () => {
        
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        savedRental = await Rental.findById(rental._id);
    
        expect(savedRental.rentalFee).toBe(14);

    });

    it('should increase the movie stock', async () => {
        
        const res = await exec();

        savedMovie = await Movie.findById(movieId);
    
        expect(savedMovie.numberInStock).toBe(movie.numberInStock + 1);

    });

    it('should return the rental object if input is valid', async () => {
        
        const res = await exec();
    
        // const savedRental = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie' ]));

    });

});