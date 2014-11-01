'use strict';
/**
 * Created by jianbingfang on 2014/10/26.
 */

var evaluate = function (data) {
    // 测试返回0-100的随机分数

//    var score = -400 * D_JY - 56.9 * D_GZ + 800 * CZ - 42.3 * D_QC - 69.1 * D_GY - 133 *
//        D_DT;

    console.log('evaluating score of ' + data.toString());
    var coefficients = [800, -400, -59.6, -42.3, -69.1, -133];

    var score = 0;
    if (coefficients.length === data.length) {
        for (var i = 0; i < data.length; i++) {
            score += coefficients[i] * data[i];
        }
    }

    return score;
};

module.exports.evaluate = evaluate;