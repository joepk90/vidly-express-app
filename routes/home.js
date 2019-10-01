const express = require('express');
const router = express('router');

router.get('/', (reg, res) => {
    res.send('hello world!');
});

module.exports = router;