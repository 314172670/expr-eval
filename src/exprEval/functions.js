/**
 * 函数计算
 */
import contains from './contains';
import like from './like'

export function Add(a, b) {
  return Number(a) + Number(b);
}

export function Sub(a, b) {
  return a - b;
}

export function Mul(a, b) {
  return a * b;
}

export function Div(a, b) {
  return a / b;
}

export function Mod(a, b) {
  return a % b;
}

export function Concat(a, b) {
  return '' + a + b;
}

export function Equal(a, b) {
  return a === b;
}

export function NotEqual(a, b) {
  return a !== b;
}

export function GreaterThan(a, b) {
  return a > b;
}

export function LessThan(a, b) {
  return a < b;
}

export function GreaterThanEqual(a, b) {
  return a >= b;
}

export function LessThanEqual(a, b) {
  return a <= b;
}

export function AndOperator(a, b) {
  return Boolean(a && b);
}

export function OrOperator(a, b) {
  return Boolean(a || b);
}

export function InOperator(a, b) {
  return contains(b, a);
}
//like 运算符
export function LikeOperator(a,b){
  return like(b, a)
}

export function Sinh(a) {
  return ((Math.exp(a) - Math.exp(-a)) / 2);
}

export function Cosh(a) {
  return ((Math.exp(a) + Math.exp(-a)) / 2);
}

export function Tanh(a) {
  if (a === Infinity) return 1;
  if (a === -Infinity) return -1;
  return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
}

export function Asinh(a) {
  if (a === -Infinity) return a;
  return Math.log(a + Math.sqrt((a * a) + 1));
}

export function Acosh(a) {
  return Math.log(a + Math.sqrt((a * a) - 1));
}

export function Atanh(a) {
  return (Math.log((1 + a) / (1 - a)) / 2);
}

export function Log10(a) {
  return Math.log(a) * Math.LOG10E;
}

export function Neg(a) {
  return -a;
}

export function Not(a) {
  return !a;
}

export function Trunc(a) {
  return a < 0 ? Math.ceil(a) : Math.floor(a);
}

export function Random(a) {
  // return new Promise((resolve)=>{
  //   setTimeout(()=>
  //     resolve(Math.random() * (a || 1))
  //   ,1000)
  // })
  // setTimeout(()=>
  // console.log("-----------") 
  // ,1000)
  return Math.random() * (a || 1)
}

export function Factorial(a) { // a!
  return Gamma(a + 1);
}

function isInteger(value) {
  return isFinite(value) && (value === Math.round(value));
}

var GAMMA_G = 4.7421875;
var GAMMA_P = [
  0.99999999999999709182,
  57.156235665862923517, -59.597960355475491248,
  14.136097974741747174, -0.49191381609762019978,
  0.33994649984811888699e-4,
  0.46523628927048575665e-4, -0.98374475304879564677e-4,
  0.15808870322491248884e-3, -0.21026444172410488319e-3,
  0.21743961811521264320e-3, -0.16431810653676389022e-3,
  0.84418223983852743293e-4, -0.26190838401581408670e-4,
  0.36899182659531622704e-5
];

// Gamma function from math.js
export function Gamma(n) {
  var t, x;

  if (isInteger(n)) {
    if (n <= 0) {
      return isFinite(n) ? Infinity : NaN;
    }

    if (n > 171) {
      return Infinity; // Will overflow
    }

    var value = n - 2;
    var res = n - 1;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res === 0) {
      res = 1; // 0! is per definition 1
    }

    return res;
  }

  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * Gamma(1 - n));
  }

  if (n >= 171.35) {
    return Infinity; // will overflow
  }

  if (n > 85.0) { // Extended Stirling Approx
    var twoN = n * n;
    var threeN = twoN * n;
    var fourN = threeN * n;
    var fiveN = fourN * n;
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
      (1 + (1 / (12 * n)) + (1 / (288 * twoN)) - (139 / (51840 * threeN)) -
      (571 / (2488320 * fourN)) + (163879 / (209018880 * fiveN)) +
      (5246819 / (75246796800 * fiveN * n)));
  }

  --n;
  x = GAMMA_P[0];
  for (var i = 1; i < GAMMA_P.length; ++i) {
    x += GAMMA_P[i] / (n + i);
  }

  t = n + GAMMA_G + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

export function StringLength(s) {
  return String(s).length;
}

export function Hypot() {
  var sum = 0;
  var larg = 0;
  for (var i = 0; i < arguments.length; i++) {
    var arg = Math.abs(arguments[i]);
    var div;
    if (larg < arg) {
      div = larg / arg;
      sum = (sum * div * div) + 1;
      larg = arg;
    } else if (arg > 0) {
      div = arg / larg;
      sum += div * div;
    } else {
      sum += arg;
    }
  }
  return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
}

export function Condition(cond, yep, nope) {
  return cond ? yep : nope;
}

/**
* Decimal adjustment of a number.
* From @escopecz.
*
* @param {Number} value The number.
* @param {Integer} exp  The exponent (the 10 logarithm of the adjustment base).
* @return {Number} The adjusted value.
*/
export function RoundTo(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  value = +value;
  exp = -(+exp);
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}



// ======增加部分 =======
/**
 * //数值类-多值运算比较
 *  FuncName="Avg" Des="Avg平均" 
    FuncName="Count" Des="计数" 
    FuncName="Max" Des="最大" 
    FuncName="Min" Des="最小" 
    FuncName="Sum" Des="和" 
    FuncName="Exists" Des="存在" (使用in 代替))
 * 
 */
//平均数
export function Avg(array){
  return Sum(array)/array.length;
}
//计数
export function Count(array){
 return array.length;
}
//最大值
export function Max(array){
  return Math.max(...array)
}
//最小值
export function Min(array){
  return Math.min(...array)
  
}
//求和
export function Sum(array){
  return array.reduce(function(x, y){
    return x + y;
  });
}

/**
 * 
 * //数值类-单值运算处理 
 * FuncName="Reverse" Des="反转" 
 * FuncName="Sign" Des="返回实参的符号" 
 * FuncName="BigMul" Des="乘积" 
 */

//返回实参的符号
export function Sign(number){
  let re=Math.sign(number);
  if(re){
    return '+'
  }else{
    return '-'
  }
}



/** 
//字符串类-单值运算处理
FuncName="PadLeft" Des="左补齐" 
FuncName="PadRight" Des="右补齐" 
FuncName="Remove" Des="移去" 
FuncName="Replace" Des="字符替换" 
FuncName="Trim" Des="去除空白" 
FuncName="Lower" Des="小写" 
FuncName="Upper" Des="转成大写" 
FuncName="Substring" Des="字串中取值" 
*/

//左补齐
export function PadLeft(num, n) {  
  let re='00000000000000000000000000000'+num; 
  return re.substr(re.length-n);  
} 

//右补齐
export function PadRight(num, n) {  
  let re= num +'00000000000000000000000000000'; 

  return re.substr(0,n);  
} 

//字符替换

export function Replace(str,substr,replacement){

  return str.replace(substr,replacement)
}

//去除空白
export function Trim(str){

  return str.trim();
}

//小写
export function Lower(str){

  return str.toLowerCase()
}

//大写
export function Upper(str){

  return str.toUpperCase()
}

//截取字符串
export function Substring(str,start,end){
  
  return str.substring(start,end)
}


//常量

//将字母转为Ascii
export function Ascii(str){

  return str.charCodeAt(str)
}


export function UnaryOperatorBitwiseNot(num){

  return ~num;
}
