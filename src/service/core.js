'use strict';
/**
 * Created by jianbingfang on 2014/10/26.
 */
var mapService = require('./mapService');
var util = require('./util');

var keywords = ['高中', '篮球场', '公园', '地铁'];

var evaluate = function (data) {
    console.log('evaluating score of ' + data.toString());
    var coefficients = [800, -400, -59.6, -42.3, -69.1, -133];

    var score = 0;
    if (coefficients.length === data.length) {
        for (var i = 0; i < data.length; i++) {
            score += coefficients[i] * data[i];
        }
    }
    return score;
};

var getScore = function (origin, destination, callback) {

    var data = {
        status: 0,
        message: 'ok',
        results: {}
    };

    var mLocation = util.lnglat2str(origin);

    mapService.hasKeySchool({
        location: mLocation
    }, function (doesItHas) {
        /* 查询成功 */
        console.log('hasKeySchool query result: ' + doesItHas);
        data.results.hasKeySchool = doesItHas;

        mapService.getDistanceOfNearest({
            location: mLocation,
            keywords: keywords,
            filter: 'life',
            sort_name: 'distance',
            sort_rule: 0
        }, function (distanceArray) {
            /* 查询成功 */
            console.log('distance query result: ' + distanceArray.toString());
            data.results.distance = distanceArray;

            // 计算到目标点的距离
            var d = util.distanceBetweenPoints(origin, destination);

            var arg = [doesItHas, d].concat(distanceArray);
            var score = evaluate(arg);
            console.log('>> SCORE: ' + score);
            data.results.score = score;
            callback(data);
        });

    }, function (message) {
        /* 查询失败 */
        console.log('hasKeySchool: ' + message);
        data.status = 1;
        data.message = message;
        callback(data);
    });
};

var getScoreOfPoints = function (originArray, destination, callback) {

    var data = {
        status: 0,
        message: 'ok',
        results: []
    };

    console.log(originArray);

    var getScoreOfPointsHelper = function (index, destination, callback) {

        if (index >= originArray.length) {

            console.log('before norm: ');
            console.log(data.results);
            util.normalizeScore(data);
            console.log('after norm: ');
            console.log(data.results);
            return callback(data);
        }

        getScore(originArray[index], destination, function (dt) {
            if (!!dt.results.score) {
                data.results.push({
                    lng: originArray[index].lng,
                    lat: originArray[index].lat,
                    count: dt.results.score
                });
            }
            getScoreOfPointsHelper(index + 1, destination, callback);
        });
    };


    getScoreOfPointsHelper(0, destination, callback);
};

//module.exports.evaluate = evaluate;
module.exports.getScore = getScore;
module.exports.getScoreOfPoints = getScoreOfPoints;