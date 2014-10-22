var express = require('express');
var nodegrass = require('nodegrass');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/position/query', function (req, res) {

    var url = "http://api.map.baidu.com/place/v2/search?" +
        "ak=Wu85qkU4ZK6bH3fcNhp453dL&output=json" +
        "&page_size=10&page_num=0&scope=1&radius=" + req.query.radius +
        "&query=" + req.query.query + "&location=" + req.query.location;

    nodegrass.get(url, function (data, status, headers) {
        res.send(data);
    }, null, 'utf8').on('error', function (e) {
        console.log("Got error: " + e.message);
    });

});

module.exports = router;
