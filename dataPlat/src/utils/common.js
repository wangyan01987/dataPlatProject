// 时间格式化
export function dateFormat() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// 另一个格式化日期
export function  getDate(val){
  let date = new Date();
  if(val){
    date = new Date(val)
  }
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  month = month>=10?month:`0${month}`;
  let newVal = `${year}-${month}-${date.getDate()>=10?date.getDate():`0${date.getDate()}`}`
  return newVal;
}

// 获取字节长度
export function getBaseLength(val) {
  let reg = /^[\u4e00-\u9fa5]|[a-zA-Z]$/;
  let totalLength = 0;
  for (let i = 0; i < val.length; i++) {
    let c = val.charAt(i);
    if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
    {
      totalLength += 1;
    }
    else {
      totalLength += 2;
    }
  }
  if (reg.test(val) && totalLength <= 8) {
    return true
  } else {
    return false
  }
}

// 身份证号验证
export function CheckIDCard(card) {
  // 1 "验证通过!", 0 //校验不通过
  let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(card)) {
    return false;//{ 'status': 0, 'msg': '身份证号码不合规' };
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  let year = card.substr(6, 4),//身份证年
    month = card.substr(10, 2),//身份证月
    date = card.substr(12, 2),//身份证日
    time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
    now_time = Date.parse(new Date()),//当前时间戳
    dates = (new Date(year, month, 0)).getDate();//身份证当月天数
  if (time > now_time || date > dates) {
    //return { 'status': 0, 'msg': '出生日期不合规' }
    return false;
  }
  //校验码判断
  let c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
  let b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
  let id_array = card.split("");
  let sum = 0;
  for (let k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    //return { 'status': 0, 'msg': '身份证校验码不合规' }
    return false;
  }
  return true;//{ 'status': 1, 'msg': '校验通过' }
}


//纯移动手机验证
export function isOnlyMobile(val) {
  let str = val.trim();
  let reg = /^[1][3,4,5,7,8,6][0-9]{9}$/;
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}
//固话
export function isPhone(val){
  let reg=/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  if(reg.test(val.trim())){
    return true;
  }
  else {
    return false;
  }
}

export function isPassword(val) {
  let str = val.trim();
  let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![_]+$).{6,16}$/;
  let reg1 = /^[a-zA-Z0-9_]{6,16}$/
  if (reg.test(str) & reg1.test(str)) {
    return true;
  } else {
    return false;
  }
}


export function objKeySort(obj) {//排序的函数
  var newKey=Object.keys(obj).sort();  //是一个数组
  var newObj={};
  let str='';
  newKey.forEach(function(item,index){
    newObj[item]=obj[item];
    if(index===newKey.length-1){
      str+=item+'='+obj[item];
    }
    else{
      str+=item+'='+obj[item]+'&'
    }
  });
  return str;
}
//URL验证
export function url(val){
  let str=val.trim();
  let reg=/(http|https|HTTP|HTTPS)[:：]\/\/([\w.-:：]+)/;
  return reg.test(str);
}
//emailbox验证
export function email(val){
  let str=val.trim();
  let reg= /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
  return reg.test(str);
}
//信用代码
export function isSocialCreditCode(val) {
  let str = val.trim();
  let reg = /^[A-Z0-9]{18}$/;
  return reg.test(str);

}
//项目名称校验 中英文字符6-20
export function isName(val){
  let str=val.trim();
  let reg= /^[\u4e00-\u9fa5\w\']{1,50}$/;
  return reg.test(str);
}
//项目编号
export function isNum(val){
  let str=val.trim();
  let reg=/^[\w\']{1,50}$/;
  return reg.test(str);
}

