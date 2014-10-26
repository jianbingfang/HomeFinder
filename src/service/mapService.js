/**
 * 百度地图相关服务
 * Created by jianbingfang on 2014/10/24.
 */

var nodegrass = require('nodegrass');
var querystring = require('querystring')
var http = require('http');

var bmapHost = "http://api.map.baidu.com/place/v2/search";
var ak = 'Wu85qkU4ZK6bH3fcNhp453dL';

var nearbySearch = function (params, succCallBack, failCallback) {

    var type = params.type;

    var mLocation = params.location;
    var mKeyword = params.keyword;          // max num: 10
    var mRadius = params.radius || 1000;    // default: 1km
    var mScope = params.scope || 1;         // default: 1

    var url = bmapHost + "?ak=" + ak + "&output=json" +
        "&page_size=1&page_num=0&scope=" + mScope + "&radius=" + mRadius +
        "&query=" + mKeyword + "&location=" + mLocation;

    nodegrass.get(url, function (data, status, headers) {
        var mData = JSON.parse(data);
        console.log("Service query [" + type + "]: " + status);
        console.log(url);
        if (status === 200) {
            mData.type = type;
//            console.log('type: ' + mData.type);
//            console.log('-------------------------------');
            succCallBack(mData);
        } else {
            console.log('query: null...');
            failCallback(mData.message);
        }
    }, null, 'utf8').on('error', function (e) {
        failCallback(e.message);
    });

}

module.exports.nearbySearch = nearbySearch;