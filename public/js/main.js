var map = new BMap.Map("map");                              // 创建Map实例
!function () { //初始化地图模块相关代码
    map.enableScrollWheelZoom();                            // 启用滚轮放大缩小 
    map.enableContinuousZoom();                             // 启用地图惯性拖拽，默认禁用
    map.enableInertialDragging();                           // 启用连续缩放效果，默认禁用。
    map.addControl(new BMap.NavigationControl());           // 添加平移缩放控件
    map.addControl(new BMap.ScaleControl());                // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());          // 添加缩略地图控件
    map.addControl(new BMap.MapTypeControl());              // 添加地图类型控件
    map.centerAndZoom(new BMap.Point(116.418261, 39.921984), 15); // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("北京");                             //由于有3D图，需要设置城市哦
}();

/**
 * 一次查询需要用户提供的信息
 * @type {{location: {lng: number, lat: number}[], mode: string, prefer: {cater: Array, entertainment: Array, sport: Array}}}
 */
var queryInfo = {
    location: [
        {lng: 116.351633, lat: 40.004179}
    ], // 可包含多个，格式为：{"lng" : 116, "lat" : 40}
    mode: "transit",   // 驾车为"driving"，公交为"transit"，默认值："transit"
    prefer: {
        cater: [],
        entertainment: [],
        sport: []
    }
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
        }
        return lease[type];
    },
    /**
     * 设置Map容器的高度
     */
    setMapHeight: function () {
        var mapBoxHeight = $(window).height() - $('#pageHeader').height() - $('#pageMiddle').height() - 38;
        $('#mapBox').css({height: mapBoxHeight + 'px'});
    },
    /**
     * 获取坐标点point对于查询条件的相关评估数据
     * @param point 待评分点坐标，例如{'lng': 116.351633, 'lat': 40.004179}
     * @param mQueryInfo 一个queryInfo对象
     */
    collectInfoOfPoint: function (point, mQueryInfo) {

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

                /*$.getJSON('/search/nearby', {
                    type: key,
                    keyword: encodeURIComponent(keyword),
                    location: '40.004179,116.351633',
                    radius: 1000
                }, function (data) {
                    if (data.status === BMAP_STATUS_SUCCESS) {
                        console.log(data);
                        alert("分数:" + data.score);
                    } else {
                        alert("ERROR: " + data.message);
                    }
                }).fail(function () {
                    alert("nearby search service error!");
                });*/

            }
        }

        $.getJSON('/evaluate', mQueryInfo, function (data) {
            if (data.status === 0) {
                console.log(data);
                alert("分数:" + data.score);
            } else {
                alert("ERROR: " + data.message);
            }
        }).fail(function () {
            alert("nearby search service error!");
        });
    }
}

var hotSpots = [
    {"lng": 116.418261, "lat": 39.921984, "count": 50},
    {"lng": 116.423332, "lat": 39.916532, "count": 51},
    {"lng": 116.419787, "lat": 39.930658, "count": 15},
    {"lng": 116.418455, "lat": 39.920921, "count": 40},
    {"lng": 116.418843, "lat": 39.915516, "count": 100},
    {"lng": 116.42546, "lat": 39.918503, "count": 6},
    {"lng": 116.423289, "lat": 39.919989, "count": 18},
    {"lng": 116.418162, "lat": 39.915051, "count": 80},
    {"lng": 116.422039, "lat": 39.91782, "count": 11},
    {"lng": 116.41387, "lat": 39.917253, "count": 7},
    {"lng": 116.41773, "lat": 39.919426, "count": 42},
    {"lng": 116.421107, "lat": 39.916445, "count": 4},
    {"lng": 116.417521, "lat": 39.917943, "count": 27},
    {"lng": 116.419812, "lat": 39.920836, "count": 23},
    {"lng": 116.420682, "lat": 39.91463, "count": 60},
    {"lng": 116.415424, "lat": 39.924675, "count": 8},
    {"lng": 116.419242, "lat": 39.914509, "count": 15},
    {"lng": 116.422766, "lat": 39.921408, "count": 25},
    {"lng": 116.421674, "lat": 39.924396, "count": 21},
    {"lng": 116.427268, "lat": 39.92267, "count": 1},
    {"lng": 116.417721, "lat": 39.920034, "count": 51},
    {"lng": 116.412456, "lat": 39.92667, "count": 7},
    {"lng": 116.420432, "lat": 39.919114, "count": 11},
    {"lng": 116.425013, "lat": 39.921611, "count": 35},
    {"lng": 116.418733, "lat": 39.931037, "count": 22},
    {"lng": 116.419336, "lat": 39.931134, "count": 4},
    {"lng": 116.413557, "lat": 39.923254, "count": 5},
    {"lng": 116.418367, "lat": 39.92943, "count": 3},
    {"lng": 116.424312, "lat": 39.919621, "count": 100},
    {"lng": 116.423874, "lat": 39.919447, "count": 87},
    {"lng": 116.424225, "lat": 39.923091, "count": 32},
    {"lng": 116.417801, "lat": 39.921854, "count": 44},
    {"lng": 116.417129, "lat": 39.928227, "count": 21},
    {"lng": 116.426426, "lat": 39.922286, "count": 80},
    {"lng": 116.421597, "lat": 39.91948, "count": 32},
    {"lng": 116.423895, "lat": 39.920787, "count": 26},
    {"lng": 116.423563, "lat": 39.921197, "count": 17},
    {"lng": 116.417982, "lat": 39.922547, "count": 17},
    {"lng": 116.426126, "lat": 39.921938, "count": 25},
    {"lng": 116.42326, "lat": 39.915782, "count": 100},
    {"lng": 116.419239, "lat": 39.916759, "count": 39},
    {"lng": 116.417185, "lat": 39.929123, "count": 11},
    {"lng": 116.417237, "lat": 39.927518, "count": 9},
    {"lng": 116.417784, "lat": 39.915754, "count": 47},
    {"lng": 116.420193, "lat": 39.917061, "count": 52},
    {"lng": 116.422735, "lat": 39.915619, "count": 100},
    {"lng": 116.418495, "lat": 39.915958, "count": 46},
    {"lng": 116.416292, "lat": 39.931166, "count": 9},
    {"lng": 116.419916, "lat": 39.924055, "count": 8},
    {"lng": 116.42189, "lat": 39.921308, "count": 11},
    {"lng": 116.413765, "lat": 39.929376, "count": 3},
    {"lng": 116.418232, "lat": 39.920348, "count": 50},
    {"lng": 116.417554, "lat": 39.930511, "count": 15},
    {"lng": 116.418568, "lat": 39.918161, "count": 23},
    {"lng": 116.413461, "lat": 39.926306, "count": 3},
    {"lng": 116.42232, "lat": 39.92161, "count": 13},
    {"lng": 116.4174, "lat": 39.928616, "count": 6},
    {"lng": 116.424679, "lat": 39.915499, "count": 21},
    {"lng": 116.42171, "lat": 39.915738, "count": 29},
    {"lng": 116.417836, "lat": 39.916998, "count": 99},
    {"lng": 116.420755, "lat": 39.928001, "count": 10},
    {"lng": 116.414077, "lat": 39.930655, "count": 14},
    {"lng": 116.426092, "lat": 39.922995, "count": 16},
    {"lng": 116.41535, "lat": 39.931054, "count": 15},
    {"lng": 116.413022, "lat": 39.921895, "count": 13},
    {"lng": 116.415551, "lat": 39.913373, "count": 17},
    {"lng": 116.421191, "lat": 39.926572, "count": 1},
    {"lng": 116.419612, "lat": 39.917119, "count": 9},
    {"lng": 116.418237, "lat": 39.921337, "count": 54},
    {"lng": 116.423776, "lat": 39.921919, "count": 26},
    {"lng": 116.417694, "lat": 39.92536, "count": 17},
    {"lng": 116.415377, "lat": 39.914137, "count": 19},
    {"lng": 116.417434, "lat": 39.914394, "count": 43},
    {"lng": 116.42588, "lat": 39.922622, "count": 27},
    {"lng": 116.418345, "lat": 39.919467, "count": 8},
    {"lng": 116.426883, "lat": 39.917171, "count": 3},
    {"lng": 116.423877, "lat": 39.916659, "count": 34},
    {"lng": 116.415712, "lat": 39.915613, "count": 14},
    {"lng": 116.419869, "lat": 39.931416, "count": 12},
    {"lng": 116.416956, "lat": 39.925377, "count": 11},
    {"lng": 116.42066, "lat": 39.925017, "count": 38},
    {"lng": 116.416244, "lat": 39.920215, "count": 91},
    {"lng": 116.41929, "lat": 39.915908, "count": 54},
    {"lng": 116.422116, "lat": 39.919658, "count": 21},
    {"lng": 116.4183, "lat": 39.925015, "count": 15},
    {"lng": 116.421969, "lat": 39.913527, "count": 3},
    {"lng": 116.422936, "lat": 39.921854, "count": 24},
    {"lng": 116.41905, "lat": 39.929217, "count": 12},
    {"lng": 116.424579, "lat": 39.914987, "count": 57},
    {"lng": 116.42076, "lat": 39.915251, "count": 70},
    {"lng": 116.425867, "lat": 39.918989, "count": 8}
];

if (!isSupportCanvas()) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
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
var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 15});

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
    ]

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
        for (var key in queryInfo.prefer) {
            queryInfo.prefer[key] = [];
            $('#' + key + ' li input').each(function () {
                if ($(this).is(':checked')) {
                    queryInfo.prefer[key].push($(this).val());
                }
            });
        }

        Util.collectInfoOfPoint({lng: 116.323026, lat: 39.990074}, queryInfo);

//        searchAction(keyword);
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
            ;
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
            $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pagecount, showcount: 3, buttonClickCallback: PageClick });
            searchAction(keyword, pageclickednumber - 1);
        }

        $("#mapPager").pager({ pagenumber: page, pagecount: pagecount, showcount: 3, buttonClickCallback: PageClick });

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

        if (content.length == 0) {
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
            $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pagecount, showcount: 9, buttonClickCallback: PageClick });
            searchAction(keyword, pageclickednumber - 1);
        }

        $("#pager").pager({ pagenumber: page, pagecount: pagecount, showcount: 9, buttonClickCallback: PageClick });
    }

    searchAction(keyword);
}();

$(document).ready(function () {
    // Util.setMapHeight();
});
