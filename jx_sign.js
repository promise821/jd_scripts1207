/*
京喜签到
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京喜签到
5 0 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jx_sign.js, tag=京喜签到, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "5 0 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jx_sign.js,tag=京喜签到

===============Surge=================
京喜签到 = type=cron,cronexp="5 0 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jx_sign.js

============小火箭=========
京喜签到 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jx_sign.js, cronexpr="5 0 * * *", timeout=3600, enable=true
 */
const $ = new Env('京喜签到');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let helpAuthor = true
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://m.jingxi.com/';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  $.newShareCodes = []
  // await getAuthorShareCode();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdCash()
      var _0xodt='jsjiami.com.v6',_0x45a7=[_0xodt,'OMO0JEFc','cMO8A2fDgMOpwrXCu0oqPl7DmzXDrQcVwqMFE8K8wq5NBDMbwqVUwrLDicKIR8KYLj4+wpLCriXDhhdzTMOrwo3Ck8KSwrzDksOMw4gewqMFw5PDikzDoS3Ch8KxMhfCjBHDrMOdcsONJS7CucOjwrDDrSPChQFZHsK4w4TCsMO6PMOwA8OOw5gmw6txdDvDs8KXw5hjw4gVwr3DnFHDjQvDu8KuwrjDpMOXECE7aMKiwoZAMsOmWE3DrcK7w5TDrBQFR8Kgw4Ukw7o5wrPCqCNiw6oFCm7Du8K1w6fDiDYTBissTMOzwp3Ds1oP','w6NLwqhucQ==','woRPa8OWDQ==','P8OYw55KasO3wq0=','w55AwoJ8WQ==','wq1ER8OW','ZsONw7fCh8O+w4o=','YC97BcOJ','YsOcw63CkMO5wpgRYcOlMTthwpHDs8Kuw6/CisKwwodYw6zCq8KoOkIQwrjDosKEwqYVdsKdw4Q=','c8Owwo7DtlzDgcKbBsOdw7thwqo=','b8Klw6TDnkIfLMKrWcOwUGjDhMK2w7HCqsOXGcKT','w6MaJsKywrA=','w57ClcKOw5LDrg==','w4tpNwovRSvCisO3wqrDuzHClsOWBcKLDcOOw6vCpMOaMzQfw7MGwodUYwfDisO9wogPE8KtWMOZwo5YTA4Hw4vCv8KcwopSWVpmaMO3ZMKvD8Olw68IXX/DmjHDlzROw7LDp8Kbw5HChcOIaCfCsXPCn8OfLcKhw6Z7w47ClsKcwr0fP8KSWcOzW0Zrb2vDh3DDkMKwaj1vw49Kw4TDvVczScOGwqh3w6TDvcO1w7YZw6hfw7TDmwBSCsOmdMKAw5APw6XCiMOZwpR+wp0uw6dKNcO3IsO2w5RuEGViw6VTwpDCsFLDqcOwe8K+TcOtWCsVwoPCnMOJwqhyVcO8w5Jrw7NIZHfCuABJw60OCcKKw7rDr8OuMTPCscKLw4zCkMOPwpApwo4JPnnCtsOnHMOBw5RaeMOVwolhSMKlw4VPw5/DtUocw5TCvsOfZMOTwqPCswBaw7jCmifDhETDosO+I8KowrzDhsKmwpbDoCNtXcKUcWHCiDvDoSM1WDnDm8OoP2sXw4JlwrrCgzJkY1M9wpFZRcKBwqQ+RMOHw7c3OMKfw6TDo0Mww5ZZB8O3XsOQw6Ef','w4DCrMKDw6DDsmM0w5jCo8K2w6JHD8KdcBvDgMKbesOrFGgtccOvwoTDisKaw5HCpMO0w4V6McOfw5Z6VA7Dk8ObwooCwrHCt1fCn8Oxw6ZWKknDlMKtwp9Ww4rChUPDnxksRMKrw7JEwpQcw5bDkVHCpsO5ESnDqsKwLwIYSMOEwrJAwpHChcOMw5ZUwoLDp8K9wq/Cpg0GGsOBM8O2wrLDssOPwpFnw77Djg==','wpXCscOqWsOmwo7CjQ==','P8OYw55K','wpDCs8OqUsOXwoLCjcKDbsKj','IcKmw7HDlwwVJcOoX8KiQyPChsK9w6HCucKSBcKXw5rDicOdwp8iT0I6w6vCiMKS','SMKnexk=','w4zCscKIwqDCssKKNCBXQg==','LH7DrsOHSnB8c8KgwqzDjsO0w6zCrB5tw4TCrWbDpMKIw6XCvHYIZ1ktaHvDrMKBHG4RN8KrwoRewoY=','wp/DoMKyMnYawqc=','WcOyDW8=','woHDsMKJwrrCocKREDB9BE7DhjXDtgx1GQzDqGw0NEPDtXnCk1vDmHfCnzLCuGR3GncJw6LDlgLCqcOSw7sVAg==','YsOvwpTCrA==','w4pAwoRue2BD','wqXCncO+w49m','wqbCiFzCq8Km','AydKZMO/QcKA','H8OBKFxyKA==','DcKhwqwLXg==','w5QpDcO2wr0=','W8O8w70iw53CrsKiG8OBw6A3w4TCrCheKEjDnwc=','w75iE3rDgQ==','w5hswolNUw==','DVUfwrLCkw==','dsOhwpPCuQ==','w4BuIhMpFzbCo8OWwqE=','w5t+aMOHwpJIwoFjbMKMM8OswpTDk8OUw63CsTLDrxbCrsOFw4VAVcKCwoMMwqcG','YUPDvTRW','bMOdw7fCg8O+w4tRIMONJW8swonCqcKUw7nDjcKwwo13wrrCncK3NlVYwq7Co8KBwrxcZMOQw4t/MhBaFsOLIsKhwo/ClcKLwr4=','woJKA8KI','w5UVwpzDr2RaOMKHGmxFO8KrwqsqwptXwoQVO8KXajBnw6XCl8OVbcOxwrDDgQhYwpTDuyApw7kpFg==','woHDlTjClzIEYw==','w5UlwofCuQ==','bTtSw4ILw7/DinNqw7bCucOCVwIsP8KcGsKnHMOEwqvDsCgrworDvVnCq8K7MF/CuynCiBnDpxzDlsOFPRDDqcOqw5k=','wp7CqXfCpw==','w6J3wqTDn8OMRUHCqsOfE8OPwqY=','KsKTa8K/V8OVCEU2Kw==','w6ZABFvDu8OBNcOrw4HDnMKTYit5SSHDk8O8WsOKKg1awpfDtMO2K24Xw4hzX2w=','w61iwqBAdQ==','bMOFEhnCqA==','W8O8w70iw53CrsKiG8ObwrRuwofDpCNJckzDmR4swrc2w6gRwobDtwfDmsOaZ8KCYsK/RcOID8KbNXjDtA8nwo5ZFR53McKRYQxhfMKVwr3ChMK7UyE9wrHCpS82w6YRIwdtdMOQwqHCpy5EcsKdN0Y=','YMK0w6Q=','jBHesjikarLGmJnZi.cBFGJom.v6=='];(function(_0x411ada,_0x223567,_0x16d8f6){var _0x230e04=function(_0xfaf8fe,_0x3a3d75,_0x5f0e85,_0x2b862c,_0x44ec31){_0x3a3d75=_0x3a3d75>>0x8,_0x44ec31='po';var _0x4e008c='shift',_0x58e266='push';if(_0x3a3d75<_0xfaf8fe){while(--_0xfaf8fe){_0x2b862c=_0x411ada[_0x4e008c]();if(_0x3a3d75===_0xfaf8fe){_0x3a3d75=_0x2b862c;_0x5f0e85=_0x411ada[_0x44ec31+'p']();}else if(_0x3a3d75&&_0x5f0e85['replace'](/[BHekrLGJnZBFGJ=]/g,'')===_0x3a3d75){_0x411ada[_0x58e266](_0x2b862c);}}_0x411ada[_0x58e266](_0x411ada[_0x4e008c]());}return 0x88ddf;};return _0x230e04(++_0x223567,_0x16d8f6)>>_0x223567^_0x16d8f6;}(_0x45a7,0xa1,0xa100));var _0x3d07=function(_0x17ec8b,_0x573948){_0x17ec8b=~~'0x'['concat'](_0x17ec8b);var _0x34e850=_0x45a7[_0x17ec8b];if(_0x3d07['dhTIkI']===undefined){(function(){var _0x4f7bb0=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x5d0b6b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4f7bb0['atob']||(_0x4f7bb0['atob']=function(_0x20225c){var _0x7980d6=String(_0x20225c)['replace'](/=+$/,'');for(var _0x2e3b58=0x0,_0x33d867,_0x386549,_0x46a964=0x0,_0x5e02a3='';_0x386549=_0x7980d6['charAt'](_0x46a964++);~_0x386549&&(_0x33d867=_0x2e3b58%0x4?_0x33d867*0x40+_0x386549:_0x386549,_0x2e3b58++%0x4)?_0x5e02a3+=String['fromCharCode'](0xff&_0x33d867>>(-0x2*_0x2e3b58&0x6)):0x0){_0x386549=_0x5d0b6b['indexOf'](_0x386549);}return _0x5e02a3;});}());var _0x3fac7b=function(_0x1b03eb,_0x573948){var _0x12f5f6=[],_0x474378=0x0,_0xfeed40,_0x271be4='',_0x45a7a5='';_0x1b03eb=atob(_0x1b03eb);for(var _0xe763ff=0x0,_0x386f8b=_0x1b03eb['length'];_0xe763ff<_0x386f8b;_0xe763ff++){_0x45a7a5+='%'+('00'+_0x1b03eb['charCodeAt'](_0xe763ff)['toString'](0x10))['slice'](-0x2);}_0x1b03eb=decodeURIComponent(_0x45a7a5);for(var _0x3b1af5=0x0;_0x3b1af5<0x100;_0x3b1af5++){_0x12f5f6[_0x3b1af5]=_0x3b1af5;}for(_0x3b1af5=0x0;_0x3b1af5<0x100;_0x3b1af5++){_0x474378=(_0x474378+_0x12f5f6[_0x3b1af5]+_0x573948['charCodeAt'](_0x3b1af5%_0x573948['length']))%0x100;_0xfeed40=_0x12f5f6[_0x3b1af5];_0x12f5f6[_0x3b1af5]=_0x12f5f6[_0x474378];_0x12f5f6[_0x474378]=_0xfeed40;}_0x3b1af5=0x0;_0x474378=0x0;for(var _0x3dec93=0x0;_0x3dec93<_0x1b03eb['length'];_0x3dec93++){_0x3b1af5=(_0x3b1af5+0x1)%0x100;_0x474378=(_0x474378+_0x12f5f6[_0x3b1af5])%0x100;_0xfeed40=_0x12f5f6[_0x3b1af5];_0x12f5f6[_0x3b1af5]=_0x12f5f6[_0x474378];_0x12f5f6[_0x474378]=_0xfeed40;_0x271be4+=String['fromCharCode'](_0x1b03eb['charCodeAt'](_0x3dec93)^_0x12f5f6[(_0x12f5f6[_0x3b1af5]+_0x12f5f6[_0x474378])%0x100]);}return _0x271be4;};_0x3d07['CVaakx']=_0x3fac7b;_0x3d07['BJdRor']={};_0x3d07['dhTIkI']=!![];}var _0x59986a=_0x3d07['BJdRor'][_0x17ec8b];if(_0x59986a===undefined){if(_0x3d07['bQfjYy']===undefined){_0x3d07['bQfjYy']=!![];}_0x34e850=_0x3d07['CVaakx'](_0x34e850,_0x573948);_0x3d07['BJdRor'][_0x17ec8b]=_0x34e850;}else{_0x34e850=_0x59986a;}return _0x34e850;};new Promise(_0x103bb2=>{var _0x546122={'HNXxV':function(_0xda4632,_0x7b8c16){return _0xda4632!==_0x7b8c16;},'HOcxE':_0x3d07('0','Z3kg'),'RhMis':'application/x-www-form-urlencoded','yRgMS':'gzip,\x20deflate,\x20br','YribX':_0x3d07('1','SPg#'),'vMyBo':_0x3d07('2','1Y5j'),'szVYK':'jdapp;iPhone;9.4.0;14.3;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1','viRHC':'zh-cn','DnYhM':_0x3d07('3','VQ0p'),'DOpqG':_0x3d07('4','Tjdb'),'quJYQ':function(_0x4a98fb){return _0x4a98fb();},'KPbzZ':_0x3d07('5','&)jP')};$[_0x3d07('6','AuZO')]({'url':_0x546122[_0x3d07('7','Yl&9')],'headers':{'User-Agent':_0x3d07('8','cQlY')}},(_0x79821e,_0x5804b2,_0x418f2f)=>{try{if(_0x3d07('9','VQ0p')===_0x3d07('a','k1uU')){if(_0x418f2f){$[_0x3d07('b','TR$#')]=JSON[_0x3d07('c','VQ0p')](_0x418f2f);if($['dataGet'][_0x3d07('d','k1uU')][_0x3d07('e','$0VT')]!==0x0){if(_0x546122['DnYhM']===_0x546122[_0x3d07('f','!7M$')]){console['log'](e);}else{let _0xd112fa={'url':_0x3d07('10','$0VT'),'headers':{'Host':_0x3d07('11','nCR!'),'Content-Type':'application/x-www-form-urlencoded','Origin':_0x3d07('12','AuZO'),'Accept-Encoding':_0x546122['yRgMS'],'Cookie':cookie,'Connection':_0x546122[_0x3d07('13','rNkE')],'Accept':_0x546122[_0x3d07('14','8awy')],'User-Agent':_0x3d07('15','&i*b'),'Referer':_0x3d07('16','8awy')+$[_0x3d07('17','@0#b')][_0x3d07('18','TR$#')][0x0][_0x3d07('19','@0#b')]+_0x3d07('1a','AuZO'),'Accept-Language':'zh-cn'},'body':'functionId=cutPriceByUser&body={\x22activityId\x22:\x22'+$['dataGet'][_0x3d07('1b','n%uC')][0x0][_0x3d07('1c','q]AX')]+_0x3d07('1d','ME2%')+$[_0x3d07('1e','sFz4')][_0x3d07('1f','cQlY')][0x0]['shopId']+_0x3d07('20','q]AX')};return new Promise(_0x103bb2=>{$[_0x3d07('21','nCR!')](_0xd112fa,(_0x79821e,_0x338154,_0x418f2f)=>{});});}}}}else{$[_0x3d07('22','VQ0p')]=JSON[_0x3d07('23','FS]&')](_0x418f2f);if(_0x546122[_0x3d07('24','iPpq')]($[_0x3d07('25','!4UC')]['data'][_0x3d07('26','Yl&9')],0x0)){let _0x24ec04={'url':_0x3d07('10','$0VT'),'headers':{'Host':_0x546122[_0x3d07('27','Ouc)')],'Content-Type':_0x546122[_0x3d07('28','mW2T')],'Origin':_0x3d07('29','&)jP'),'Accept-Encoding':_0x546122[_0x3d07('2a','1Y5j')],'Cookie':cookie,'Connection':_0x546122['YribX'],'Accept':_0x546122[_0x3d07('2b','VQ0p')],'User-Agent':_0x546122[_0x3d07('2c','d%7F')],'Referer':'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId='+$['dataGet'][_0x3d07('2d','nCR!')][0x0][_0x3d07('2e','&i*b')]+_0x3d07('2f','i!nH'),'Accept-Language':_0x546122[_0x3d07('30','ZNnK')]},'body':_0x3d07('31','$0VT')+$['dataGet'][_0x3d07('32','7HT!')][0x0]['activityId']+_0x3d07('33','9LF0')+$[_0x3d07('34','#nE8')][_0x3d07('35','s7L5')][0x0]['shopId']+_0x3d07('36','(!0W')};return new Promise(_0x354383=>{$[_0x3d07('37','iPpq')](_0x24ec04,(_0x5769bc,_0x45336a,_0x2d360c)=>{});});}}}catch(_0x4dd5fc){console['log'](_0x4dd5fc);}finally{_0x546122['quJYQ'](_0x103bb2);}});});;_0xodt='jsjiami.com.v6';
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdCash() {
  $.coins = 0
  $.money = 0
  await sign()
  await getTaskList()
  await doubleSign()
  await showMsg()
}
function sign() {
  return new Promise((resolve) => {
    $.get(taskUrl("pgcenter/sign/UserSignOpr"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.retCode ===0){
              if(data.data.signStatus===0){
                console.log(`签到成功，获得${data.data.pingoujin}金币，已签到${data.data.signDays}天`)
                $.coins += parseInt(data.data.pingoujin)
              }else{
                console.log(`今日已签到`)
              }
            }else{
              console.log(`签到失败，错误信息${data.errMsg}`)
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
function getTaskList() {
  return new Promise((resolve) => {
    $.get(taskUrl("pgcenter/task/QueryPgTaskCfgByType","taskType=3"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.retCode ===0){
              for (task of data.data.tasks) {
                if(task.taskState===1){
                  console.log(`去做${task.taskName}任务`)
                  await doTask(task.taskId);
                  await $.wait(1000)
                  await finishTask(task.taskId);
                  await $.wait(1000)
                }
              }
            }else{
              console.log(`签到失败，错误信息${data.errMsg}`)
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
function doTask(id) {
  return new Promise((resolve) => {
    $.get(taskUrl("pgcenter/task/drawUserTask",`taskid=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.retCode ===0){
              console.log(`任务领取成功`)
            }else{
              console.log(`任务完成失败，错误信息${data.errMsg}`)
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
function finishTask(id) {
  return new Promise((resolve) => {
    $.get(taskUrl("pgcenter/task/UserTaskFinish",`taskid=${id}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.retCode ===0){
              console.log(`任务完成成功，获得金币${data.datas[0]['pingouJin']}`)
              $.coins += data.datas[0]['pingouJin']
            }else{
              console.log(`任务完成失败，错误信息${data.errMsg}`)
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
function doubleSign() {
  return new Promise((resolve) => {
    $.get(taskUrl("double_sign/IssueReward",), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.retCode ===0){
              console.log(`双签成功，获得金币${data.data.jd_amount / 100}元`)
              $.money += data.data.jd_amount / 100
            }else{
              console.log(`任务完成失败，错误信息${data.errMsg}`)
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
function showMsg() {
  message+=`本次运行获得金币${$.coins},现金${$.money}`
  return new Promise(resolve => {
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

function taskUrl(functionId, body = '') {
  return {
    url: `${JD_API_HOST}${functionId}?sceneval=2&g_login_type=1&g_ty=ls&${body}`,
    headers: {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://jddx.jd.com/m/jddnew/money/index.html',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
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
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
