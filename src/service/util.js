'use strict';
/**
 * 常用方法
 * Created by jianbingfang on 2014/10/29.
 */

var school = require('../model/keySchool');

var isInSchoolList = function (list, name) {

    for (var school in list) {
        if (list.hasOwnProperty(school)) {
            var tag = true;
            var lastPos = -1;
            for (var i = 0; i < list[school].length; i++) {
                lastPos = name.substring(lastPos + 1).indexOf(list[school][i]);
                if (lastPos === -1) {
                    tag = false;
                    break;
                }
            }
            if (tag === true) {
                console.log('key school matched: ' + list[school]);
                return true;
            }
        }
    }
    return false;
};

var isKeyJuniorSchool = function (name) {
    return isInSchoolList(school.getKeyJuniorSchool(), name);
};

var isKeySeniorSchool = function (name) {
    return isInSchoolList(school.getKeySeniorSchool(), name);
};

var lnglat2str = function (lnglat) {
    return lnglat.lat + "," + lnglat.lng;
};

var distanceBetweenPoints = function (p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }
    var R = 6378137.0;
    var dLat = (p2.lat - p1.lat) * Math.PI / 180;
    var dLon = (p2.lng - p1.lng) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

var normalizeScore = function (param) {
    if (param && param.results.length > 1) {
        var data = param.results;
        var max = data[0].count;
        var min = data[0].count;
        for (var i = 0; i < data.length; i++) {
            if (data[i].count > max) {
                max = data[i].count;
            }
            if (data[i].count < min) {
                min = data[i].count;
            }
        }
        if (max !== min) {
            for (i = 0; i < data.length; i++) {
                data[i].count = 100 * (data[i].count - min) / (max - min);
            }
        }
        return data;
    }
};

exports.isKeyJuniorSchool = isKeyJuniorSchool;
exports.isKeySeniorSchool = isKeySeniorSchool;
exports.lnglat2str = lnglat2str;
exports.distanceBetweenPoints = distanceBetweenPoints;
exports.normalizeScore = normalizeScore;