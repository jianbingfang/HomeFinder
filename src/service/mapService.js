'use strict';
/**
 * 百度地图相关服务
 * Created by jianbingfang on 2014/10/24.
 */

var nodegrass = require('nodegrass');
var core = require('./core');
var util = require('./util');

var bmapPlaceHost = "http://api.map.baidu.com/place/v2/search";
var bmapDirectionHost = "http://api.map.baidu.com/direction/v1/routematrix";
var ak = 'Wu85qkU4ZK6bH3fcNhp453dL';

/**
 * 搜索附近POI信息
 * @param params
 * @param succCallBack
 * @param failCallback
 */
var nearbySearch = function (params, succCallBack, failCallback) {

    var mLocation = params.location;
    var mKeyword = params.keyword;          // max num: 10
    var mRadius = params.radius || 1000;    // default: 1km
    var mScope = params.scope || 1;         // default: 1
    var mPageSize = params.pageSize || 10;
    var mPageNum = params.pageNum || 0;

    var filterStr = "";
    if (params.filter) {
        mScope = 2;
        var mFilter = params.filter;
        var mSortName = params.sort_name || 'default';
        var mSortRule = params.sort_rule || 0;
        filterStr += "&filter=" + mFilter + "&sort_name=" + mSortName + "&sort_rule=" + mSortRule;
    }

    var url = bmapPlaceHost + "?ak=" + ak + "&output=json" +
        "&page_size=" + mPageSize + "&page_num=" + mPageNum + "&scope=" + mScope + "&radius=" + mRadius +
        "&query=" + mKeyword + "&location=" + mLocation + filterStr;


    nodegrass.get(url, function (data, status) {
        console.log("nearbySearch query: " + status);
        //console.log("nodegrass: " + data.toString());
        if (status === 200) {
            var mData = JSON.parse(data);
//            console.log(mData);
//            mData.type = type;
            succCallBack(mData);
        } else {
            console.log('query: null...');
            failCallback(mData != undefined ? mData.message : 'nodegrass query failed...');
        }
    }, null, 'utf8').on('error', function (e) {
        console.log('error in nearbySearch');
        failCallback(e.message);
    });
};

/**
 * 获取用户偏好信息
 * @param queryInfo
 * @param callback
 */
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

        nearbySearch({
            type: key,
            location: location,
            keyword: keyword,
            radius: radius
        }, function (data) {
            /* 查询成功 */
            // console.log(data);
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
    };

    getPreferInfoHelper(queryInfo, 0, callback);
};

var getDistanceRow = function (location, landmarks, column, result, succCallBack, failCallback) {

    var originString = "origins=" + location.lat + "," + location.lng;
    var destinationString = "destinations=" + landmarks[column].lat + "," + landmarks[column].lng;
    var url = bmapDirectionHost + "?ak=" + ak + "&output=json" + "&" + originString + "&" + destinationString;
    console.log("column=" + column + ";url=" + url);
    nodegrass.get(url, function (data, status, headers) {
        var mData = JSON.parse(data);
        console.log("getDistanceRow:" + status);
        if (status === 200) {
            if (column + 1 < landmarks.length) {
                console.log(mData.result.elements[0].duration.text);
                result += mData.result.elements[0].duration.text + ',';
                getDistanceRow(location, landmarks, column + 1, result, succCallBack, failCallback);
            }
            else if (column + 1 === landmarks.length) {
                result += mData.result.elements[0].duration.text + ',';
                console.log(result);
                succCallBack(result);
            }
        } else {
            console.log("getDistanceRow error at column:" + column);
            failCallback(result);
        }
    }, null, 'utf8').on('error', function (e) {
        console.log("getDistanceRow error:" + e.message);
    });

};

var evaluateDuration = function (params, succCallBack, failCallback) {
    var type = params.type;
    var location = params.location;
    var landmarks = params.mQueryInfo.location;
    var result = [];
    console.log("length:" + landmarks.length);

    getDistanceRow(location, landmarks, 0, result, succCallBack, failCallback);
};


var getDistance = function (params, succCallBack, failCallback) {
    //params=['oringin':[[lat11,lng11],[lat12,lng12],....],'destination':[[lat21,lng21],[lat22,lng22],...]]
    var type = params.type;

    var originString = "origins=";
    var destinationString = "destinations=";
    var s1 = params.origin;
    var s2 = params.destination;
    originString = originString + s1[1] + "," + s1[0];
    destinationString = destinationString + s2[1] + "," + s2[0];
    var url = bmapDirectionHost + "?ak=" + ak + "&output=json" + "&" + originString + "&" + destinationString;
    console.log("url:" + url);
    nodegrass.get(url, function (data, status, headers) {
        var mData = JSON.parse(data);
        console.log("Service query [" + type + "]:" + status);
        console.log(url);
        if (status === 200) {
            mData.type = type;
            console.log(mData.result.elements[0].duration.text);
            succCallBack(mData);
        } else {
            console.log("query: null...");
            failCallback(mData);
        }
    }, null, 'utf8').on('error', function (e) {
        console.log("getDistance error: " + e.message);
        failCallback(e);
    });
};

/**
 * 判断待考察地点附近是否有重点中学
 * @param params
 * @param succCallBack
 * @param failCallback
 */
var hasKeySchool = function (params, succCallBack, failCallback) {

    var hasKeySchoolHelper = function (params, pageNum, succCallBack, failCallback) {

        var mLocation = params.location;
        var mRadius = params.radius || 1500;    // default: 1.5km
        var mScope = 2;         // default: 2
        var mKeyword = '中学';
        var mPageSize = 20;                     // max pageSize: 20

        nearbySearch({
            location: mLocation,
            keyword: mKeyword,
            scope: mScope,
            radius: mRadius,
            pageSize: mPageSize,
            pageNum: pageNum
        }, function (data) {
            /* 查询成功 */
//            console.log(data);
            if (data.status === 0) {
                /* 若数据获取成功 */
                var hasKeySchool = 0;
                for (var school in data.results) {
                    console.log('judging school: ' + data.results[school].name);
                    if (util.isKeyJuniorSchool(data.results[school].name) === true) {
                        hasKeySchool = 1;
                        break;
                    }
                }

                if (hasKeySchool === 1) {
                    succCallBack(1);
                } else {
                    if (pageNum * mPageSize + data.results.length >= data.total) {
                        succCallBack(0);
                    } else {
                        hasKeySchoolHelper(params, pageNum + 1, succCallBack, failCallback);
                    }
                }
            } else {
                failCallback(data.message);
            }
        }, function (message) {
            /* 查询失败 */
            failCallback(message);
        });
    };

    hasKeySchoolHelper(params, 0, succCallBack, failCallback);
};

var getDistanceOfNearest = function (params, callback) {

    var results = [];

    var getDistanceOfNearestHelper = function (params, index, mCallback) {

        if (index >= params.keywords.length) {
            return mCallback(results);
        }

        console.log('caculating distance of ' + params.keywords[index]);

        var mLocation = params.location;
        var mKeyword = params.keywords[index];
        var mRadius = params.radius || 1500;
        var mScope = 2;
        var mPageSize = 1;
        var mPageNum = 0;
        var mFilter = params.filter;
        var mSortName = params.sort_name;
        var mSortRule = params.sort_rule;

        nearbySearch({
            location: mLocation,
            keyword: mKeyword,
            scope: mScope,
            radius: mRadius,
            pageSize: mPageSize,
            pageNum: mPageNum,
            filter: mFilter,
            sort_name: mSortName,
            sort_rule: mSortRule
        }, function (data) {
            /* 查询成功 */
            //console.log(data);
            if (data.status === 0 && data.results.length > 0) {
                /* 若数据获取成功 */
                results.push(data.results[0].detail_info.distance);
            } else {
                /* 若数据为空 */
                results.push(0);
            }
            getDistanceOfNearestHelper(params, index + 1, mCallback);
        }, function (message) {
            /* 查询失败 */
            console.log('getDistanceOfNearestHelper[' + index + '] error: ' + message);
            results.push(0);
            getDistanceOfNearestHelper(params, index + 1, mCallback);
        });

    };

    getDistanceOfNearestHelper(params, 0, callback);
};

var getGridPoints = function (southWest, range, size) {

    var grid = {
        lngRange: range.lng / (size.lng - 1),
        latRange: range.lat / (size.lat - 1)
    };

    var spots = [];

    for (var i = 0; i < size.lat; i++) {
        for (var j = 0; j < size.lng; j++) {
            spots.push({
                lng: southWest.lng + grid.lngRange * j,
                lat: southWest.lat + grid.latRange * i
            });
        }
    }

    return spots;
};

module.exports.evaluateDuration = evaluateDuration;
module.exports.getPreferInfo = getPreferInfo;
module.exports.nearbySearch = nearbySearch;
module.exports.getDistance = getDistance;
module.exports.hasKeySchool = hasKeySchool;
module.exports.getDistanceOfNearest = getDistanceOfNearest;
module.exports.getGridPoints = getGridPoints;