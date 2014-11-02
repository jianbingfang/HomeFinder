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

    //var queryInfo = req.query.queryInfo;

    var mapInfo = req.query.mapInfo;

    mapInfo.southWest.lat = parseFloat(mapInfo.southWest.lat);
    mapInfo.southWest.lng = parseFloat(mapInfo.southWest.lng);
    mapInfo.range.lat = parseFloat(mapInfo.range.lat);
    mapInfo.range.lng = parseFloat(mapInfo.range.lng);

    var hotSpots = mapService.getGridPoints(mapInfo.southWest, mapInfo.range, {lng: 4, lat: 3});

    console.log(mapInfo);
    //console.log(hotSpots);

    var testData = {
        origination: {lat: 39.999277, lng: 116.348646},
        destination: {lat: 39.999277, lng: 116.348646}
    };

    //core.getScore(testData.origination, testData.destination, function (data) {
    //    res.send(data);
    //});

    core.getScoreOfPoints(hotSpots, testData.destination, function (data) {
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
