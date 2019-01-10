export var INUMBER = 'INUMBER';//数字
export var IOP1 = 'IOP1'; //一元运算符
export var IOP2 = 'IOP2';  //二元运算符
export var IOP3 = 'IOP3'; //三元运算符
export var IVAR = 'IVAR'; //常量
export var IFUNCALL = 'IFUNCALL';  //函数调用
export var IEXPR = 'IEXPR';  //解析器
export var IMEMBER = 'IMEMBER';  //成员

//传入的值，组装成一个Instruction类的对象{type:XX,value:XXX}
export function Instruction(type, value) {
  this.type = type;
  this.value = (value !== undefined && value !== null) ? value : 0;
}

Instruction.prototype.toString = function () {
  switch (this.type) {
    case INUMBER:
    case IOP1:
    case IOP2:
    case IOP3:
    case IVAR:
      return this.value;
    case IFUNCALL:
      return 'CALL ' + this.value;
    case IMEMBER:
      return '.' + this.value;
    default:
      return 'Invalid Instruction';
  }
};
//一元
export function unaryInstruction(value) {
  return new Instruction(IOP1, value);
}
//二元
export function binaryInstruction(value) {
  return new Instruction(IOP2, value);
}
//三目
export function ternaryInstruction(value) {
  return new Instruction(IOP3, value);
}
