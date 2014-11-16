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

var getScore = function (origin, destinations, callback) {

    var data = {
        status: 0,
        message: 'ok',
        results: {
            score: [],
            count: 0
        }
    };

    var getScoreHelper = function (origin, destinations, index, callback) {

        if (index >= destinations.length) {
            var sum = 0;
            var num;
            for (num = 0; num < data.results.score.length; num++) {
                sum += data.results.score[num];
            }
            data.results.count = sum / num;
            return callback(data);
        }

        var mLocation = util.lnglat2str(origin);

        mapService.hasKeySchool({
            location: mLocation
        }, function (doesItHas) {

            /* 查询成功 */
            console.log('hasKeySchool query result: ' + doesItHas);
            //data.results.hasKeySchool = doesItHas;

            mapService.getLocationOfNearest({
                location: mLocation,
                keywords: keywords,
                filter: 'life',
                radius: 3000,
                sort_name: 'distance',
                sort_rule: 0
            }, function (locationArray) {
                /* 查询成功 */
                console.log('distance query result: ' + locationArray.toString());
                //data.results.location = locationArray;

                // 计算到目标点的距离
                // var d = util.distanceBetweenPoints(origin, destinations[index]);

                var newLocationArray = [destinations[index]].concat(locationArray);

                mapService.getDuration(origin, newLocationArray, function (durationArray) {
                    var arg = [doesItHas].concat(durationArray);
                    var score = evaluate(arg);
                    console.log('>> SCORE: ' + score);
                    data.results.score.push(score);
                    getScoreHelper(origin, destinations, index + 1, callback);
                }, function (message) {
                    console.log("mapService.getDuration error: " + message);
                    data.results.score.push(0);
                    getScoreHelper(origin, destinations, index + 1, callback);
                });

            });

        });

    };

    getScoreHelper(origin, destinations, 0, callback);
};

var getScoreOfPoints = function (originArray, destinationArray, callback) {

    var data = {
        status: 0,
        message: 'ok',
        results: []
    };

    //console.log(originArray);

    var getScoreOfPointsHelper = function (index, destinationArray, callback) {

        if (index >= originArray.length) {
            console.log('before norm: ');
            console.log(data.results);
            util.normalizeScore(data);
            console.log('after norm: ');
            console.log(data.results);
            return callback(data);
        }

        getScore(originArray[index], destinationArray, function (dt) {
            if (!!dt.results.count) {
                data.results.push({
                    lng: originArray[index].lng,
                    lat: originArray[index].lat,
                    count: dt.results.count
                });
            }
            getScoreOfPointsHelper(index + 1, destinationArray, callback);
        });
    };


    getScoreOfPointsHelper(0, destinationArray, callback);
};

//exports.evaluate = evaluate;
exports.getScore = getScore;
exports.getScoreOfPoints = getScoreOfPoints;