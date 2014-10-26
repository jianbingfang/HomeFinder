var express = require('express');
var core = require('../src/service/core');
var mapService = require('../src/service/mapService');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/**
 * 服务器代为查询某个地点的相关待考察信息
 */
router.get('/search/nearby', function (req, res) {

    var radius = req.query.radius || 1000;  // default: 1km
    var keyword = req.query.keyword;
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

var getPreferInfo = function (queryInfo, callback) {

    callback = callback || function () {
    };

    var results = [];
    var getPreferInfoHelper = function (mQueryInfo, index, mCallback) {

        index = index || 0;
        if (index >= Object.keys(mQueryInfo.prefer).length) {
            return mCallback(results);
        }

        var radius = mQueryInfo.radius || 1000;  // default: 1km
        var location = mQueryInfo.location[0].lat + ',' + mQueryInfo.location[0].lng;
        var key = Object.keys(mQueryInfo.prefer)[index];

        var keyword = '';
        for (var i = 0; i < mQueryInfo.prefer[key].length; i++) {
            keyword += mQueryInfo.prefer[key][i] + '$';
        }

        mapService.nearbySearch({
            type: key,
            location: location,
            keyword: keyword,
            radius: radius
        }, function (data) {
            /* 查询成功 */
//        console.log(data);
            var result = {
                status: data.status,
                message: data.message,
                count: data.total
            };
            if (result.status === 0) {
                /* 若nearby数据获取成功 */
                result.score = core.evaluate();
            }
            results.push(result);
            getPreferInfoHelper(mQueryInfo, index + 1, mCallback);
        }, function (message) {
            /* 查询失败 */
            console.log('nearbySearch error: ' + message);
            var result = {
                status: -1,
                message: message
            };
            results.push(result);
            getPreferInfoHelper(mQueryInfo, index + 1, mCallback);
        });
    }

    getPreferInfoHelper(queryInfo, 0, callback);
}

router.get('/evaluate', function (req, res) {

    var mQueryInfo = req.query;

    console.log(mQueryInfo);

    getPreferInfo(mQueryInfo, function (data) {
        console.log(data);
    });

    var result = {
        status: 0,
        message: 'msg',
        score: 60
    }
    res.send(result);
});

function eachSeries(arr, iterator, callback) {
    callback = callback || function () {
    };
    if (!arr.length) {
        return callback();
    }
    var completed = 0;
    var iterate = function () {
        iterator(arr[completed], function (err) {
            if (err) {
                callback(err);
                callback = function () {
                };
            }
            else {
                completed += 1;
                if (completed >= arr.length) {
                    callback(null);
                }
                else {
                    iterate();
                }
            }
        });
    };
    iterate();
}

module.exports = router;
