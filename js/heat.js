var map = new BMap.Map("map"); // 创建地图实例
var mPoint = new BMap.Point(116.351633, 40.004179);  

map.enableScrollWheelZoom();
map.centerAndZoom(mPoint,15);

var marker = new BMap.Marker(mPoint);
map.addOverlay(marker);

var searchRadius = 1000;

var circle = new BMap.Circle(mPoint,searchRadius,{fillColor:"grey", strokeWeight: 1,fillOpacity: 0.1, strokeOpacity: 0});
map.addOverlay(circle);

var searchOptions = {
    renderOptions: {
        map: map,
        autoViewport: false,
        selectFirstResult: false        
    },
    pageCapacity: 100,
    onSearchComplete: function(resultsArr){

        // console.log(resultsArr);

        if (local.getStatus() == BMAP_STATUS_SUCCESS){     
            // 判断状态是否正确
            var s = [];
            var counter = 1; 
            for(var i = 0; i < resultsArr.length; i++){
                var results = resultsArr[i];
                alert(results.getCurrentNumPois()+'/'+results.getNumPois());                
                for (var j = 0; j < results.getCurrentNumPois(); j ++){      
                    s.push("["+counter+"] "+results.getPoi(j).title + " - " + results.getPoi(j).address);   
                    console.log(results.getPoi(j));
                    counter++;
                }      
                document.getElementById("log").innerHTML = s.join("<br>"); 
            }     
        }
    }      
}; 

var local = new BMap.LocalSearch(map, searchOptions);
var keyword = ["川菜","粤菜"];
local.searchNearby(keyword, mPoint, searchRadius);
