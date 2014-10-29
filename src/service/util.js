'use strict';

var school = require('../model/keySchool');

var isKeyJuniorSchool = function (name) {
    return school.getKeyJuniorSchool.indexOf(name) !== -1;
};

var isKeySeniorSchool = function (name) {
    return school.getKeyJuniorSchool.indexOf(name) !== -1;
};


module.exports.isKeyJuniorSchool = isKeyJuniorSchool;
module.exports.isKeySeniorSchool = isKeySeniorSchool;
