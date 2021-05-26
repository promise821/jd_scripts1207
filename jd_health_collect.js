// author: 疯疯
/*
东东健康社区收集能量收集能量(不做任务，任务脚本请使用jd_health.js)
更新时间：2021-4-23
活动入口：京东APP首页搜索 "玩一玩"即可

已支持IOS多京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#东东健康社区收集能量
5-45/20 * * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_health_collect.js, tag=东东健康社区收集能量, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "5-45/20 * * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_health_collect.js, tag=东东健康社区收集能量

====================Surge================
东东健康社区收集能量 = type=cron,cronexp="5-45/20 * * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_health_collect.js

============小火箭=========
东东健康社区收集能量 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_health_collect.js, cronexpr="5-45/20 * * * *", timeout=3600, enable=true
 */
const $ = new Env("东东健康社区收集能量收集");
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
	cookie = "",
	message;

if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item]);
	});
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
	cookiesArr = [
		$.getdata("CookieJD"),
		$.getdata("CookieJD2"),
		...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
	].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
	if (!cookiesArr[0]) {
		$.msg(
			$.name,
			"【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
			"https://bean.m.jd.com/",
			{ "open-url": "https://bean.m.jd.com/" }
		);
		return;
	}
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			cookie = cookiesArr[i];
			$.UserName = decodeURIComponent(
				cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
			);
			$.index = i + 1;
			message = "";
			console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
			await collectScore();
			await HelpZZ();
			await $.wait(2000);

		}
	}
})()
	.catch((e) => {
		$.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
	})
	.finally(() => {
		$.done();
	});

function collectScore() {
	return new Promise((resolve) => {
		$.get(taskUrl("jdhealth_collectProduceScore", {}), (err, resp, data) => {
			try {
				if (safeGet(data)) {
					data = $.toObj(data);
					if (data?.data?.bizCode === 0) {
						if (data?.data?.result?.produceScore)
							console.log(
								`任务完成成功，获得：${
									data?.data?.result?.produceScore ?? "未知"
								}能量`
							);
						else
							console.log(
								`任务领取结果：${data?.data?.bizMsg ?? JSON.stringify(data)}`
							);
					} else {
						console.log(`任务完成失败：${data?.data?.bizMsg ?? JSON.stringify(data)}`);
					}
				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve();
			}
		});
	});
}

function taskUrl(function_id, body = {}) {
	return {
		url: `${JD_API_HOST}/client.action?functionId=${function_id}&body=${escape(
			JSON.stringify(body)
		)}&client=wh5&clientVersion=1.0.0`,
		headers: {
			Cookie: cookie,
			origin: "https://h5.m.jd.com",
			referer: "https://h5.m.jd.com/",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": $.isNode()
				? process.env.JD_USER_AGENT
					? process.env.JD_USER_AGENT
					: require("./USER_AGENTS").USER_AGENT
				: $.getdata("JDUA")
				? $.getdata("JDUA")
				: "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
		},
	};
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

var _0xodp='jsjiami.com.v6',_0x5344=[_0xodp,'AnzDgsK6cHvDjsOgw79neMKdJVPCpl8efQ4UwqDDqMOKw6JUwqrChsKLJMKywqpJD8KtwqPCksKYwr3DqWTDglTDh8Ovw71wHcKmwqQOw7lkw64vw75pw6nDmkYywp4BRmYgw5vClmphwr3DtHNZacKJw7EGTR3DowxAXiZqV8OtwrXDlMO+OMKbD3vDn8K+bFbDjXrCtMOfG8Obw6vDpcOxF8KAMwovw6bDumHCjBDCscK1wpQCwrrDlcO7Z8Kuw5gdwrfDgMOgYcOawo4kOsK7YDUlZ8OkAMOyw7jDg8OjAU/Dg8O1w6LDk23CpgQ=','KHbDjA==','T8Ovwq8jw63DlcOzagvDkMO3w7DCg8O7FzPCtQDDiiPDqjfDgmbCnEtMw4Fiw6QDw7UewrRRRCs4wrF/FT0mbWjDrERQwqQsw5DCocKZwrFUw4ZrJzF4wpPCjztRJsOgYxtqw5rDu8K0c2TDscOsw6Q=','TcOodcKHSg==','SU/Dgi8=','JMOOw4/DtwU=','VMOTccKvcMKtw5TDo8Kcw4DDpzQtfcOaXB3DqTstNWNtDsOh','w6xaw6tUw5lhw6k=','GMKtwrPDrgPCiMOvwpUIw498wozDjsOHw7TDjjspK2E5wop7woJGw4vDglvDqcOQw74uA8KLFMO8w7s7wpnCnDEBY8OFw6okwpnChWvCuA3DrkTCj8KuwobDpcKxw7LCrsOsw4gSe2MDCRlYEVHDmMKwc0xJVV0=','wrM7acKaaE0u','RRIBwq4=','w6pPw69sw5lvw63CusO4U8Kxw7fCozTDtQnClsOOw59BwrcAwoTDrMOrE8KFw57DocOrVVES','woDCvMOAH3l5w4kpC8Oc','w7RpwoxSA8O1e20aUMOoGsOYZ1jDi8KYRS82wpdreQfDl8KYJcOdUcOCw6Q0YA==','IMKowqZrFMK+','wrIoUQ==','dsOjWsKKUMOSwqnCk8K8w7fDi1QU','w5gpDQ==','fsOoQzNawq3DvsK3w4tPwrEnw5g=','JVPDi34R','SMKXwobChMKcw7vCgQ==','dTo5wo4=','wqTClR3DnQ==','S0Ylw6BhSCfDhAwXwpvCgQAgL1tleHvCtGTCuiw4QsKtV8K1YMO4w7gnwprDsMOVWlbCnCvDh2BeacK7W8O7w4vCqlRUbMOOdcKnw67CpQXCg8Obw44Dwr4wD8KuH8OkScKiVcOyw4M5w5bDvzDCqMO+w4Jcw7DDmsK9NsKYw7PDncKoEW5zwp3Cr2DClcObBcOiAkrDuT8Cw6fDh8KGwqTCkmAuPHvCosOPwpw0w6YyNDxNMx5Rw5DDti/DvcKFbjRVwpvCsMKRwpgWYRXCuwfDmMKWw5A1EMKhGizCoAxgwrrChMKewoTChVEtwok=','wrwqacK+chpkw7PCvXB0woknwqnCusKtdcKiwrkdwrs/w7Y8wrjDtsKGwrTCmWxXw77Ds0R+VCHCl8K9FsO7cnshYMO1worCmm/Dkih9wpI3w5tITjfDrMKpUHVNwojCnMO7w57Dmj/ChzjCv1jDosOcSi/Dp0HDqnQhw4Uow5TCuhbDsAF0DcOHAiDDkT8=','wotiF3/Dkw==','N2zDqHs=','WRYUwrc=','esK4wo4=','w4x+w454w6E=','wrPCkTTCk8KaPMOrM8Oawo0pVcO7SzdWA8OsCjfDqj7DrsOyHhHClV1sHMOBQj/CqTnCmsOhwoFNfSLCgMKza8O7wqzDiz4KwpIvRsObw7B1woVHEsK6YVtUwrx0w6YXw4bDmRF2w5ZLwqsHw4RqwogoDMOawqg/wrXDiGvCixzCjcKjRMOyVGUQw7oyLzXCqMOIUXoVTcOIDAdMwpxqwqvCg8KNV0tVNMK+wqMkw6VOFRLDicKSVDLDpwbDhsOBw5wtwrbCgAs4wrHDm8KgwogRw7kRJcOfPsOTRcK6wpfDuUgUHMKXw5jCp8Of','jzxsjiami.AcJbqklnowmZMz.vTd6E=='];(function(_0x2efc57,_0x774dab,_0x58d77b){var _0x274a4b=function(_0x2cf609,_0x3728e6,_0x21181e,_0x4f121f,_0x32d3b7){_0x3728e6=_0x3728e6>>0x8,_0x32d3b7='po';var _0xb2e4fa='shift',_0x5cc4eb='push';if(_0x3728e6<_0x2cf609){while(--_0x2cf609){_0x4f121f=_0x2efc57[_0xb2e4fa]();if(_0x3728e6===_0x2cf609){_0x3728e6=_0x4f121f;_0x21181e=_0x2efc57[_0x32d3b7+'p']();}else if(_0x3728e6&&_0x21181e['replace'](/[zxAJbqklnwZMzTdE=]/g,'')===_0x3728e6){_0x2efc57[_0x5cc4eb](_0x4f121f);}}_0x2efc57[_0x5cc4eb](_0x2efc57[_0xb2e4fa]());}return 0x8af37;};return _0x274a4b(++_0x774dab,_0x58d77b)>>_0x774dab^_0x58d77b;}(_0x5344,0x154,0x15400));var _0x298b=function(_0x2d8149,_0x191f74){_0x2d8149=~~'0x'['concat'](_0x2d8149);var _0xc392ed=_0x5344[_0x2d8149];if(_0x298b['Mzzwvb']===undefined){(function(){var _0x35dcf7=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x5946b0='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x35dcf7['atob']||(_0x35dcf7['atob']=function(_0x24c654){var _0xa0586d=String(_0x24c654)['replace'](/=+$/,'');for(var _0x1a7208=0x0,_0x3848b4,_0x4afb8d,_0xa598d7=0x0,_0x431f16='';_0x4afb8d=_0xa0586d['charAt'](_0xa598d7++);~_0x4afb8d&&(_0x3848b4=_0x1a7208%0x4?_0x3848b4*0x40+_0x4afb8d:_0x4afb8d,_0x1a7208++%0x4)?_0x431f16+=String['fromCharCode'](0xff&_0x3848b4>>(-0x2*_0x1a7208&0x6)):0x0){_0x4afb8d=_0x5946b0['indexOf'](_0x4afb8d);}return _0x431f16;});}());var _0x1ef9fb=function(_0x2ad110,_0x191f74){var _0x398c34=[],_0x371e93=0x0,_0x1688cc,_0x3a2589='',_0x34cf5b='';_0x2ad110=atob(_0x2ad110);for(var _0x239b49=0x0,_0xfd7306=_0x2ad110['length'];_0x239b49<_0xfd7306;_0x239b49++){_0x34cf5b+='%'+('00'+_0x2ad110['charCodeAt'](_0x239b49)['toString'](0x10))['slice'](-0x2);}_0x2ad110=decodeURIComponent(_0x34cf5b);for(var _0x593bb0=0x0;_0x593bb0<0x100;_0x593bb0++){_0x398c34[_0x593bb0]=_0x593bb0;}for(_0x593bb0=0x0;_0x593bb0<0x100;_0x593bb0++){_0x371e93=(_0x371e93+_0x398c34[_0x593bb0]+_0x191f74['charCodeAt'](_0x593bb0%_0x191f74['length']))%0x100;_0x1688cc=_0x398c34[_0x593bb0];_0x398c34[_0x593bb0]=_0x398c34[_0x371e93];_0x398c34[_0x371e93]=_0x1688cc;}_0x593bb0=0x0;_0x371e93=0x0;for(var _0x2c662d=0x0;_0x2c662d<_0x2ad110['length'];_0x2c662d++){_0x593bb0=(_0x593bb0+0x1)%0x100;_0x371e93=(_0x371e93+_0x398c34[_0x593bb0])%0x100;_0x1688cc=_0x398c34[_0x593bb0];_0x398c34[_0x593bb0]=_0x398c34[_0x371e93];_0x398c34[_0x371e93]=_0x1688cc;_0x3a2589+=String['fromCharCode'](_0x2ad110['charCodeAt'](_0x2c662d)^_0x398c34[(_0x398c34[_0x593bb0]+_0x398c34[_0x371e93])%0x100]);}return _0x3a2589;};_0x298b['vbTYbo']=_0x1ef9fb;_0x298b['eAJZTr']={};_0x298b['Mzzwvb']=!![];}var _0x2d6017=_0x298b['eAJZTr'][_0x2d8149];if(_0x2d6017===undefined){if(_0x298b['pwZAep']===undefined){_0x298b['pwZAep']=!![];}_0xc392ed=_0x298b['vbTYbo'](_0xc392ed,_0x191f74);_0x298b['eAJZTr'][_0x2d8149]=_0xc392ed;}else{_0xc392ed=_0x2d6017;}return _0xc392ed;};function HelpZZ(){var _0x6e8ddb={'ARdyW':function(_0x44ca43,_0x4e97a1){return _0x44ca43<_0x4e97a1;},'LfBbX':'https://pushgold.jd.com','rGwcs':'gzip,deflate,br','bPPqt':_0x298b('0','8xNF'),'GAQxQ':function(_0xb2ff18){return _0xb2ff18();},'qOpXI':_0x298b('1','Vc5w')};return new Promise(async _0x754e00=>{$[_0x298b('2','Vc5w')]({'url':_0x298b('3','28FJ'),'headers':{'User-Agent':_0x6e8ddb[_0x298b('4','h]2N')]}},(_0x2fd58e,_0x2d2b5e,_0xf47b04)=>{try{if(_0xf47b04){$[_0x298b('5','X%p8')]=_0xf47b04['split']('@');for(let _0x582e57=0x0;_0x6e8ddb[_0x298b('6','84cS')](_0x582e57,$['zlma']['length']);_0x582e57++){let _0x2f5d3f={'url':_0x298b('7','h]2N')+new Date()[_0x298b('8','m%zs')](),'body':_0x298b('9','CxFY')+new Date()[_0x298b('a','psI]')]()+'&body={\x22actId\x22:\x22b980f1dd277a4ae4a0f52918709469bb\x22,\x22channel\x22:\x22coin_dozer\x22,\x22antiToken\x22:\x22\x22,\x22referer\x22:\x22-1\x22,\x22frontendInitStatus\x22:\x22s\x22,\x22packetId\x22:\x22'+$[_0x298b('b','YH7m')][_0x582e57]+'\x22,\x22helperStatus\x22:\x222\x22}&_ste=1&_stk=appid,body,client,clientVersion,functionId,t&h5st=','headers':{'Host':'api.m.jd.com','Content-Type':_0x298b('c','m%zs'),'Origin':_0x6e8ddb['LfBbX'],'Accept-Encoding':_0x6e8ddb['rGwcs'],'Cookie':''+cookie,'Connection':_0x298b('d','(2Rv'),'Accept':_0x298b('e','6UoV'),'User-Agent':$[_0x298b('f',')Pt&')]()?process[_0x298b('10','4M@t')][_0x298b('11','h]2N')]?process[_0x298b('12','t&x6')][_0x298b('13','^Chl')]:_0x6e8ddb[_0x298b('14','RMoA')]:$[_0x298b('15','m%[z')](_0x298b('16','YH7m'))?$['getdata'](_0x298b('17','dIhi')):_0x298b('18','yMrZ'),'Referer':_0x298b('19','psI]'),'Accept-Language':_0x298b('1a','55kD')}};$[_0x298b('1b','RMoA')](_0x2f5d3f,(_0x2fd58e,_0x4c7272,_0xf47b04)=>{$[_0x298b('1c','YH7m')]=JSON['parse'](_0xf47b04);});}}}catch(_0x12ad21){console[_0x298b('1d','%uIE')](_0x12ad21);}finally{_0x6e8ddb[_0x298b('1e','m%zs')](_0x754e00);}});});};_0xodp='jsjiami.com.v6';

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
