'use strict';
/**
 * Created by jianbingfang on 2014/12/16.
 */

var southWest = {lng: 116.213828, lat: 39.864778};
var northEast = {lng: 116.555401, lat: 40.029763};
var gridSizeLat = 0.006108; // 500m
var gridSizeLng = gridSizeLat * 1.3;
var gridResolution = {
    lng: Math.floor((northEast.lng - southWest.lng) / gridSizeLng),
    lat: Math.floor((northEast.lat - southWest.lat) / gridSizeLat)
};

/**
 * 根据坐标获取网格的ID编号
 * @param coordinate 目标点坐标
 * @returns 目标点所在网格编号
 */
exports.getGridIdByCoordinate = function (coordinate) {

    var size = {
        lng: Math.floor((northEast.lng - southWest.lng) / gridSizeLng),
        lat: Math.floor((northEast.lat - southWest.lat) / gridSizeLat)
    };

    var coord = {
        lng: Math.floor((coordinate.lng - southWest.lng) / gridSizeLng),
        lat: Math.floor((coordinate.lat - southWest.lat) / gridSizeLat)
    };

    return (coord.lat * size.lng + coord.lng);
};

/**
 * 根据网格的ID编号获取网格中心的坐标
 * @param id 网格的ID编号
 * @returns {{lng: number, lat: number}} 网格中心的坐标
 */
exports.getGridCoordinateById = function (id) {

    var x = id % gridResolution.lng;
    var y = Math.floor(id / gridResolution.lng);

    return {
        lng: (southWest.lng + gridSizeLng * x + gridSizeLng / 2).toFixed(6),
        lat: (southWest.lat + gridSizeLat * y + gridSizeLat / 2).toFixed(6)
    };

};

exports.getGridNum = function () {
    return (gridResolution.lng * gridResolution.lat);
};