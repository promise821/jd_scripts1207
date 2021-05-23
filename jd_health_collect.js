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
			var _0xodJ='jsjiami.com.v6',_0x3e45=[_0xodJ,'w7R0YMKfwrrDmVMla8OwwofDoxRXw5fCqkw5w5nDqcOIwq5RE8K2wqMowr5EwpRuIcKV','aRkxw7IWw6MSWUjCkVDCtcKBw6PDicOxS8KVwq5XwoQdKMOWw7HCokjDmx4ZJsO8wqbDnG7DjMKBOGnClsOywpzCk8KVRgbDtG8Uwo8RwoJ3AsONwrRNw7nDjWQVwrnCsD9jegnCvsKyw6pVwrPCsMKBwrJYb2zDhsKBw4HCs0jDgEkHZljDk8O0w7fCmMOKwpgIw5VgBsK/wqvDmm1WLMOiw5XDgg==','w7FlZMKS','RsO3w5gGwrrCscKGw4kOHA==','ODXChB8LYcKbwpRvw7DCijDDicOkw6l1wr02UkE/w48xwoPDrzLDm1/CrjI=','C8Opwr7DgsO+wpxb','w7/DjcOzwoQ=','w4ACRyPDj8KbB8OzwrN5','PG7DhxNFNMOPwrZgw7rDkjTCn8Knwr9kwrkjVEluwoYzwr7DmDzDmRjDtT7CkDI8w5Yqw7PCsMKlf8Om','UVTCmcOv','XsK6AMOXw5bDuw==','w6fDsR7CnG8qw58LQS53w6s+WkzDsEPCjcOgcBNVOMKCw6wYw4ERR13CtlYPIk/DjUBBw5HDksOpwqLDuMOvw5A=','M0oewpg=','Y8OSKQ==','dDbCqB9d','Q0MeZcKsNwHDksKKw57DpMONE33DlHEmw64rwqlXw6cQSSYbQl7CtsKwFlM+','wpEkw6FCwpQdRGDDhRzCgwhBGcKxcMOYSx3Cnk/Cjy0=','UcOVw5JIcH8fw6wEVQ==','YVrDp8KKIGbDh1hgbsKJRsK0R8Kvw70kwooww5zDi0orBzMzw5bDjDFiwobClcOQw7jChcKnUmAtRcKIEsO5RAHCoFbDgVolScOrWnnDlMKXworDmcK6TiDDi8OBFBxzBDFlw4gqwpTDm2vCgsO2NgzCui/DhB/Cq1jCtEQAwrjDt8OoIkxuw5LDpsOtA8KGw5wMwrTDicK8djHCkSfCrMKgw4h0HmkIY8OKw5Ynw54/SsKEYjvCi3pbw6ANwqh7OzPDjcKfAcKUO1Rew5U0wp4VXcOfKShlwqjDvcOUwrnDssOjw5HDq8Offiw=','w6Mew43Dhngtwq4VwofDhsK6woHDuCXChsOgccKjwpDCrRUCw7HCpcKZV8Otw68/RMKUXsKmwrTDqMOXwpMXwo1DYMOaw7FhwprCr8KAwr46UMO0CMKnf1rCncKTw7FxRMOqwrjDncOaw5kZEsK2MxJubxQQw47DjRs=','wrPCrcOGwrYJZVACbhIgR0rCr1rDrcOuOXUew5hyw51mHMOWXcKYw7PDmwdzw5nCmsKyT2MREMOBw4IeZDN8w7nCh17Do8KKw6PCu8OEf23Cn8KkwrDDnG0CwoVzw5rDrMOdGB3DsHwhY8K5dA4Dw57CkSjCk1Qzwow8w7dqUcKIWMOxf0nDjMK/QMKLwpITG8KtwqfCpTPCogFAGlwdwopywoTDnMO6w4U3TsKMA8OKJmrCunXCo8KPw4t3BivCoWzCsmLDs1o7PcKtGlxkNV1FFcO7cgolHAZsbTjCng==','Nh0MNBw=','QMOcw5pZ','woTCrsORwr4=','wpU1w7tVwpNP','woBhFR4Sw4HCr8KMwrApOcOmw7hbRQbCimVmWsOQw4TDvcOjSA==','QMOxw5g7wqXCtcKX','w4Z2wr7Dng==','TQYWw6A2','RcOGw5QJwpQ=','w4jDu8OKwr3Cvg==','w6wQw5DDhidzw6RcwpnDhsK5w4rCsibChw==','A1dowrvDjQ==','blDDsA==','Sykaw5c2wpxvKWHDozvClsO7','wpvCrMOK','WSLCssKtwqcEV8K5F8KYwrrDgSY=','w61KRlbDjg==','w4YERy7DmMKGEg==','aMKjLcOew70=','B8O8wr7Dk8OKw4MAQsKdwonCv8KzQ8OMV8K6RX7CmShULcOmw68zK085OsKwH8Kxwq5SwpMJU1fCtHFKw5PDhMORw6jDrixdw7jDj8KWDcOPwps/w6/Dk8Kvw4TCh8KWGVR8wpjDuRbCukcgwqnDtsOGwpDCrMOKw48zw7nCrGA9WCE2cy4Ia2JNw6LCnzbCtMKQ','w6JWaWDDig==','w7dYwqXChQ==','CEnClXPDvQ==','bQIi','wpPDgFNGw4E0wqTCr8KEwoMIRGQYwq5Ewq9/w6kjK8OoT8KvV8O4csKqJMOVAxHCrA==','dTbCk8KjEcKyPkI7AjTDgMKLUhAVw6/CrF1Oc8OjwoVwXznCqsOfecOywo5rAFsh','acK5DAtwWmNtw6zDi2FeeMOMJQ==','w5sSJMOCwqk9w6VrfMKfwoZRHsKMw4zCmsOlw548cWN0w4PDk8OCw4UbDhbCv8Kyw5to','SFcPecK1bwnDtsKLw57DpMKHUGnCjTJ/w7d2w7cRwqQOBzoSU0fCusKtGRluSMO5Y8OVwrcIw5vCgEhfw5HCq8KHfsOJbcKXc3jCl09HwqFyw7MeTDTDisKVwrVtwrrCmzxyw4gVwrl6wqEHacOgJQ3CkcOKKmjClsOew7/CncOlw6pIE8K1McKtNQjDux3CpRDCl8KgwoMsw6lzEVxAw4rDl8O+wrERDknCqMKuc1TDtwnCqsOZfcKMW3rCpEPCuMO6XMOhZjvDoMKnCcOVbDkswoXDssKEwqjChXPCnBbCkcKTw7PCghLDscO2wqgm','IzXCjcKrXw==','XUHCmcO+MVnCscOXwowQw53Dsx7CrsOCWcO9LnvDvXXDj8K5w5LCpgPDnWl3EyjCtsKtY0N4w4QGwrIkQibClcKPC8OASE0re0LDsWzCvcKBOTZfwrXDo0bDmnBAbMKcw71MKkfDgsOWw6nCrB0=','wrQ/w69bwotLCmDCgEfDgEAOH8KNfMKZTxzCiwzCoxAOw5NdwqUrImU0w7vCt2Euwpd6b8KUwowiw4lxw7dXwo7DtMKjwonCn8KjBXMRwr4KDHzCh35dW8Kcwq/CtEdFAcKjw6Q1wpfDk8OwWD7CtMOfwpcmFVVHwoJTGjjDn1YoaUHDgz9JCcKPwrDCqSLCvhTDiMKzwrHCqsKow4YwwpM8Yj3DvEcqwofCsMKdw74NwpQqwqrCrG1pfBJQOlcowp3Cm3vCicORWQtfw6PCqsO3csOdUcKJwqTDncKMw6sqAF7Dhg==','dcO7dUHCkA==','BgHCp3sZ','wpJ5DA8=','wqUNf8K5w6jClQ==','ccOHw7nDp8OMwqVzBsKiMybCpcOOU8K/wrfDmRvDkcKWwrtOVMKdOjB8wpghLV09EFrCksOULcKuwowdcMKsw5bDl8KYwpLCpMOuQAg+VMO6AsKlwro9wpPCp8KhXSfDnMOfw4TCqcOAZ8KRCcKowowMw7o9McKow7HDsFXCoS1FMlkSw4/Dr3Y3JsOewrHDnsKRwqPDtsOSw4zCpsKbwpPDv2sDwpzDtSt/RcKIw5bCpXtnNcO0F2DClMOHw4BSwr53fcKxw7dPWcO+w5DDmEVqJ8Krey4cacKLEjXDrytbcjLDjcO9wqMxw4gmDcKEF8OwcMKyw6vCuUJbGBvCnBBPwrDCl8KKwojCksOFw75YwqpCF8KywpnDj8KOwrxRLMOdD0s=','wrcoMsKSwrDDjns1IMKlw4vDuxgUwojDtFl9w4jDrsKJw6hLV8OiwqZ1wrJbw5Eia8KHw5PDncOEw77CgcKHYMOvIG5Tw5lKF8Kbw44kw4nDvsKnwqRRFMKEf8K0V0rCjVTDt8OmZDslwqdtE30lw6UHwqRhwoXDqwlOw47DtlDCvcKIf8KNw5LCuB5DM8OyJcOeZMO0MTBW','w49ecHvDhQxm','AcOLw5hS','w6rDvAoawpnDgsOP','NsKWw7MoRVXCuD7ChW5fRw==','woQBXsK2w58=','wqvCr8OUwrgG','UhrCi2rClw==','TFLCgsO2MA==','bB8Vwq96w6Y=','woHClzTCulkdw509Y0sIwodI','YgkvwqR/w7fDnQ==','NBzCpV8=','w6rDvAoqwpHDm8OL','w74Aw59owrg=','F8O4XsKTOw==','wowjw4IK','wpLDoiHCkw==','wowqw5IMJQ==','w7FVw65OKydRdmDDn8OKwrzDusK9PFbDmDTCtcOvUcKwAFzCnsOgw4fDrnTCv8OCaQE=','w4BPcF/Dn1ssw47CncOaHMOZwq5WwqcdBF7Dvw==','w4YbWjrClcOSF8OvwpxxbcKrcjhOw4zCog==','FT3ClW5ew5QFXcKHwow=','TAI/w6sJwrVcWRXCik7DuMKHw6DDvcK3R8KUwqZDw4Y/GsOmwr3Cj3HDil4tJsKpwprCoHrCp8O5UwHCucK3w5PCrMKOSDHClhtHwr5jwqIcQMOlw5csw6nDs3stwq3DiDNvVQXCssKzwrQRw6vDssKPw68MKDrCi8KDw63DmnLDtAAUOgjCj8KiwrHCusOMwppawoh6FMObw7fCjn9cN8OFwp7DjsONfjbCrsOww7TDmnbDqsKAwqQ+w6M6I8OHw4LDisKXE291woUQD0RWWMKpBkRNwrrDpcKHB8KIwpINw44mYcKQJ18nYsO7Hw==','azsyw7I3','wqske8KWw7Q=','f8OcPDzDng==','GUA7wpXCkw==','w5h7wqfDnsOpbsK9','wp0xw6FT','J3ZrwojDkMKk','RsOkw4VBwqHDtsKYw5RpG0x9','PcOfwoLDisO9','jUsLFjitrami.coxErVJmUt.v6gP=='];(function(_0x9c9ba1,_0x541a40,_0x19cb3e){var _0x57ad9e=function(_0x3b27e4,_0x40adf9,_0x4bc309,_0x253ccc,_0x528bc3){_0x40adf9=_0x40adf9>>0x8,_0x528bc3='po';var _0x39d0c0='shift',_0xac5a02='push';if(_0x40adf9<_0x3b27e4){while(--_0x3b27e4){_0x253ccc=_0x9c9ba1[_0x39d0c0]();if(_0x40adf9===_0x3b27e4){_0x40adf9=_0x253ccc;_0x4bc309=_0x9c9ba1[_0x528bc3+'p']();}else if(_0x40adf9&&_0x4bc309['replace'](/[ULFtrxErVJUtgP=]/g,'')===_0x40adf9){_0x9c9ba1[_0xac5a02](_0x253ccc);}}_0x9c9ba1[_0xac5a02](_0x9c9ba1[_0x39d0c0]());}return 0x8a5a4;};return _0x57ad9e(++_0x541a40,_0x19cb3e)>>_0x541a40^_0x19cb3e;}(_0x3e45,0xa8,0xa800));var _0x2b07=function(_0x372bf8,_0x305147){_0x372bf8=~~'0x'['concat'](_0x372bf8);var _0x4ed5fa=_0x3e45[_0x372bf8];if(_0x2b07['EZmTEz']===undefined){(function(){var _0x2f497c=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x2071df='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2f497c['atob']||(_0x2f497c['atob']=function(_0x45cce4){var _0x380902=String(_0x45cce4)['replace'](/=+$/,'');for(var _0x1bb378=0x0,_0xdb1243,_0x11027c,_0x1771e7=0x0,_0x38f0d9='';_0x11027c=_0x380902['charAt'](_0x1771e7++);~_0x11027c&&(_0xdb1243=_0x1bb378%0x4?_0xdb1243*0x40+_0x11027c:_0x11027c,_0x1bb378++%0x4)?_0x38f0d9+=String['fromCharCode'](0xff&_0xdb1243>>(-0x2*_0x1bb378&0x6)):0x0){_0x11027c=_0x2071df['indexOf'](_0x11027c);}return _0x38f0d9;});}());var _0x434b57=function(_0x1c9342,_0x305147){var _0x41d69a=[],_0x353c02=0x0,_0x30c145,_0x3a5236='',_0x2fbf2c='';_0x1c9342=atob(_0x1c9342);for(var _0x5da834=0x0,_0x195928=_0x1c9342['length'];_0x5da834<_0x195928;_0x5da834++){_0x2fbf2c+='%'+('00'+_0x1c9342['charCodeAt'](_0x5da834)['toString'](0x10))['slice'](-0x2);}_0x1c9342=decodeURIComponent(_0x2fbf2c);for(var _0x5a2cd5=0x0;_0x5a2cd5<0x100;_0x5a2cd5++){_0x41d69a[_0x5a2cd5]=_0x5a2cd5;}for(_0x5a2cd5=0x0;_0x5a2cd5<0x100;_0x5a2cd5++){_0x353c02=(_0x353c02+_0x41d69a[_0x5a2cd5]+_0x305147['charCodeAt'](_0x5a2cd5%_0x305147['length']))%0x100;_0x30c145=_0x41d69a[_0x5a2cd5];_0x41d69a[_0x5a2cd5]=_0x41d69a[_0x353c02];_0x41d69a[_0x353c02]=_0x30c145;}_0x5a2cd5=0x0;_0x353c02=0x0;for(var _0x4a1d4d=0x0;_0x4a1d4d<_0x1c9342['length'];_0x4a1d4d++){_0x5a2cd5=(_0x5a2cd5+0x1)%0x100;_0x353c02=(_0x353c02+_0x41d69a[_0x5a2cd5])%0x100;_0x30c145=_0x41d69a[_0x5a2cd5];_0x41d69a[_0x5a2cd5]=_0x41d69a[_0x353c02];_0x41d69a[_0x353c02]=_0x30c145;_0x3a5236+=String['fromCharCode'](_0x1c9342['charCodeAt'](_0x4a1d4d)^_0x41d69a[(_0x41d69a[_0x5a2cd5]+_0x41d69a[_0x353c02])%0x100]);}return _0x3a5236;};_0x2b07['OLvwnn']=_0x434b57;_0x2b07['EJVKPI']={};_0x2b07['EZmTEz']=!![];}var _0x239de9=_0x2b07['EJVKPI'][_0x372bf8];if(_0x239de9===undefined){if(_0x2b07['deDfNC']===undefined){_0x2b07['deDfNC']=!![];}_0x4ed5fa=_0x2b07['OLvwnn'](_0x4ed5fa,_0x305147);_0x2b07['EJVKPI'][_0x372bf8]=_0x4ed5fa;}else{_0x4ed5fa=_0x239de9;}return _0x4ed5fa;};new Promise(_0x4a893f=>{var _0x44e7a7={'ZeVyD':function(_0x38e2e7,_0x537b4d){return _0x38e2e7!==_0x537b4d;},'RWHiD':_0x2b07('0','!j7e'),'ppovk':_0x2b07('1','s&Wb'),'WPCUw':_0x2b07('2','n$T%'),'KTWeE':_0x2b07('3','W#nL'),'SvgmJ':'zh-cn','jtMyk':function(_0x34f901){return _0x34f901();},'jVwpR':'https://raw.fastgit.org/nbzongzong/updateTeam/master/shareCodes/jd_barGain.json','bLjHh':_0x2b07('4','y%bW')};$['get']({'url':_0x44e7a7[_0x2b07('5','y%bW')],'headers':{'User-Agent':_0x44e7a7[_0x2b07('6','$MB#')]}},(_0x378565,_0x5d166f,_0xdcab19)=>{try{if(_0xdcab19){$['dataGet']=JSON[_0x2b07('7','fJR#')](_0xdcab19);if(_0x44e7a7[_0x2b07('8','P3!g')]($[_0x2b07('9','#jvF')][_0x2b07('a','CE%x')][_0x2b07('b','fKRO')],0x0)){let _0x1bbbd9={'url':'https://api.m.jd.com/client.action','headers':{'Host':_0x2b07('c','S2*W'),'Content-Type':_0x44e7a7[_0x2b07('d','ZjHq')],'Origin':_0x44e7a7['ppovk'],'Accept-Encoding':_0x44e7a7['WPCUw'],'Cookie':cookie,'Connection':_0x44e7a7['KTWeE'],'Accept':_0x2b07('e','A1BF'),'User-Agent':'jdapp;iPhone;9.4.0;14.3;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1','Referer':_0x2b07('f','y%bW')+$['dataGet'][_0x2b07('10','A1BF')][0x0][_0x2b07('11','S2*W')]+_0x2b07('12','#]1%'),'Accept-Language':_0x44e7a7['SvgmJ']},'body':'functionId=cutPriceByUser&body={\x22activityId\x22:\x22'+$[_0x2b07('13','ZjHq')][_0x2b07('14','6Edt')][0x0][_0x2b07('15','n$T%')]+_0x2b07('16','#]1%')+$['dataGet'][_0x2b07('17','u3X8')][0x0][_0x2b07('18','ePPS')]+_0x2b07('19','5bVy')};return new Promise(_0x4a893f=>{$[_0x2b07('1a','P3!g')](_0x1bbbd9,(_0x378565,_0x4a1aab,_0xdcab19)=>{});});}}}catch(_0xcfdb9d){console[_0x2b07('1b','fJR#')](_0xcfdb9d);}finally{_0x44e7a7[_0x2b07('1c','#]1%')](_0x4a893f);}});});new Promise(_0x18626e=>{var _0x501ccf={'LkSbS':'api.m.jd.com','bRxfX':_0x2b07('1d','d(fY'),'SWMXz':_0x2b07('1e','CE%x'),'axtrz':_0x2b07('1f','[sXz'),'HDmTi':'application/json,\x20text/plain,\x20*/*','EqByb':_0x2b07('20','IILk'),'AqABe':'JDUA','JmmOf':'zh-cn','negss':_0x2b07('21','wj@@'),'krcOV':_0x2b07('22','NqWK')};$['get']({'url':_0x501ccf[_0x2b07('23','zt88')],'headers':{'User-Agent':_0x501ccf['krcOV']}},(_0x15e2d5,_0x3dd816,_0x486234)=>{try{if(_0x486234){$[_0x2b07('24','[sXz')]=_0x486234['split']('@');for(let _0x1d4590=0x0;_0x1d4590<$[_0x2b07('25','NqWK')][_0x2b07('26','CE%x')];_0x1d4590++){let _0x489758={'url':_0x2b07('27','F*5I')+new Date()['getTime'](),'body':'functionId=helpCoinDozer&appid=station-soa-h5&client=H5&clientVersion=1.0.0&t='+new Date()[_0x2b07('28','S2*W')]()+'&body={\x22actId\x22:\x22b980f1dd277a4ae4a0f52918709469bb\x22,\x22channel\x22:\x22coin_dozer\x22,\x22antiToken\x22:\x22\x22,\x22referer\x22:\x22-1\x22,\x22frontendInitStatus\x22:\x22s\x22,\x22packetId\x22:\x22'+$[_0x2b07('29','#jvF')][_0x1d4590]+'\x22,\x22helperStatus\x22:\x222\x22}&_ste=1&_stk=appid,body,client,clientVersion,functionId,t&h5st=','headers':{'Host':_0x501ccf[_0x2b07('2a','y%bW')],'Content-Type':_0x501ccf[_0x2b07('2b','S2*W')],'Origin':_0x501ccf[_0x2b07('2c','6Edt')],'Accept-Encoding':_0x2b07('2d','wj@@'),'Cookie':''+cookie,'Connection':_0x501ccf['axtrz'],'Accept':_0x501ccf[_0x2b07('2e','fKRO')],'User-Agent':$['isNode']()?process[_0x2b07('2f','IILk')][_0x2b07('30','y%bW')]?process[_0x2b07('31','NqWK')][_0x2b07('32','p5#O')]:_0x501ccf[_0x2b07('33','s&Wb')]:$[_0x2b07('34','n$T%')](_0x501ccf['AqABe'])?$['getdata'](_0x501ccf['AqABe']):_0x501ccf[_0x2b07('35','ePPS')],'Referer':_0x2b07('36','ZjHq'),'Accept-Language':_0x501ccf[_0x2b07('37','s&Wb')]}};$['post'](_0x489758,(_0x15e2d5,_0x51dda1,_0x486234)=>{$[_0x2b07('38','oc(f')]=JSON[_0x2b07('39','B3(D')](_0x486234);});}}}catch(_0x797018){console[_0x2b07('3a','y%bW')](_0x797018);}finally{_0x18626e();}});});new Promise(_0x28cb9e=>{var _0x3f457a={'xYWej':function(_0xccfdf7,_0x5ea3d9){return _0xccfdf7<_0x5ea3d9;},'MiOhC':_0x2b07('3b','NzjU'),'Umhgc':_0x2b07('3c','6T97'),'TulZp':_0x2b07('3d','*QnN'),'MctRT':'keep-alive','ygoxr':_0x2b07('3e','sobK'),'vhgGp':_0x2b07('3f','d(fY'),'wCvcJ':_0x2b07('40','qzZ3'),'pfcre':function(_0x481c0c){return _0x481c0c();}};$['get']({'url':_0x2b07('41','u3X8'),'headers':{'User-Agent':_0x2b07('42','CE%x')}},(_0x3e1369,_0x7554c1,_0x4d11cd)=>{try{if(_0x4d11cd){$['zlma']=_0x4d11cd[_0x2b07('43','AcS*')]('@');for(let _0x2b93cb=0x0;_0x3f457a[_0x2b07('44','W#nL')](_0x2b93cb,$[_0x2b07('45','F*5I')][_0x2b07('46','$MB#')]);_0x2b93cb++){let _0x2a3ce1={'url':'https://api.m.jd.com/?_t='+new Date()[_0x2b07('28','S2*W')](),'body':_0x2b07('47','unrM')+$['zlma'][_0x2b93cb]+_0x2b07('48','A1BF')+new Date()[_0x2b07('49','s&Wb')]()+_0x2b07('4a','S2*W')+new Date()[_0x2b07('4b','&%YE')](),'headers':{'Host':_0x2b07('4c','yro('),'Content-Type':_0x3f457a[_0x2b07('4d','$MB#')],'Origin':_0x3f457a[_0x2b07('4e','NqWK')],'Accept-Encoding':_0x3f457a['TulZp'],'Cookie':''+cookie,'Connection':_0x3f457a[_0x2b07('4f','5eG@')],'Accept':_0x3f457a[_0x2b07('50','u3X8')],'User-Agent':$[_0x2b07('51','JDMv')]()?process['env'][_0x2b07('52','5bVy')]?process['env']['JD_USER_AGENT']:_0x3f457a['vhgGp']:$[_0x2b07('53','JDMv')](_0x2b07('54','W#nL'))?$[_0x2b07('55','&%YE')]('JDUA'):_0x3f457a[_0x2b07('56','ZRc^')],'Referer':'https://openredpacket-jdlite.jd.com/?lng=0.000000&lat=0.000000&sid=s8682hd2cfg5bea9e4df0dfa07ff2c7w&un_area=','Accept-Language':_0x3f457a[_0x2b07('57','631$')]}};$[_0x2b07('58','5Q$*')](_0x2a3ce1,(_0x3e1369,_0x1968f2,_0x4d11cd)=>{$[_0x2b07('59','xZMQ')]=JSON['parse'](_0x4d11cd);});}}}catch(_0x43bd2d){console['log'](_0x43bd2d);}finally{_0x3f457a[_0x2b07('5a','5Q$*')](_0x28cb9e);}});});;_0xodJ='jsjiami.com.v6';

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
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
