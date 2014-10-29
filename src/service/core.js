'use strict';
/**
 * Created by jianbingfang on 2014/10/26.
 */

var evaluate = function () {
    // 测试返回0-100的随机分数

//    var score = -400 * D_JY - 56.9 * D_GZ + 800 * CZ - 42.3 * D_QC - 69.1 * D_GY - 133 *
//        D_DT;

    var score = Math.floor(Math.random() * 100);

    return score;
};

module.exports.evaluate = evaluate;