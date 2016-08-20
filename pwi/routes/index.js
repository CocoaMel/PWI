var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Perfect World Resource' });
});

router.get('/simulations', function (req, res, next) {
    res.render('simulations', { title: 'Simulations' });
});

router.get('/packs', function (req, res, next) {
    res.render('packs', {title: 'Pack Opening Simulator'})
});

router.get('/help', function (req, res, next) {
    res.render('help', {title: 'Helper Area'});
});

module.exports = router;