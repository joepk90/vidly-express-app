const Joi = require('joi');  
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    {id: 1, name: 'genre1'},
    {id: 2, name: 'genre2'},
    {id: 3, name: 'genre3'}
];

app.get('/', (reg, res) => {
    res.send('hello world!');
});

// return all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

// return genre by id
app.get('/api/genres/:id', (req, res) => {

    // check if the genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // if genre id does not exist return 404
    if(!genre) {
        return res.status(404).send('The genre with the given ID was not found.')
    }

    // else return the genre data
    res.send(genre); 

});

// example date params
// app.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// example query
// app.get('/api/posts', (req, res) => {
//     res.send(req.query);
// });


// post request test. each post will return a response with the genre data inreasesd by.
// this can be tested in postman.
app.post('/api/genres', (req, res) => {

// basic validation example
// if (!req.body.name || req.body.name.length < 3) {
//     res.status(400 ).send('name is required and should be minimum 4 characters');
//     return;
// }

 // object destructoring
 const { error } = validategenre(req.body);
 if (error) {
    return res.status(400 ).send(error.details[0].message);
 }

    

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

// example PUT request
app.put('/api/genres/:id', (req, res) => {

    // check if the genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // if genre id does not exist return 404
    if(!genre) {
        return res.status(404).send('The genre with the given ID was not found.');
    }

    // object destructoring
    const { error } = validategenre(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    genre.name = req.body.name
    res.send(genre);

});

// delete genre
app.delete('/api/genres/:id', (req, res) => {

    // check if the genre exists
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // if genre id does not exist return 404
    if(!genre) {
        return res.status(404).send('The genre with the given ID was not found.')
    }

    // delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // return genre that has been deleted
    res.send(genre); 

    


});

function validategenre(genre) {

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);

}

// $ export PORT=5000
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`))
// app.post();
// app.put();
// app.delete();