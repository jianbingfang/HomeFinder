/**
 * 百度地图相关服务
 * Created by jianbingfang on 2014/10/24.
 */

var nodegrass = require('nodegrass');

var bmapPlaceHost = "http://api.map.baidu.com/place/v2/search";
var bmapDirectionHost="http://api.map.baidu.com/direction/v1/routematrix";
var ak = 'Wu85qkU4ZK6bH3fcNhp453dL';



module.exports.nearbySearch = function (params, succCallBack, failCallback) {

    var type = params.type;

    var mLocation = params.location;
    var mKeyword = params.keyword;
    var mRadius = params.radius || 1000;  // default: 1km
    var mScope = params.scope || 1;    // default: 1

    var url = bmapPlaceHost + "?ak=" + ak + "&output=json" +
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
            failCallback(mData);
        }
    }, null, 'utf8').on('error', function (e) {
        console.log("nearbySearch error: " + e.message);
        failCallback(e);
    });
}

module.exports.getDistance = function (params, succCallBack, failCallback){
    //params=['oringin':[[lat11,lng11],[lat12,lng12],....],'destination':[[lat21,lng21],[lat22,lng22],...]]
    var type = params.type;

    var originString="origins=";
    var destinationString = "destinations=";
    var s1 = params.origin;
    var s2 = params.destination;
    originString=originString+s1[1]+","+s1[0];
    destinationString= destinationString+s2[1]+","+s2[0];
    var url = bmapDirectionHost+"?ak="+ak+"&output=json"+"&"+originString+"&"+destinationString;
    console.log("url:"+url);
    nodegrass.get(url, function(data,status,headers){
        var mData=JSON.parse(data);
        console.log("Service query ["+ type +"]:"+status);
        console.log(url);
        if (status == 200){
            mData.type = type;
            console.log(mData.result.elements[0].duration.text);
            succCallBack(mData);
        }else{
            console.log("query: null...");
            failCallback(mData);
        }
    },null,'utf8').on('error',function(e){
        console.log("getDistance error: "+ e.message);
        failCallback(e);
    });
}
