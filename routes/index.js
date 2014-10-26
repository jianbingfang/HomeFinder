var express = require('express');
var mapService = require('../src/service/mapService')

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/**
 * 服务器代为查询某个地点的相关待考察信息
 */
router.get('/nearby/query', function (req, res) {

    var radius = req.query.radius || 1000;  // default: 1km
    var keyword = req.query.query;
    var location = req.query.location;

    var type = req.query.type;

    mapService.nearbySearch({
        type: type,
        location: location,
        keyword: keyword,
        radius: radius
    }, function (data) {
        /* 查询成功 */
//        console.log(data);
        res.send(data);
        return;
    }, function (e) {
        /* 查询失败 */
        console.log('error: ' + e.message);
        res.send('error: ' + e.message);
    });

});         
router.get('/distance/query',function (req,res) {
    console.log("2");
    var origin = req.query.origin;
    var destination = req.query.destination;
    var type = req.query.type;
    mapService.getDistance({
        type: type,
        origin: origin,
        destination: destination
    },function (data){
        res.send(data);
        return;
    },function (e){
        console.log('error: '+ e.message);
        res.send('error:'+ e.message);
    });

});

module.exports = router;
