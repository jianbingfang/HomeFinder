var map = new BMap.Map("allmap");
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 13);

var marker = new BMap.Marker(new BMap.Point(116.404, 39.915)); // 创建点
var polyline = new BMap.Polyline([
    new BMap.Point(116.399, 39.910),
    new BMap.Point(116.405, 39.920)
], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});   //创建折线


var pStart = new BMap.Point(116.392214, 39.918985);
var pEnd = new BMap.Point(116.41478, 39.911901);
var rectangle = new BMap.Polygon([
    new BMap.Point(pStart.lng, pStart.lat),
    new BMap.Point(pEnd.lng, pStart.lat),
    new BMap.Point(pEnd.lng, pEnd.lat),
    new BMap.Point(pStart.lng, pEnd.lat)
], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});  //创建矩形

//添加覆盖物
function add_overlay() {
    map.addOverlay(marker);            //增加点
    map.addOverlay(polyline);          //增加折线
    map.addOverlay(rectangle);         //增加矩形
}
//清除覆盖物
function remove_overlay() {
    map.clearOverlays();
}

add_overlay();