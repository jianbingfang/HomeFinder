/**
 * Created by jianbingfang on 2014/10/26.
 */

var evaluate = function () {

    // 测试返回0-100的随机分数
    var score = Math.floor(Math.random() * 100);

    return score;
}

module.exports.evaluate = evaluate;