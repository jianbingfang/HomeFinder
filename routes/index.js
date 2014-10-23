var express = require('express');
var nodegrass = require('nodegrass');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/**
 * 服务器代为查询某个地点的相关待考察信息
 */
router.get('/nearby/query', function (req, res) {

    var radius = req.query.radius | 1000;
    var keyword = req.query.query;
    var location = req.query.location;

    /** 百度地图web服务查询url */
    var url = "http://api.map.baidu.com/place/v2/search?" +
        "ak=Wu85qkU4ZK6bH3fcNhp453dL&output=json" +
        "&page_size=10&page_num=0&scope=1&radius=" + radius +
        "&query=" + keyword + "&location=" + location;

    nodegrass.get(url, function (data, status, headers) {
        console.log(">>>>>>>>>>>>>");
        console.log("Service query: " + status);
        console.log(url);
        console.log("<<<<<<<<<<<<<");
        if (status == 200) {
            res.send(data);
        }else{
            res.send({});
        }
    }, null, 'utf8').on('error', function (e) {
        console.log("Got error: " + e.message);
    });

});

module.exports = router;
