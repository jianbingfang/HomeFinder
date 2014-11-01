'use strict';

var express = require('express');
var core = require('../src/service/core');
var mapService = require('../src/service/mapService');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

/**
 * 服务器代为查询某个地点的相关待考察信息
 */
router.get('/search/nearby', function (req, res) {

    var radius = req.query.radius || 1000;  // default: 1km
    //var keyword = req.query.keyword;
    var keyword = '中学';
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
        var result = {
            status: data.status,
            message: data.message
        };
        if (result.status === 0) {
            /* 若nearby数据获取成功 */
            result.score = core.evaluate();
        }
        res.send(result);
    }, function (message) {
        /* 查询失败 */
        console.log('error: ' + message);
        res.send('error: ' + message);
    });

});


router.get('/distance/query', function (req, res) {
    console.log("2");
    var origin = req.query.origin;
    var destination = req.query.destination;
    var type = req.query.type;
    mapService.getDistance({
        type: type,
        origin: origin,
        destination: destination
    }, function (data) {
        res.send(data);
        return;
    }, function (e) {
        console.log('error: ' + e.message);
        res.send('error:' + e.message);
    });

});

router.get('/evaluate', function (req, res) {

    //var mQueryInfo = req.query;

//    console.log('mQueryInfo:');
//    console.log(mQueryInfo);

//    mapService.getPreferInfo(mQueryInfo, function (data) {
//        console.log(data);
//    });

    var testData = {
        location: '39.999277,116.348646',
        keywords: ['高中', '篮球场', '公园', '地铁']
    };

    var data = {
        status: 0,
        message: 'ok',
        results: {}
    };

    mapService.hasKeySchool({
        location: testData.location
    }, function (doesItHas) {
        /* 查询成功 */
        console.log('hasKeySchool query result: ' + doesItHas);
        data.results.hasKeySchool = doesItHas;

        mapService.getDistanceOfNearest({
            location: testData.location,
            keywords: testData.keywords,
            filter: 'life',
            sort_name: 'distance',
            sort_rule: 0
        }, function (distance) {
            /* 查询成功 */
            console.log('distance query result: ' + distance.toString());
            data.results.distance = distance;
            var arg = [doesItHas, 0].concat(distance);
            var score = core.evaluate(arg);
            console.log('>> SCORE: ' + score);
            data.results.score = score;
            res.send(data);
        });

    }, function (message) {
        /* 查询失败 */
        console.log('hasKeySchool: ' + message);
        data.status = 1;
        data.message = message;
        res.send(data);
    });

});

router.get('/duration/evaluate', function (req, res) {
    console.log("/duration/evaluate");
    var type = req.query.type;
    var mapInfo = req.query.mapInfo;
    var mQueryInfo = req.query.mQueryInfo;
    console.log(mQueryInfo);
    mapService.evaluateDuration({
        type: type,
        location: mapInfo.UpperleftLocation,
        mQueryInfo: mQueryInfo
    }, function (data) {
        res.send(data);
        return;
    }, function (e) {
        console.log('error: ' + e.message);
        res.send('error: ' + e.message);
    });

});

module.exports = router;
