'use strict';

var school = require('../model/keySchool');

var isInSchoolList = function (list, name) {

    for (var school in list) {
        var tag = true;
        var lastPos = -1;
        for (var i = 0; i < school.length; i++) {
            lastPos = name.substring(lastPos+1).indexOf(school.charAt(i));
            if (lastPos === -1) {
                tag = false;
                break;
            }
        }
        if (tag === true) {
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

module.exports.isKeyJuniorSchool = isKeyJuniorSchool;
module.exports.isKeySeniorSchool = isKeySeniorSchool;
