import { INUMBER, IOP1, IOP2, IOP3, IVAR, IFUNCALL, IEXPR, IMEMBER } from './instruction';
import { resolve } from 'path';


//计算函数
//例子   console.log(parser.evaluate("'el' in str",{str:'Hello'}))  //true

//传入的表达式
// tokens = [
// 0: Instruction {type: "INUMBER", value: "el"}
// 1: Instruction {type: "IVAR", value: "str"}
// 2: Instruction {type: "IOP2", value: "in"}
// ]

//包含的函数
//expr
// binaryOps: {+: ƒ, -: ƒ, *: ƒ, /: ƒ, %: ƒ, …}
// functions: {random: ƒ, min: ƒ, max: ƒ, count: ƒ, avg: ƒ, …}
// parser: Parser {options: {…}, unaryOps: {…}, binaryOps: {…}, ternaryOps: {…}, functions: {…}, …}
// ternaryOps: {?: ƒ}
// tokens: (3) [Instruction, Instruction, Instruction]
// unaryOps: {sin: ƒ, cos: ƒ, tan: ƒ, asin: ƒ, acos: ƒ, …} 

//传入的值values
//values ={str:'Hello'}
export default  async function evaluate(tokens, expr, values) {
  var nstack = [];
  var n1, n2, n3;
  var f;
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {   //判断类型数字
      nstack.push(item.value);
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === 'and') {  //如果是 && 继续递归调用
        nstack.push(n1 ? !!evaluate(n2, expr, values) : false);
      } else if (item.value === 'or') {   //同上
        nstack.push(n1 ? true : !!evaluate(n2, expr, values));
      } else {
        f = expr.binaryOps[item.value];
        let fmt= await f(n1,n2)
        nstack.push(fmt);  //f(n1,n2) 执行二元运算  in(el,Hello) 返回true
      }
    } else if (type === IOP3) {  //判断类型是三目运算
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === '?') {
        nstack.push(evaluate(n1 ? n2 : n3, expr, values));
      } else {
        f = expr.ternaryOps[item.value];
        let fu=await f(n1,n2,n3)
        nstack.push(fu);
      }
    } else if (type === IVAR) {  //常量
      if (item.value in expr.functions) {  //判断是否是函数关键字
        let fu=await expr.functions[item.value];
        nstack.push(fu);
      } else {
        var v = values[item.value];
        if (v !== undefined) {
          nstack.push(v);
        } else {
          throw new Error('undefined variable: ' + item.value);
        }
      }
    } else if (type === IOP1) {  //判断是一元运算
      n1 = nstack.pop();
      f = expr.unaryOps[item.value];
      let fu=await f(n1)
      nstack.push(fu);
    } else if (type === IFUNCALL) {  //函数调用
      var argCount = item.value;
      var args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      f = nstack.pop();
      if (f.apply && f.call) {
        let fu= await f.apply(undefined, args)
        nstack.push(fu);
      } else {
        throw new Error(f + ' is not a function');
      } 
    } else if (type === IEXPR) {  //解析器
      nstack.push(item.value);
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1[item.value]);
    } else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    throw new Error('invalid Expression (parity)');
  }
 
   return nstack[0];
}
