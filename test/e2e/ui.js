/**
 * Created by xiaoxiaosu on 17/7/19.
 */

var request = require('superagent')
var Base64 = require('../base64.min').Base64

var jsonfile = require('jsonfile')
var _ = require("underscore")
var url = 'https://api.miui.security.xiaomi.com/views/netassist/productlist.html'

var tipJson = [

    {"value": "recommend", "text": "推荐"},
    {"value": "hotsell", "text": "热销"},
    {"value": "discount", "text": "折扣"},
    {"value": "cuxiao", "text": "促销"},
    {"value": "reduce", "text": "减价"},
    {"value": "buygive", "text": "买送"},
    {"value": "reduce3", "text": "减价-3"},
    {"value": "reduce5", "text": "减价-5"},
    {"value": "reduce20", "text": "减价-20"},
    {"value": "give20m", "text": "送20M"},
    {"value": "give30m", "text": "送30M"},
    {"value": "give50m", "text": "送50M"},
    {"value": "give70m", "text": "送70M"},
    {"value": "give100m", "text": "送100M"},
    {"value": "give150m", "text": "送150M"},
    {"value": "give500m", "text": "送500M"},
    {"value": "give5Y", "text": "送5元"},
    {"value": "give10Y", "text": "送10元"},
    {"value": "give250m", "text": "送250M"},
    {"value": "give1024m", "text": "送1GB"}
]


var filter = function (data,key) {
    var pro = {}
    var scope = data.productScopeList,
        type = data.productTypeList,
        back = data.productBackward,
        tips = data.productTipList;

    var getTip = function (scope,type) {
        var o = tips.find(function (obj) {
            return obj.productScope == scope && obj.productType == type
        })
        if(o){
            return o.productTip
        }else {
            return ''
        }
    }

    var getScope = function (id) {
        var o = scope.find(function (obj) {
            return obj.productScope == id
        })
        if(o){
            return o.scopeName
        }else {
            return ''
        }
    }

    var getType = function (id) {
        var o = scope.find(function (obj) {
            return obj.productType == id
        })
        if(o){
            return o.typeName
        }else {
            return ''
        }
    }

    var getCorner = function (value) {
        var o = tipJson.find(function (obj) {
            return obj.value == value
        })
        if(o){
            return o.text
        }else {
            return ''
        }
    }

    for(var i=0;i<back.length;i++) {
        var k = back[i][key]

        if (back[i].productType == 10) {
            pro['米粉卡'] = {
                product : Object.assign({},back[i],{
                    unit: back[i].flowTotalUnit.replace(/B/,''),
                    tip: getTip(back[i].productScope, back[i].productType),
                    scope: getScope(back[i].productScope),
                    name: '米粉卡',
                    activityUrl:back[i].activityUrl,
                }),
                productArray:[
                    Object.assign({},back[i],{
                        unit: back[i].flowTotalUnit.replace(/B/,''),
                        tip: getTip(back[i].productScope, back[i].productType),
                        scope: getScope(back[i].productScope),
                        name: '米粉卡',
                        activityUrl:back[i].activityUrl
                    })
                ]
            }
            continue
        }


        if (pro[k]) {
            back[i] = Object.assign({}, back[i], {
                unit: back[i].flowTotalUnit.replace(/B/,''),
                tip: getTip(back[i].productScope, back[i].productType),
                scope: getScope(back[i].productScope),
                corner:getCorner(back[i].cornerTip)
            })
            pro[k].productArray.push(back[i])

            if(getCorner(back[i].cornerTip)){
                pro[k].product.corner = getCorner(back[i].cornerTip)
            }

        } else {


            pro[k] = {
                product: {
                    unit: back[i].flowTotalUnit.replace(/B/,''),
                    tip: getTip(back[i].productScope, back[i].productType),
                    scope: getScope(back[i].productScope),

                },
                productArray: [Object.assign({}, back[i], {
                    unit: back[i].flowTotalUnit.replace(/B/,''),
                    tip: getTip(back[i].productScope, back[i].productType),
                    scope: getScope(back[i].productScope),
                    corner:getCorner(back[i].cornerTip)
                })]
            }

            if(getCorner(back[i].cornerTip)){
                pro[k].product.corner = getCorner(back[i].cornerTip)
            }

        }

    }


    for (var k in pro) {
        pro[k].productArray.sort(function (a, b) {

            if(a.corner){
                return 0
            }else if(b.corner){
                return 1
            }else {
                if( a.retailPrice >b.retailPrice){
                    return 1
                }else {
                    return -1
                }
            }
            return 0
        })
        pro[k].product.price = pro[k].productArray[0].retailPrice
    }
    return pro
}

module.exports = {
    before: function (browser, done) {

        var obj = {
            "slotid": "",
            "spType": "CMCC",
            "zipCode": "10",
            "phonenum": "13683360717",
            "xiaomiId": null,
            "src": "",
            "versionCode": "40825",
            "spName": "移动",
            "zipName": "北京",
            "uid": "86cef2268446c19b6ea830572c4a0a6e",
            "isOperaSupported": "false",
            "zipCodeOpera": "10",
            "spTypeOpera": "CMCC"
        }

        var url = 'http://api.miui.security.xiaomi.com/netassist/floworderunity/productlist'
        request
            .get(url)
            .query({param:Base64.encode(JSON.stringify(obj))})
            .end(function (err, res) {
                jsonfile.writeFileSync('./productlist.json',res.body,{spaces:4})
                browser.globals.product = res.body
                done()
            })
    },

    '13683360717': function (browser) {
        var productListUrl = browser.globals.productListUrl;
        var data = browser.globals.product


        var clear_data = filter(data,'flowTotalUnit')
        jsonfile.writeFileSync('./back.json',clear_data,{spaces:4})

        var keys = _.keys(clear_data)

        browser.url(url)
            .waitForElementVisible('body', 100)
            .setValue('.phonenum-box',13683360717)
            .pause(3000)
            .elements('css selector','.product-list-common li.product-common',function (results) {

                browser.verify.equal(keys.length,results.value.length,'界面上的产品数量和服务器的产品数量相等都是'+keys.length)

                var run = function (i) {




                    browser
                        .click('.product-list-common >.product-common:nth-child('+(i+1)+')').pause(1000)
                        //点击当前这一项，是否被添加上了active样式
                        .verify.cssClassPresent('.product-list-common >.product-common:nth-child('+(i+1)+') >a','active','点击第'+(i+1)+'个产品'+keys[i]+'后添加上了点击态')
                        .verify.containsText('.product-list-common >.product-common:nth-child('+(i+1)+') >a >.product-name',clear_data[keys[i]].product.unit,'第'+(i+1)+'个产品'+keys[i]+'的名字和服务器一致都是'+clear_data[keys[i]].product.unit)
                        .verify.containsText('.product-list-common >.product-common:nth-child('+(i+1)+') >a .price',(clear_data[keys[i]].product.price/100).toFixed(2),'第'+(i+1)+'个产品'+keys[i]+'的价格和服务器一致都是'+(clear_data[keys[i]].product.price/100).toFixed(2))
                        .elements('css selector','.product-sub-list >ul >li',function (results) {
                            browser.verify.equal(clear_data[keys[i]].productArray.length,results.value.length,'第'+(i+1)+'个产品的子类产品和服务器一致都是'+results.value.length)
                            var productArray = clear_data[keys[i]].productArray
                            for(var j=0;j<productArray.length;j++){
                                browser.verify.containsText('.product-sub-list >ul >li:nth-child('+(j+1)+') .price-content .price',(productArray[j].retailPrice/100).toFixed(2),
                                    '第'+(i+1)+'个产品'+keys[i]+'的第'+(j+1)+'子产品的价格和服务器一致都是'+(productArray[j].retailPrice/100).toFixed(2)
                                )
                                browser.verify.containsText('.product-sub-list >ul >li:nth-child('+(j+1)+') .message .place',productArray[j].scope,
                                    '第'+(i+1)+'个产品'+keys[i]+'的第'+(j+1)+'子产品的区域和服务器一致都是'+productArray[j].scope
                                )
                                browser.verify.containsText('.product-sub-list >ul >li:nth-child('+(j+1)+') .message .info',productArray[j].tip,
                                    '第'+(i+1)+'个产品'+keys[i]+'的第'+(j+1)+'子产品的提示文案和服务器一致都是'+productArray[j].tip
                                )


                                if(productArray[j].corner){
                                    browser.verify.containsText('.product-sub-list >ul >li:nth-child('+(j+1)+') .message .tip',productArray[j].corner,
                                        '第'+(i+1)+'个产品'+keys[i]+'的第'+(j+1)+'子产品的优惠信息和服务器一致都是'+productArray[j].corner
                                    )
                                }
                            }

                            if(clear_data[keys[i]].product.corner){
                                 browser.verify.containsText('.product-list-common >.product-common:nth-child('+(i+1)+') >a >.tip',clear_data[keys[i]].product.corner,
                                     '第'+(i+1)+'个产品的优惠角标与服务器一直都是'+clear_data[keys[i]].product.corner)
                            }


                            i++

                            if(i<keys.length-1){
                                run(i)
                            }else {
                                browser
                                    .click('.product-list-common >.product-common:nth-child('+(i+1)+')').pause(1000)
                                    .verify.cssClassPresent('.product-list-common >.product-common:nth-child('+(i+1)+') >a','active','米粉卡产品添加上了点击态')
                                    .verify.containsText('.product-list-common >.product-common:nth-child('+(i+1)+') >a >.product-name','米粉卡','米粉卡产品标题正确')
                                    .verify.containsText('.product-list-common >.product-common:nth-child('+(i+1)+') >a .price','首月免费','米粉卡产品副标题正确')
                                    .verify.elementNotPresent('.product-sub-list','米粉卡产品出现时不会出现子产品列表')
                                    .end()
                            }
                        })
                }
                //
                run(0)

            })
    }
};