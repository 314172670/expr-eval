export var TEOF = 'TEOF'; //结束
export var TOP = 'TOP';  //开始
export var TNUMBER = 'TNUMBER';  //数字
export var TSTRING = 'TSTRING';  //字符串
export var TPAREN = 'TPAREN';  //括号
export var TCOMMA = 'TCOMMA';  //逗号
export var TNAME = 'TNAME'; //名字

export function Token(type, value, index) {
  this.type = type;  //类型
  this.value = value;  //值
  this.index = index;  //序号
}

Token.prototype.toString = function () {
  return this.type + ': ' + this.value;
};
