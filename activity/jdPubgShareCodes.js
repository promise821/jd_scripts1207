/*
pubg互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写pubg的好友码。
// github action用户的好友互助码填写到Action->Settings->Secrets->new Secret里面(Name填写 PetShareCodes(此处的Name必须按此来写,不能随意更改),内容处填写互助码,填写规则如下)
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let PubgShareCodes = [
  '728f8529-fe21-41f1-8f50-150c4f8f6ba8@8e704a3a-8008-477f-a98f-64f20c555a45@eae2df48-9dab-4d36-bd4d-66d13899872b@f60d45de-9f17-444b-a49c-37c89c71dfe6@bb7ce024-b783-4b42-8d0e-c5f2c1d8162f@afe8d0b3-3252-41e0-ba0661b4fe30f5d4@cd8ccc1d-ff39-468a-aa23-d202dc5f55f6@a593d502-f219-40af-9259-dbefddbeacd8',//账号一的好友shareCode,不同好友中间用@符号隔开
  '728f8529-fe21-41f1-8f50-150c4f8f6ba8@8e704a3a-8008-477f-a98f-64f20c555a45@eae2df48-9dab-4d36-bd4d-66d13899872b@f60d45de-9f17-444b-a49c-37c89c71dfe6@bb7ce024-b783-4b42-8d0e-c5f2c1d8162f@afe8d0b3-3252-41e0-ba0661b4fe30f5d4@cd8ccc1d-ff39-468a-aa23-d202dc5f55f6@a593d502-f219-40af-9259-dbefddbeacd8',//账号二的好友shareCode，不同好友中间用@符号隔开
]
// 判断github action里面是否有pubg互助码
if (process.env.PUBGSHARECODES) {
  if (process.env.PUBGSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东萌宠互助码选择的是用&隔开\n`)
    PubgShareCodes = process.env.PUBGSHARECODES.split('&');
  } else if (process.env.PETSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东萌宠互助码选择的是用换行隔开\n`)
    PubgShareCodes = process.env.PUBGSHARECODES.split('\n');
  } else {
    PubgShareCodes = process.env.PUBGSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < PubgShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['PubgShareCode' + index] = PubgShareCodes[i];
}