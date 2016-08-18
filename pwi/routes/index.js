var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Perfect World Resource' });
});

router.get('/simulations', function (req, res, next) {
    res.render('index', { title: 'Simulations' });
})

module.exports = router;