const express = require('express');
const router = express('router');


const genres = [
    {id: 1, name: 'horror'},
    {id: 2, name: 'action'},
    {id: 3, name: 'comedy'}
];

// return all genres
router.get('/', (req, res) => {
    res.send(genres);
});

// return genre by id
router.get('/:id', (req, res) => {

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
// router.get('/api/posts/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// example query
// router.get('/api/posts', (req, res) => {
//     res.send(req.query);
// });


// post request test. each post will return a response with the genre data inreasesd by.
// this can be tested in postman.
router.post('/', (req, res) => {

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
router.put('/:id', (req, res) => {

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
router.delete('/:id', (req, res) => {

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

module.exports = router;