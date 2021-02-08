/*
自动获取所有互助码并拼接
作者；Aerozb（Low）
https://github.com/Aerozb/JD_HongBaoDetails/blob/main/getAllCode.js
 */
const $ = new Env("互助码获取");
const JD_API_HOST = "https://api.m.jd.com/client.action";
const ACT_ID = 'dz2010100034444201',
    shareUuid = '57b32cc876dc4d78986fed10eb95d8be';
let cookiesArr = [],
    cookie = '',
    message;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//种豆得豆
var jdBean = '';jdBean1 = '';
//京东农场
var jdFruit = '';jdFruit1 = '';
//京东萌宠
var jdPet = '';jdPet1 = '';
//京喜工厂
var jxFactory = '';jxFactory1 = '';
//京东工厂
var jdFactory = '';jdFactory1 = '';
//京东赚赚
var jdZz = '';jdZz1 = '';
//疯狂的JOY
var jdJoy = '';jdJoy1 = '';
//京东领现金
var jdCash = ''; jdCash1 = '';
//京东图书
var jdBookShop = ''; jdBookShop1 = '';
//京喜农场
var jxNc = ''; jxNc1 = '';
//京东年兽
var jdnian = ''; jdnian1 = '';
//京东年兽PK
var jdnianpk = ''; jdnianpk1 = '';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = jsonParse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            
            await TotalBean();
            if (!$.isLogin) {
                continue
            }
            await getShareCode();
        }
    }
    jdBean = jdBean.substring(0, jdBean.lastIndexOf('&'));
    jdFruit = jdFruit.substring(0, jdFruit.lastIndexOf('&'));
    jdPet = jdPet.substring(0, jdPet.lastIndexOf('&'));
    jxFactory = jxFactory.substring(0, jxFactory.lastIndexOf('&'));
    jdFactory = jdFactory.substring(0, jdFactory.lastIndexOf('&'));
    if (jdZz != '') {
        jdZz = jdZz.substring(0, jdZz.lastIndexOf('&'));
    }
    jdJoy = jdJoy.substring(0, jdJoy.lastIndexOf('&'));
    jdCash = jdCash.substring(0, jdCash.lastIndexOf('&'));
    jdBookShop = jdBookShop.substring(0, jdBookShop.lastIndexOf('&'));
    jxNc = jxNc.substring(0, jxNc.lastIndexOf('&'));
    jdnian = jdnian.substring(0, jdnian.lastIndexOf('&'));
    jdnianpk = jdnian.substring(0, jdnianpk.lastIndexOf('&'));

/*
    //以下为@
    jdBean = jdBean.substring(0, jdBean.lastIndexOf('@'));
    jdFruit = jdFruit.substring(0, jdFruit.lastIndexOf('@'));
    jdPet = jdPet.substring(0, jdPet.lastIndexOf('@'));
    jxFactory = jxFactory.substring(0, jxFactory.lastIndexOf('@'));
    jdFactory = jdFactory.substring(0, jdFactory.lastIndexOf('@'));
    if (jdZz != '') {
        jdZz = jdZz.substring(0, jdZz.lastIndexOf('@'));
    }
    jdJoy = jdJoy.substring(0, jdJoy.lastIndexOf('@'));
    jdCash = jdCash.substring(0, jdCash.lastIndexOf('@'));
    jdBookShop = jdBookShop.substring(0, jdBookShop.lastIndexOf('@'));
    jxNc = jxNc.substring(0, jxNc.lastIndexOf('@'));
    jdnian = jdnian.substring(0, jdnian.lastIndexOf('@'));
    jdnianpk = jdnian.substring(0, jdnianpk.lastIndexOf('@'));

*/
    console.log('/submit_ddfactory_code ' + jdFactory);

    console.log('/submit_bean_code ' + jdBean);

    console.log('/submit_farm_code ' + jdFruit);

    console.log('/submit_pet_code ' + jdPet);

    console.log('/submit_jxfactory_code ' + jxFactory);

    console.log('/jdzz ' + jdZz);

    console.log('/jdcrazyjoy ' + jdJoy);

    console.log('/jdcash ' + jdCash);

    console.log('/jdnian ' + jdnian);
    
    console.log('/submit_temp_code nian_pk ' + jdnianpk);

    /*console.log('【京东口袋书店】' + jdBookShop);

    console.log('【京喜农场】' + jxNc);*/




    // console.log('【京东工厂】' + jdFactory);

    // console.log('【种豆得豆】' + jdBean);

    // console.log('【京东农场】' + jdFruit);

    // console.log('【京东萌宠】' + jdPet);

    // console.log('【京喜工厂】' + jxFactory);

    // console.log('【京东赚赚】' + jdZz);

    // console.log('【疯狂的JOY】' + jdJoy);

    // console.log('【京东口袋书店】' + jdBookShop);

    // console.log('【京喜农场】' + jxNc);
    /*var t1 = '&' + jdFruit;
    var t2 = '&' + jdPet;
    var t3 = '&' + jdBean;
    var t4 = '&' + jdFactory;
    var t5 = '&' + jxFactory;
    var t6 = '&' + jdZz;
    var t7 = '&' + jdJoy;
    var t8 = '&' + jdBookShop;
    var t9 = '&' + jxNc;
    for (let i = 1; i < cookiesArr.length; i++) {
        jdFruit = jdFruit + t1;
        jdPet = jdPet + t2;
        jdBean = jdBean + t3;
        jdFactory = jdFactory + t4;
        jxFactory = jxFactory + t5;
        jdZz = jdZz + t6;
        jdJoy = jdJoy + t7;
        jdBookShop = jdBookShop + t8;
        jxNc = jxNc + t9;
    }
    console.log('env.FRUITSHARECODES = ' + '\'' + jdFruit + '\'' + ';' + '\n');
    console.log('env.PETSHARECODES =' + '\'' + jdPet + '\'' + ';' + '\n');
    console.log('env.PLANT_BEAN_SHARECODES =' + '\'' + jdBean + '\'' + ';' + '\n');
    console.log('env.DDFACTORY_SHARECODES = ' + '\'' + jdFactory + '\'' + ';' + '\n');
    console.log('env.DREAM_FACTORY_SHARE_CODES =' + '\'' + jxFactory + '\'' + ';' + '\n');
    if (jdZz != '&&') {
        console.log('env.JDZZ_SHARECODES =' + '\'' + jdZz + '\'' + ';' + '\n');
    }
    console.log('env.JDJOY_SHARECODES =' + '\'' + jdJoy + '\'' + ';' + '\n');
    console.log('env.BOOKSHOP_SHARECODES =' + '\'' + jdBookShop + '\'' + ';' + '\n');
    console.log('env.JXNC_SHARECODES =' + '\'' + jxNc + '\'' + ';' + '\n');*/
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

function getJdFactory() {
    return new Promise(resolve => {
        $.post(
            taskPostUrl("jdfactory_getTaskDetail", {}, "jdfactory_getTaskDetail"),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`);
                        console.log(`$东东工厂 API请求失败，请检查网路重试`);
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.data.bizCode === 0) {
                                $.taskVos = data.data.result.taskVos; //任务列表
                                $.taskVos.map((item) => {
                                    if (item.taskType === 14) {
                                        jdFactory += item.assistTaskDetailVo.taskToken + '&';
                                    }
                                });
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            }
        );
    })
}

function getJxFactory() {
    const JX_API_HOST = "https://m.jingxi.com";

    function JXGC_taskurl(functionId, body = "") {
        return {
            url: `${JX_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}`,
            headers: {
                Cookie: cookie,
                Host: "m.jingxi.com",
                Accept: "*/*",
                Connection: "keep-alive",
                "User-Agent": "jdpingou;iPhone;3.14.4;14.0;ae75259f6ca8378672006fc41079cd8c90c53be8;network/wifi;model/iPhone10,2;appBuild/100351;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/62;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
                "Accept-Language": "zh-cn",
                Referer: "https://wqsd.jd.com/pingou/dream_factory/index.html",
                "Accept-Encoding": "gzip, deflate, br",
            },
        };
    }

    return new Promise(resolve => {
        $.get(
            JXGC_taskurl(
                "userinfo/GetUserInfo",
                `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=`
            ),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`);
                        console.log(`京喜工厂 API请求失败，请检查网路重试`);
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data["ret"] === 0) {
                                data = data["data"];
                                $.unActive = true; //标记是否开启了京喜活动或者选购了商品进行生产
                                $.encryptPin = "";
                                $.shelvesList = [];
                                if (data.factoryList && data.productionList) {
                                    const production = data.productionList[0];
                                    const factory = data.factoryList[0];
                                    const productionStage = data.productionStage;
                                    $.factoryId = factory.factoryId; //工厂ID
                                    $.productionId = production.productionId; //商品ID
                                    $.commodityDimId = production.commodityDimId;
                                    $.encryptPin = data.user.encryptPin;
                                    jxFactory += data.user.encryptPin + '&';
                                }
                            } else {
                                $.unActive = false; //标记是否开启了京喜活动或者选购了商品进行生产
                                if (!data.factoryList) {
                                    console.log(
                                        `【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动`
                                    );
                                } else if (data.factoryList && !data.productionList) {
                                    console.log(
                                        `【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购`
                                    );
                                }
                            }
                        } else {
                            console.log(`GetUserInfo异常：${JSON.stringify(data)}`);
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            }
        );
    })
}

function getJxNc() {
    const JXNC_API_HOST = "https://wq.jd.com/";

    function JXNC_taskurl(function_path, body) {
        return {
            url: `${JXNC_API_HOST}cubeactive/farm/${function_path}?${body}&farm_jstoken=&phoneid=&timestamp=&sceneval=2&g_login_type=1&_=${Date.now()}&g_ty=ls`,
            headers: {
                Cookie: cookie,
                Accept: `*/*`,
                Connection: `keep-alive`,
                Referer: `https://st.jingxi.com/pingou/dream_factory/index.html`,
                'Accept-Encoding': `gzip, deflate, br`,
                Host: `wq.jd.com`,
                'Accept-Language': `zh-cn`,
            },
        };
    }

    return new Promise(resolve => {
        $.get(
            JXNC_taskurl('query', `type=1`),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`);
                        console.log(`京喜农场 API请求失败，请检查网路重试`);
                    } else {
                        data = data.match(/try\{Query\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                        } else {
                            console.log(`京喜农场返回值解析异常：${JSON.stringify(data)}`);
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            }
        );
    })
}

function getJdPet() {
    const JDPet_API_HOST = "https://api.m.jd.com/client.action";

    function jdPet_Url(function_id, body = {}) {
        body["version"] = 2;
        body["channel"] = "app";
        return {
            url: `${JDPet_API_HOST}?functionId=${function_id}`,
            body: `body=${escape(
                JSON.stringify(body)
            )}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
            headers: {
                Cookie: cookie,
                "User-Agent": $.isNode() ?
                    process.env.JD_USER_AGENT ?
                        process.env.JD_USER_AGENT :
                        "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ?
                        $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                Host: "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
    }
    return new Promise(resolve => {
        $.post(jdPet_Url("initPetTown"), async (err, resp, data) => {
            try {
                if (err) {
                    console.log("东东萌宠: API查询请求失败 ‼️‼️");
                    console.log(JSON.stringify(err));
                    $.logErr(err);
                } else {
                    data = JSON.parse(data);

                    const initPetTownRes = data;

                    message = `【京东账号${$.index}】${$.nickName}`;
                    if (
                        initPetTownRes.code === "0" &&
                        initPetTownRes.resultCode === "0" &&
                        initPetTownRes.message === "success"
                    ) {
                        $.petInfo = initPetTownRes.result;
                        if ($.petInfo.userStatus === 0) {

                            return;
                        }

                        jdPet += `${$.petInfo.shareCode}` + '&';
                    } else if (initPetTownRes.code === "0") {
                        console.log(`初始化萌宠失败:  ${initPetTownRes.message}`);
                    } else {
                        console.log("shit");
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(data);
            }
        });
    })
}

function getJdCash() {
    function taskUrl(functionId, body = {}) {
        return {
            url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=CashRewardMiniH5Env&appid=9.1.0`,
            headers: {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
                'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
                'Accept-Language': 'zh-cn',
                'Accept-Encoding': 'gzip, deflate, br',
            }
        }
    }
    return new Promise((resolve) => {
        $.get(taskUrl("cash_mob_home", ), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.code === 0 && data.data.result) {
                            //console.log(`【账号${$.index}（${$.nickName || $.UserName}）领现金】${data.data.result.inviteCode}`);
                            jdCash += data.data.result.inviteCode + '&';
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

async function getJdZZ() {
    const JDZZ_API_HOST = "https://api.m.jd.com/client.action";

    function getUserInfo() {
        return new Promise(resolve => {
            $.get(taskZZUrl("interactIndex"), async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`)
                        console.log(`${$.name} API请求失败，请检查网路重试`)
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.data.shareTaskRes) {
                                //console.log(`【账号${$.index}（${$.nickName || $.UserName}）京东赚赚】${data.data.shareTaskRes.itemId}`);
                                jdZz += data.data.shareTaskRes.itemId + '&';
                            } else {
                                //console.log(`已满5人助力,暂时看不到您的京东赚赚好友助力码`)
                            }
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp)
                } finally {
                    resolve(data);
                }
            })
        })
    }

    function taskZZUrl(functionId, body = {}) {
        return {
            url: `${JDZZ_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
            headers: {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
                'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
                'Accept-Language': 'zh-cn',
                'Accept-Encoding': 'gzip, deflate, br',
            }
        }
    }

    await getUserInfo()
}
async function getPlantBean() {
    const JDplant_API_HOST = "https://api.m.jd.com/client.action";

    async function plantBeanIndex() {
        $.plantBeanIndexResult = await plant_request("plantBeanIndex"); //plantBeanIndexBody
    }

    function plant_request(function_id, body = {}) {
        return new Promise(async (resolve) => {
            $.post(plant_taskUrl(function_id, body), (err, resp, data) => {
                try {
                    if (err) {
                        console.log("种豆得豆: API查询请求失败 ‼️‼️");
                        console.log(`function_id:${function_id}`);
                        $.logErr(err);
                    } else {
                        data = JSON.parse(data);
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve(data);
                }
            });
        });
    }

    function plant_taskUrl(function_id, body) {
        body["version"] = "9.0.0.1";
        body["monitor_source"] = "plant_app_plant_index";
        body["monitor_refer"] = "";
        return {
            url: JDplant_API_HOST,
            body: `functionId=${function_id}&body=${escape(
                JSON.stringify(body)
            )}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
            headers: {
                Cookie: cookie,
                Host: "api.m.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                "User-Agent": $.isNode() ?
                    process.env.JD_USER_AGENT ?
                        process.env.JD_USER_AGENT :
                        "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ?
                        $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                "Accept-Language": "zh-Hans-CN;q=1,en-CN;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
    }

    function getParam(url, name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        const r = url.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    async function jdPlantBean() {
        await plantBeanIndex();
        // console.log(plantBeanIndexResult.data.taskList);
        if ($.plantBeanIndexResult.code === "0") {
            const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl;
            $.myPlantUuid = getParam(shareUrl, "plantUuid");
            jdBean += $.myPlantUuid + '&';
        } else {
            console.log(
                `种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`
            );
        }
    }

    await jdPlantBean();
}
async function getJDFruit() {
    async function initForFarm() {
        return new Promise((resolve) => {
            const option = {
                url: `${JD_API_HOST}?functionId=initForFarm`,
                body: `body=${escape(
                    JSON.stringify({version: 4})
                )}&appid=wh5&clientVersion=9.1.0`,
                headers: {
                    accept: "*/*",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    cookie: cookie,
                    origin: "https://home.m.jd.com",
                    pragma: "no-cache",
                    referer: "https://home.m.jd.com/myJd/newhome.action",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "User-Agent": $.isNode() ?
                        process.env.JD_USER_AGENT ?
                            process.env.JD_USER_AGENT :
                            "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ?
                            $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            };
            $.post(option, (err, resp, data) => {
                try {
                    if (err) {
                        console.log("东东农场: API查询请求失败 ‼️‼️");
                        console.log(JSON.stringify(err));
                        $.logErr(err);
                    } else {
                        if (safeGet(data)) {
                            $.farmInfo = JSON.parse(data);
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve();
                }
            });
        });
    }

    async function jdFruit1() {
        await initForFarm();
        if ($.farmInfo.farmUserPro) {
            jdFruit += `${$.farmInfo.farmUserPro.shareCode}` + '&';
        } else {

        }
    }

    await jdFruit1();
}
async function getJoy() {
    function taskUrl(functionId, body = '') {
        let t = Date.now().toString().substr(0, 10)
        let e = body || ""
        e = $.md5("aDvScBv$gGQvrXfva8dG!ZC@DA70Y%lX" + e + t)
        e = e + Number(t).toString(16)
        return {
            url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
            headers: {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
                'Accept-Language': 'zh-cn',
                'Referer': 'https://crazy-joy.jd.com/',
                'origin': 'https://crazy-joy.jd.com',
                'Accept-Encoding': 'gzip, deflate, br',
            }
        }
    }
    let body = {
        "paramData": {}
    }
    return new Promise(async resolve => {
        $.get(taskUrl('crazyJoy_user_gameState', JSON.stringify(body)), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.success && data.data && data.data.userInviteCode) {
                            jdJoy += data.data.userInviteCode + '&';
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getIsvToken() {
    return new Promise(resolve => {
        let body = 'body=%7B%22to%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%5C%2Fdingzhi%5C%2Fbook%5C%2Fdevelop%5C%2Factivity%3FactivityId%3Ddz2010100034444201%22%2C%22action%22%3A%22to%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&sign=f3eb9660e798c20372734baf63ab55f2&st=1610267023622&sv=111'
        $.post(jdUrl('genToken', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        $.isvToken = data['tokenKey']
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function jdUrl(functionId, body) {
    return {
        url: `https://api.m.jd.com/client.action?functionId=${functionId}`,
        body: body,
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
}

function getIsvToken2() {
    return new Promise(resolve => {
        let body = 'body=%7B%22url%22%3A%22https%3A%5C%2F%5C%2Flzdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&sign=6050f8b81f4ba562b357e49762a8f4b0&st=1610267024346&sv=121'
        $.post(jdUrl('isvObfuscator', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        $.token2 = data['token']
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function taskUrl(function_id, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com/${function_id}?${body}`,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/x.jd-school-island.v1+json',
            'Source': '02',
            'Accept-Language': 'zh-cn',
            'Content-Type': 'application/json;charset=utf-8',
            'Origin': 'https://lzdz-isv.isvjcloud.com',
            'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'Referer': `https://lzdz-isv.isvjcloud.com/dingzhi/book/develop/activity?activityId=${ACT_ID}`,
            'Cookie': `${cookie} IsvToken=${$.isvToken};`
        }
    }
}

function getActCk() {
    return new Promise(resolve => {
        $.get(taskUrl("dingzhi/book/develop/activity", `activityId=${ACT_ID}`), (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if ($.isNode())
                        for (let ck of resp['headers']['set-cookie']) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    else {
                        for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getActInfo() {
    return new Promise(resolve => {
        $.post(taskPostUrl1('dz/common/getSimpleActInfoVo', `activityId=${ACT_ID}`), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.result) {
                            $.shopId = data.data.shopId
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function taskPostUrl1(function_id, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com/${function_id}`,
        body: body,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/json',
            'Accept-Language': 'zh-cn',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://lzdz-isv.isvjcloud.com',
            'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'Referer': `https://lzdz-isv.isvjcloud.com/dingzhi/book/develop/activity?activityId=${ACT_ID}`,
            'Cookie': `${cookie} isvToken=${$.isvToken};`
        }
    }
}

function getToken() {
    return new Promise(resolve => {
        let body = `userId=${$.shopId}&token=${$.token2}&fromType=APP`
        $.post(taskPostUrl1('customer/getMyPing', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        $.token = data.data.secretPin;
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getUserInfo() {
    return new Promise(resolve => {
        let body = `pin=${encodeURIComponent($.token)}`
        $.post(taskPostUrl1('wxActionCommon/getUserInfo', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.data) {
                            $.pinImg = data.data.yunMidImageUrl;
                            $.nick = data.data.nickname;
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getActContent() {
    return new Promise(resolve => {
        let body = `activityId=${ACT_ID}&pin=${encodeURIComponent($.token)}&pinImg=${$.pinImg}&nick=${$.nick}&cjyxPin=&cjhyPin=&shareUuid=${shareUuid}`
        $.post(taskPostUrl1('dingzhi/book/develop/activityContent', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${err},${jsonParse(resp.body)['message']}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if (data.data) {
                            jdBookShop += data.data.actorUuid + '&';
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getJxnc() {
    return new Promise(async resolve => {
        $.get({
            url: `https://wq.jd.com/cubeactive/farm/query?type=1&farm_jstoken=''&phoneid=''&timestamp=''&sceneval=2&g_login_type=1&callback=whyour&_=${Date.now()}&g_ty=ls`,
            headers: {
                Cookie: cookie,
                Accept: `*/*`,
                Connection: `keep-alive`,
                Referer: `https://st.jingxi.com/pingou/dream_factory/index.html`,
                'Accept-Encoding': `gzip, deflate, br`,
                Host: `wq.jd.com`,
                'Accept-Language': `zh-cn`,
            },
            timeout: 10000,
        }, async (err, resp, data) => {
            try {
                const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
                const {
                    detail,
                    msg,
                    task = [],
                    retmsg,
                    ...other
                } = JSON.parse(res);
                jxNc += other.smp + '&';
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(true);
            }
        });
    });
}


async function getjdNian() {
    try {
      await getHomeData()
      if(!$.secretp) return
      let hour = new Date().getUTCHours()
      if (1<=hour && hour<=18) {
        // 北京时间9点-22点做pk任务
        $.hasGroup = false
        await pkTaskDetail()
        if ($.hasGroup) await pkInfo()
    
      }
    
      await getTaskList()

    } catch (e) {
      $.logErr(e)
    }
  }
  function getHomeData(info=false) {
    return new Promise((resolve) => {
      $.post(taskPostUrl('nian_getHomeData'), async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            data = JSON.parse(data);
            if (data && data.data['bizCode'] === 0) {
              $.userInfo = data.data.result.homeMainInfo
              $.secretp = $.userInfo.secretp;
              
             
            }
           
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      })
    })
  }

  function pkTaskDetail() {
    return new Promise(resolve => {
      $.post(taskPostUrl("nian_pk_getTaskDetail", {}, "nian_pk_getTaskDetail"), async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if(data.code===0 && data.data && data.data.bizCode===0){
                await $.wait(2000)
                $.hasGroup = true
                for(let item of data.data.result.taskVos){
                  if (item.taskType === 3 || item.taskType === 26) {
                    if(item.shoppingActivityVos) {
                      if (item.status === 1) {
                        console.log(`准备做此任务：${item.taskName}`)
                        for (let task of item.shoppingActivityVos) {
                          if (task.status === 1) {
                            await pkCollectScore(item.taskId, task.itemId);
                          }
                          await $.wait(3000)
                        }
                      } else if (item.status === 2) {
                        console.log(`${item.taskName}已做完`)
                      }
                    }
                  }
                }
              }
              
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }

  function pkInfo() {
    return new Promise(resolve => {
      $.post(taskPostUrl("nian_pk_getHomeData", {}, "nian_pk_getHomeData"), async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            $.group = true
            if (safeGet(data)) {
              data = JSON.parse(data);
              if(data.code===0 && data.data && data.data.bizCode===0){
                //console.log(`\n您的好友PK助力码为${data.data.result.groupInfo.groupAssistInviteId}\n`)
                jdnianpk += data.data.result.groupInfo.groupAssistInviteId + '&';
                //let info = data.data.result.groupPkInfo
                //console.log(`当前关卡：${info.dayAward}元红包，完成进度 ${info.dayTotalValue}/${info.dayTargetSell}`)
              }
              else{
                $.group = false
                console.log(`获取组队信息失败，请检查`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
  function getTaskList(body={}) {
    return new Promise(resolve => {
      $.post(taskPostUrl("nian_getTaskDetail", body, "nian_getTaskDetail"), async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.data.bizCode === 0) {
                if(JSON.stringify(body)==="{}") {
                  $.taskVos = data.data.result.taskVos;//任务列表
                  //console.log(`您的好友助力码为${data.data.result.inviteId}`)
                  jdnian += data.data.result.inviteId + '&';
                 }
                // $.userInfo = data.data.result.userInfo;
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
  

async function getShareCode() {
    await getjdNian()
    
    await getJdFactory();
    await getJxFactory();
    await getJxNc();
    await getJdPet();
    await getPlantBean();
    await getJDFruit();
    await getJdZZ();
    await getJoy();
    await getJdCash();

    //口袋书店
    await getIsvToken();
    await getIsvToken2();
    await getActCk();
    await getActInfo();
    await getToken();
    await getUserInfo();
    await getActContent();

    await getJxnc();
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        $.nickName = data['base'].nickname;
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function taskPostUrl(function_id, body = {}, function_id2) {
    let url = `${JD_API_HOST}`;
    if (function_id2) {
        url += `?functionId=${function_id2}`;
    }
    return {
        url,
        body: `functionId=${function_id}&body=${escape(
            JSON.stringify(body)
        )}&client=wh5&clientVersion=9.1.0`,
        headers: {
            Cookie: cookie,
            origin: "https://h5.m.jd.com",
            referer: "https://h5.m.jd.com/",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": $.isNode() ?
                process.env.JD_USER_AGENT ?
                    process.env.JD_USER_AGENT :
                    "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0" : $.getdata("JDUA") ?
                    $.getdata("JDUA") : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
        },
    };
}

function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg(str);
            return [];
        }
    }
}

// prettier-ignore
! function (n) {
    "use strict";

    function t(n, t) {
        var r = (65535 & n) + (65535 & t);
        return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
    }

    function r(n, t) {
        return n << t | n >>> 32 - t
    }

    function e(n, e, o, u, c, f) {
        return t(r(t(t(e, n), t(u, f)), c), o)
    }

    function o(n, t, r, o, u, c, f) {
        return e(t & r | ~t & o, n, t, u, c, f)
    }

    function u(n, t, r, o, u, c, f) {
        return e(t & o | r & ~o, n, t, u, c, f)
    }

    function c(n, t, r, o, u, c, f) {
        return e(t ^ r ^ o, n, t, u, c, f)
    }

    function f(n, t, r, o, u, c, f) {
        return e(r ^ (t | ~o), n, t, u, c, f)
    }

    function i(n, r) {
        n[r >> 5] |= 128 << r % 32,
            n[14 + (r + 64 >>> 9 << 4)] = r;
        var e, i, a, d, h, l = 1732584193,
            g = -271733879,
            v = -1732584194,
            m = 271733878;
        for (e = 0; e < n.length; e += 16)
            i = l,
                a = g,
                d = v,
                h = m,
                g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551),
                l = t(l, i),
                g = t(g, a),
                v = t(v, d),
                m = t(m, h);
        return [l, g, v, m]
    }

    function a(n) {
        var t, r = "",
            e = 32 * n.length;
        for (t = 0; t < e; t += 8)
            r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
        return r
    }

    function d(n) {
        var t, r = [];
        for (r[(n.length >> 2) - 1] = void 0,
                 t = 0; t < r.length; t += 1)
            r[t] = 0;
        var e = 8 * n.length;
        for (t = 0; t < e; t += 8)
            r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
        return r
    }

    function h(n) {
        return a(i(d(n), 8 * n.length))
    }

    function l(n, t) {
        var r, e, o = d(n),
            u = [],
            c = [];
        for (u[15] = c[15] = void 0,
             o.length > 16 && (o = i(o, 8 * n.length)),
                 r = 0; r < 16; r += 1)
            u[r] = 909522486 ^ o[r],
                c[r] = 1549556828 ^ o[r];
        return e = i(u.concat(d(t)), 512 + 8 * t.length),
            a(i(c.concat(e), 640))
    }

    function g(n) {
        var t, r, e = "";
        for (r = 0; r < n.length; r += 1)
            t = n.charCodeAt(r),
                e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
        return e
    }

    function v(n) {
        return unescape(encodeURIComponent(n))
    }

    function m(n) {
        return h(v(n))
    }

    function p(n) {
        return g(m(n))
    }

    function s(n, t) {
        return l(v(n), v(t))
    }

    function C(n, t) {
        return g(s(n, t))
    }

    function A(n, t, r) {
        return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n)
    }

    $.md5 = A
}(this);

// prettier-ignore
function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        Accept: "*/*"
                    }
                };
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => {
                const {
                    message: s,
                    response: i
                } = t;
                e(s, i, i && i.body)
            }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                "X-Surge-Skip-Scripting": !1
            })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                hints: !1
            })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}