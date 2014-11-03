'use strict';

var map = new BMap.Map("map");                              // 创建Map实例
var geoc = new BMap.Geocoder();
!function () { //初始化地图模块相关代码
    map.enableScrollWheelZoom();                            // 启用滚轮放大缩小 
    map.enableContinuousZoom();                             // 启用地图惯性拖拽，默认禁用
    map.enableInertialDragging();                           // 启用连续缩放效果，默认禁用。
    map.addControl(new BMap.NavigationControl());           // 添加平移缩放控件
    map.addControl(new BMap.ScaleControl());                // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());          // 添加缩略地图控件
    map.addControl(new BMap.MapTypeControl());              // 添加地图类型控件
    map.centerAndZoom(new BMap.Point(116.348646, 39.999277), 15); // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("北京");                             //由于有3D图，需要设置城市哦
}();

/**
 * 一次查询需要用户提供的信息
 * @type {{location: {lng: number, lat: number}[], mode: string, prefer: {cater: Array, entertainment: Array, sport: Array}}}
 */
var queryInfo = {
    location: [
        map.getBounds().getCenter()
    ], // 可包含多个，格式为：{"lng" : 116, "lat" : 40}
    mode: "transit",   // 驾车为"driving"，公交为"transit"，默认值："transit"
    prefer: {
        cater: [],
        entertainment: [],
        sport: []
    }
};

var mapInfo = {
    UpperleftLocation: {lng: -1, lat: -1},//左上角的经纬度至
    lngRange: -1,//地图经度跨度
    latRange: -1,//地图纬度跨度
    resolution: -1//分辨率
};


var queryResult = {
    duration: [],
    prefer: {
        cater: [],
        entertainment: [],
        sport: []
    }
};

/**
 * 一些常用的方法
 */
var Util = {
    /**
     * 根据类型的id获取相应的名称
     * @param Number typeid
     * @return String 名称
     */
    getLeaseNameByType: function (type) {
        var lease = {
            '1': "整租",
            '2': "单间出租",
            '3': "单间出租(隔断)",
            '4': "床位出租"
        };
        return lease[type];
    },
    /**
     * 设置Map容器的高度
     */
    setMapHeight: function () {
        var mapBoxHeight = $(window).height() - $('#pageHeader').height() - $('#pageMiddle').height() - 38;
        $('#mapBox').css({height: mapBoxHeight + 'px'});
    },

    getDistance: function (origin, destination) {
        $.getJSON('/distance/query', {
            type: 'getDistance',
            origin: origin,
            destination: destination
        }, function (data) {
            alert(data.result.elements[0].duration.text);
        }).fail(function () {
            alert("get distance service error!");
        });
    },

    evaluateDuration: function (mapInfo, mQueryInfo) {
        $.get('/duration/evaluate', {
            type: 'evaluateDuration',
            mapInfo: mapInfo,
            mQueryInfo: mQueryInfo
        }, function (data) {
            alert(data);
        }).fail(function () {
            alert("evaluate duration service error!");
        });
    },


    /**
     * 获取坐标点point对于查询条件的相关评估数据
     * @param position 待评分点坐标，例如{'lng': 116.351633, 'lat': 40.004179}
     * @param mQueryInfo 一个queryInfo对象
     */
    collectInfoOfPosition: function (position, mQueryInfo) {

        for (var key in mQueryInfo.prefer) {
            mQueryInfo.prefer[key] = [];
            $('#' + key + ' li input').each(function () {
                if ($(this).is(':checked')) {
                    mQueryInfo.prefer[key].push($(this).val());
                }
            });

            if (mQueryInfo.prefer[key].length > 0) {
                var keyword = mQueryInfo.prefer[key][0];
                for (var i = 1; i < mQueryInfo.prefer[key].length; i++) {
                    keyword += '$' + mQueryInfo.prefer[key][i];
                }
            }
        }

        var bounds = map.getBounds();

        var beginTime = new Date().getTime();
        $.getJSON('/evaluate', {
            queryInfo: mQueryInfo,
            mapInfo: {
                southWest: {lng: bounds.getSouthWest().lng, lat: bounds.getSouthWest().lat},
                range: {lng: bounds.toSpan().lng, lat: bounds.toSpan().lat}
            }
        }, function (data) {
            if (data.status === 0) {
                //alert("重点中学: " + data.results.hasKeySchool +
                //".\n距离: " + data.results.distance.toString() +
                //".\n评分: " + data.results.score);
                var endTime = new Date().getTime();
                hotSpots = data.results;
                console.log(hotSpots);
                renderHeatmap();

                alert('第一点分数: ' + data.results[0].count + "\n耗时: " + (endTime - beginTime) + "ms");
            } else {
                alert("ERROR: " + data.message);
            }
        }).fail(function () {
            alert("nearby search service error!");
        });
    }
}

var hotSpots = [];

//landmark相关

var icon = new BMap.Icon('../img/anchor.png', new BMap.Size(20, 32), {
    anchor: new BMap.Size(10, 30)
});

function addLandMark(e) {
    var mkr = new BMap.Marker(e.point, {icon: icon});
    map.addOverlay(mkr);
    var a = {};
    a.lng = e.point.lng;
    a.lat = e.point.lat;

    //landmark.push(e.point.lng);
    queryInfo.location.push(a);

    alert(queryInfo.location.length);
    //alert(e.point.lng+","+e.point.lat);

}
//map.addEventListener("click", addLandMark);


if (!isSupportCanvas()) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}
//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
/* visible 热力图是否显示,默认为true
 * opacity 热力的透明度,1-100
 * radius 势力图的每个点的半径大小   
 * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
 *  {
 .2:'rgb(0, 255, 255)',
 .5:'rgb(0, 110, 255)',
 .8:'rgb(100, 0, 255)'
 }
 其中 key 表示插值的位置, 0~1.
 value 为颜色值.
 */


var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 40});

//渲染热力图
function renderHeatmap() {
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data: hotSpots, max: 100});
}
//是否显示热力图
function openHeatmap() {
    heatmapOverlay.show();
}
function closeHeatmap() {
    heatmapOverlay.hide();
}

function setGradient() {
    /*格式如下所示:
     {
     0:'rgb(102, 255, 0)',
     .5:'rgb(255, 170, 0)',
     1:'rgb(255, 0, 0)'
     }*/
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors, 0);
    colors.forEach(function (ele) {
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay.setOptions({"gradient": gradient});
}
//判断浏览区是否支持canvas
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

!function () {

    /**
     * 条件筛选模块相关代码 start
     * 条件筛选的数据
     */
    var tagData = [
        {
            "name": "饮食",
            "value": "cater",
            "data": [
                {
                    "name": "川菜",
                    "value": "川菜"
                },
                {
                    "name": "湘菜",
                    "value": "湘菜"
                },
                {
                    "name": "粤菜",
                    "value": "粤菜"
                },
                {
                    "name": "鲁菜",
                    "value": "鲁菜 "
                },
                {
                    "name": "东北菜",
                    "value": "东北菜"
                }
            ]
        },
        {
            "name": "娱乐",
            "value": "entertainment",
            "data": [
                {
                    "name": "KTV",
                    "value": "KTV"
                },
                {
                    "name": "电影",
                    "value": "电影"
                },
                {
                    "name": "台球",
                    "value": "台球"
                },
                {
                    "name": "书店",
                    "value": "书店"
                },
                {
                    "name": "酒吧",
                    "value": "酒吧"
                },
                {
                    "name": "咖啡厅",
                    "value": "咖啡厅"
                }
            ]
        },
        {
            "name": "运动",
            "value": "sport",
            "data": [
                {
                    "name": "健身",
                    "value": "健身"
                },
                {
                    "name": "游泳",
                    "value": "游泳"
                },
                {
                    "name": "篮球",
                    "value": "篮球"
                }
            ]
        }
    ];

    for (var i in tagData) { //条件筛选的各个项
        var item = tagData[i],
            data = item.data,
            dl = $('<dl id="' + item.value + '" class="dl-horizontal" value="' + item.value + '"><dt>' + item.name + '：</dt></dl>'),
            ul = $('<ul class="inline"></ul>');
        for (var j in data) { //各个项对应的各详细选项
            var subData = data[j];
            $('<li><label class="checkbox"><input type="checkbox" value = ' + subData.value + '>' + subData.name + '</label></li>').appendTo(ul);
        }
        ul.appendTo($('<dd></dd>')).appendTo(dl);
        dl.appendTo($('#filterBox'));
    }

    // 点击选择项的事件
    $('#filterBox li input[type=checkbox]').click(function () {
        if ($(this).is(':checked')) {
            $(this).parents('label').addClass('activate');
        } else {
            $(this).parents('label').removeClass('activate');
        }

        /*var type = $(this).parents('dl').attr('value');
         $('#' + type + " li a").removeClass('activate');
         if (!$(this).hasClass('activate')) { //点击的不是当前的选项
         $(this).addClass('activate');
         $('#selectedValue div[type$=' + type + ']').remove(); //当前条件之前选择过的条件删除
         var item = $('<div class="span1" value="' + $(this).attr('value') + '" type="' + type + '"><span>' + $(this).html() + '</span></div>');
         //添加删除按钮
         var deleteBtn = $('<i class="icon-remove"></i>').click(function () {
         $(this).parent().remove();
         $('#' + type + " li a").removeClass('activate');
         keyword = $('#keyword').val();
         searchAction(keyword);
         });
         deleteBtn.appendTo(item);
         item.appendTo('#selectedValue'); //添加当前的筛选条件
         keyword = $('#keyword').val();
         searchAction(keyword);
         }*/
    });

    //条件筛选模块相关代码 end

    //检索模块相关代码
    var keyword = "",   //检索关键词
        page = 0,    //当前页码
        points = [],   //存储检索出来的结果的坐标数组
        customLayer = null; //麻点图层
    customLayer = new BMap.CustomLayer(4392); //新建麻点图图层对象
    map.addTileLayer(customLayer); //将麻点图添加到地图当中
    customLayer.addEventListener('hotspotclick', hotspotclickCallback); //给麻点图添加点击麻点回调函数

    /**
     * 麻点图点击麻点的回调函数
     * @param 麻点图点击事件返回的单条数据
     */
    function hotspotclickCallback(e) {
        var customPoi = e.customPoi,
            str = [];
        str.push("address = " + customPoi.address);
        str.push("phoneNumber = " + customPoi.phoneNumber);
        var content = '<p style="width:280px;margin:0;line-height:20px;">地址：' + customPoi.address + '</p>';
        //创建检索信息窗口对象
        var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title: customPoi.title,  //标题
            width: 290,              //宽度
            height: 40,              //高度
            enableAutoPan: true,     //自动平移
            enableSendToPhone: true, //是否显示发送到手机按钮
            searchTypes: [
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
            ]
        });
        var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
        searchInfoWindow.open(point); //打开信息窗口
    }

    // 设置周边搜索项
    var searchOptions = {
        renderOptions: {
            map: map,
            autoViewport: false,
            selectFirstResult: false
        },
        pageCapacity: 100
    };

    //绑定检索按钮事件
    $('#searchBtn').bind('click', function () {

        Util.collectInfoOfPosition({lng: 116.323026, lat: 39.990074}, queryInfo);

        // Util.getDistance([116.42076,39.915251],[116.425867,39.918989]);

//        mapInfo.UpperleftLocation.lng = 116.323026;
//        mapInfo.UpperleftLocation.lat = 39.990074;
//        mapInfo.lngRange = 10;
//        mapInfo.latRange = 10;
//        mapInfo.resolution = 10;
//        Util.evaluateDuration(mapInfo, queryInfo);
    });

    /**
     * 进行检索操作
     * @param 关键词
     * @param 当前页码
     */
    function searchAction(keyword, page) {
        page = page || 0;
        var filter = []; //过滤条件
        $.each($('#selectedValue div'), function (i, item) { //将选中的筛选条件添加到过滤条件参数中
            var type = $(item).attr('type'),
                value = $(item).attr('value');
            if (type == "location") {
                keyword = value + " " + keyword;
            } else {
                filter.push(type + ':' + value);
            }
        });
        var url = "http://api.map.baidu.com/geosearch/v2/local?callback=?";
        $.getJSON(url, {
            'q': keyword, //检索关键字
            'page_index': page,  //页码
            'filter': filter.join('|'),  //过滤条件
            'region': '131',  //北京的城市id
            'scope': '2',  //显示详细信息
            'geotable_id': 30960,
            'ak': 'A4749739227af1618f7b0d1b588c0e85'  //用户ak
        }, function (e) {
            renderList(e, page + 1);
            renderMap(e, page + 1);
        });
    }

    //绑定展开/收起事件
    $('#toggleBtn').bind('click', function () {
        $('#filterBox').toggle('normal', function () {
            Util.setMapHeight();
        });
    });

    //办定列表/地图模式切换事件
    $('#chgMode').bind('click', function () {
        $('#listBox').toggle('normal');
        $('#mapBox').toggle('normal', function () {
            if ($('#mapBox').is(":visible")) { //单显示地图时候，设置最佳视野
                map.setViewport(points);
            }
            ;
        });
    });

    /**
     * 渲染地图模式
     * @param result
     * @param page
     */
    function renderMap(res, page) {
        var content = res.contents;
        $('#mapList').html('');
        map.clearOverlays();
        renderHeatmap();

        points.length = 0;

        if (content.length == 0) {
            $('#mapList').append($('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;text-align:center;font-size:18px;" class="text-warning">抱歉，没有找到您想要的短租信息，请重新查询</p>'));
            return;
        }

        $.each(content, function (i, item) {
            var point = new BMap.Point(item.location[0], item.location[1]),
                marker = new BMap.Marker(point);
            points.push(point);
            var tr = $("<tr><td width='75%'><a href='###' target='_blank' onclick='Util.addLogCount()'>" + item.title + "<a/><br/>" + item.address + "</td><td width='25%'>" + item.dayprice + "<br/><span style='color:red;'>元/晚</span></td></tr>").click(showInfo);
            $('#mapList').append(tr);
            marker.addEventListener('click', showInfo);
            function showInfo() {
                var content = "<img src='" + item.mainimage + "' style='width:111px;height:83px;float:left;margin-right:5px;'/>" +
                    "<p>名称：" + item.title + "</p>" +
                    "<p>地址：" + item.address + "</p>" +
                    "<p>价格：" + item.dayprice + "</p>";
                //创建检索信息窗口对象
                var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                    title: item.title,      //标题
                    width: 290,             //宽度
                    panel: "panel",         //检索结果面板
                    enableAutoPan: true,     //自动平移
                    searchTypes: [
                        BMAPLIB_TAB_SEARCH,   //周边检索
                        BMAPLIB_TAB_TO_HERE,  //到这里去
                        BMAPLIB_TAB_FROM_HERE //从这里出发
                    ]
                });
                searchInfoWindow.open(marker);
            };
            map.addOverlay(marker);
        });

        /**
         * 分页
         */
        var pagecount = Math.ceil(res.total / 10);
        if (pagecount > 76) {
            pagecount = 76; //最大页数76页
        }
        function PageClick(pageclickednumber) {
            pageclickednumber = parseInt(pageclickednumber);
            $("#pager").pager({
                pagenumber: pageclickednumber,
                pagecount: pagecount,
                showcount: 3,
                buttonClickCallback: PageClick
            });
            searchAction(keyword, pageclickednumber - 1);
        }

        $("#mapPager").pager({pagenumber: page, pagecount: pagecount, showcount: 3, buttonClickCallback: PageClick});

        map.setViewport(points);
    };

    /**
     * 渲染列表模式
     * @param result
     * @param page
     */
    function renderList(res, page) {
        var content = res.contents;
        $('#listBoby').html('');

        if (content.length === 0) {
            $('#listBoby').append($('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;text-align:center;font-size:18px;" class="text-warning">抱歉，没有找到您想要的短租信息，请重新查询</p>'));
            return;
        }

        $.each(content, function (i, item) {
            $('#listBoby').append("<tr><td width='13%'><img src='" + item.mainimage + "' style='width:111px;height:83px;'/></td><td width='67%'><a href='###' target='_blank' onclick='Util.addLogCount()'>" + item.title + "<a/><br/>地址：" + item.address + "<br/>类型：" + Util.getLeaseNameByType(item.leasetype) + "</td><td width='20%'>" + item.dayprice + " <span style='color:red;'>元/晚</span></td></tr>");
            ;
        });

        /**
         * 分页
         */
        var pagecount = Math.ceil(res.total / 10);
        if (pagecount > 76) {
            pagecount = 76;
        }
        function PageClick(pageclickednumber) {
            pageclickednumber = parseInt(pageclickednumber);
            $("#pager").pager({
                pagenumber: pageclickednumber,
                pagecount: pagecount,
                showcount: 9,
                buttonClickCallback: PageClick
            });
            searchAction(keyword, pageclickednumber - 1);
        }

        $("#pager").pager({pagenumber: page, pagecount: pagecount, showcount: 9, buttonClickCallback: PageClick});
    }

    searchAction(keyword);


}();

$(document).ready(function () {

    var destinationMarker = new BMap.Marker(map.getBounds().getCenter(), {icon: icon});
    map.addOverlay(destinationMarker);
    destinationMarker.enableDragging();
    destinationMarker.addEventListener("dragend", function () {
        var p = destinationMarker.getPosition();
        console.log(p);
        queryInfo.location[0] = {lng: p.lng, lat: p.lat};
    });

    // Util.setMapHeight();
    //var bounds = map.getBounds();
    //alert(bounds.toSpan().lat + '==' + (bounds.getNorthEast().lat - bounds.getSouthWest().lat));
    //map.addOverlay(new BMap.Marker(bounds.getNorthEast(), {icon: icon}));
    //map.addOverlay(new BMap.Marker(bounds.getCenter(), {icon: icon}));

});

