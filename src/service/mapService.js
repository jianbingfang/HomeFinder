/**
 * 百度地图相关服务
 * Created by jianbingfang on 2014/10/24.
 */

var nodegrass = require('nodegrass');

var bmapPlaceHost = "http://api.map.baidu.com/place/v2/search";
var bmapDirectionHost = "http://api.map.baidu.com/direction/v1/routematrix";
var ak = 'Wu85qkU4ZK6bH3fcNhp453dL';

var nearbySearch = function (params, succCallBack, failCallback) {

    var type = params.type;

    var mLocation = params.location;
    var mKeyword = params.keyword;          // max num: 10
    var mRadius = params.radius || 1000;    // default: 1km
    var mScope = params.scope || 1;         // default: 1

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
            failCallback(mData.message);
        }
    }, null, 'utf8').on('error', function (e) {
        failCallback(e.message);
    });
}

var getDistanceRow=function (location, landmarks, column , result, succCallBack, failCallback){

        var originString="origins="+location.lat+","+location.lng;
        var destinationString="destinations="+landmarks[column].lat+","+landmarks[column].lng;
        var url = bmapDirectionHost+"?ak="+ak+"&output=json"+"&"+originString+"&"+destinationString;
        console.log("column="+column+";url="+url);
        nodegrass.get(url,function(data,status,headers){
            var mData= JSON.parse(data);
            console.log("getDistanceRow:"+ status);
            if (status == 200){
                if (column +1 <landmarks.length){
                console.log(mData.result.elements[0].duration.text);
                result+=mData.result.elements[0].duration.text+',';
                getDistanceRow(location, landmarks, column+1, result, succCallBack, failCallback);
            }
            else if(column+1 == landmarks.length){
                result+=mData.result.elements[0].duration.text+',';
                console.log(result);
                succCallBack(result);
            }
            }else{
                console.log("getDistanceRow error at column:"+ column);
                failCallback(result);
            }
        },null,'utf8').on('error',function(e){
            console.log("getDistanceRow error:"+ e.message);
        });

}

var evaluateDuration = function (params, succCallBack, failCallback){
    var type = params.type;
    var location = params.location;
    var landmarks = params.mQueryInfo.location;
    var result =[];
    console.log("length:"+landmarks.length);

    getDistanceRow(location, landmarks, 0, result, succCallBack, failCallback);
}


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
        if (status == 200) {
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
}

module.exports.evaluateDuration= evaluateDuration;
module.exports.nearbySearch = nearbySearch;
module.exports.getDistance = getDistance;