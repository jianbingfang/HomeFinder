'use strict';
/**
 * 常用方法
 * Created by jianbingfang on 2014/10/29.
 */

var school = require('../model/keySchool');

var isInSchoolList = function (list, name) {

    for (var school in list) {
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

module.exports.isKeyJuniorSchool = isKeyJuniorSchool;
module.exports.isKeySeniorSchool = isKeySeniorSchool;
module.exports.lnglat2str = lnglat2str;