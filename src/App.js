import React, { Component } from 'react';

import {Parser} from './exprEval/parser'



async function test(){

        
    //Parser属性 evaluate 和parse
    console.log("Parser属性",Parser.prototype)




//====== Parser.evaluate(expr, vars) 等价于 Parser.parse(expr).evaluate(vars).=======
    var parser = new Parser({
        operators: {
            'in': true,
        }
    });

    var expr = parser.parse('2 * x + 1');
    console.log(await expr.evaluate({ x: 3 })," Parser.parse(expr).evaluate(vars)"); //(2*3+1) 7
    // or
    // 42
    console.log(await Parser.evaluate('6 * x', { x: 7 }),"Parser.evaluate(expression: string, variables?: object)")



//====== Parser.parse("x * (y * atan(1))").XXXXX ======

    //1.substitute(variable: string, expression: Expression | string | number) 
    //创建一个新的表达式去代替另一个表达

    expr = Parser.parse("2 * x + 1").substitute("x", "4 * x");
    console.log(await expr.evaluate({ x: 3 }),"创建新表达式代替参数substitute(variable: string, expression: Expression | string | number)")


    //2.simplify(variables: object) 简化常量子表达式
    expr = Parser.parse("x * (y * Atan(1))").simplify({ y: 4 }); //(x*(4*atan(1)))
    console.log(await expr.evaluate({ x: 2 }),"simplify")

    //3.variables(options?: object)//得到一组没有绑定值得参数
    //variables默认返回一级的对象Parser.parse(x.y.z).variables() returns ['x']，返回多级设置{ withMembers: true }，如Parser.parse(x.y.z).variables({ withMembers: true })，return ['x.y.z']
    expr = Parser.parse("x * (y * Atan(1))");
    console.log("x,y没有赋值",await expr.variables())   //["x","y"]
    console.log("x没有赋值",await expr.simplify({ y: 4 }).variables()) //["x"]

    //4.symbols(options?: object) 得到一组值，包含创建的函数名和参数名
    //option接受一个参数，同上{ withMembers: true }包含对象成员

    expr = Parser.parse("Min(x, y, z)");
    console.log("Min(x, y, z)",await expr.symbols()) //["min", "x", "y", "z"]
    console.log("传入y、z",await expr.simplify({ y: 4, z: 5 }).symbols())  //["min", "x"]

    //5.toString()  转化一个表达式为字符串包括每个子表达式（文字、变量和函数除外）,故它对于调试优先级错误非常有用
    console.log(Parser.parse("2 * x + 1").toString()) //((2 * x) + 1)

    //6.toJSFunction(parameters: array | string, variables?: object) 将表达式转换为函数
    expr = Parser.parse("x + y + z")
    var f = expr.toJSFunction("x,y,z");
    console.log("(x + y + z)  => function(x,y,z){return x+y+z}", f(1,2,3))

    //调换参数的位置
    f=expr.toJSFunction("y,z", { x: 100 });
    console.log("(x + y + z)  => function(y,z){return 100+y+z}",f(2,3))




// ======= 自定义函数  ========
    // Add a new function
    parser.functions.customAddFunction = function (arg1, arg2) {
        return arg1 + arg2;
    };

    console.log("自定义函数customAddFunction",await parser.evaluate('customAddFunction(2, 4)+2')); // true
    console.log(parser.functions)

    // 删除预定函数操作,fac函数已弃用，启用! operator 代替
    delete parser.functions.fac; 
    //parser.evaluate('fac(3)'); // This will fail

    //预定于函数表
    // Function     | Description
    // :----------- | :----------
    // random(n)    | 在[0,n]范围内得到一个随机数，如果n为0，或者没有提供，则默认值为1。
    // min(a,b,…)   | Get the smallest (minimum) number in the list
    // max(a,b,…)   | Get the largest (maximum) number in the list
    // hypot(a,b)   | 参数平方和的平方根
    // pyt(a, b)    | hypot的别名
    // pow(x, y)    | Equivalent to x^y. For consistency with JavaScript's Math object.
    // atan2(y, x)  | Arc tangent of x/y. i.e. the angle between (0, 0) and (x, y) in radians.
    // if(c, a, b)  | c ? a : b
    // roundTo(x, n)  | 小数点后x位四舍五入到n位




//============== 常量 ===============

    //预设的常量值 parser.consts
    console.log("预设的常量值",parser.consts)
    // E: 2.718281828459045
    // PI: 3.141592653589793
    // false: false
    // true: true

    //自定义常量R
    parser.consts.R = 1.234;
    console.log("自定义的常量R",parser.parse('A+B/R').toString()); //此处toString发挥用处，用于调试


//========== 例子测试 ==============

    //in 运算符只针对数组
    console.log(await parser.evaluate("'el' in str",{str:'Hello'}))  //true

    // console.error(parser.evaluate("avg(a)",{a:[1,2,3,9]}))  //true
    console.log(await parser.evaluate("a || b",{a:1,b:2}))  //true

    console.log(await parser.evaluate("x == 1?'good':'fa'",{x:1}))  //'good'

    console.log(await parser.evaluate('2 ^ x', {x: 3})) //8

    console.log(await parser.evaluate('2^x.y', {x: {y: 3}})) //8

    console.log(await parser.evaluate('\'as\' || \'df\''))//asdf


    console.log("1",await parser.evaluate('(x.z+2) + (y.a.b-1) ', {x:{z:5},y:{a:{b:10}}}) )
    console.log("2",await parser.evaluate('(x.z+2) <= (y.a.b-1)? true:false', {x:{z:5},y:{a:{b:10}}}) )
    console.log("3",await parser.evaluate('(x.z+2) <= (y.a.b-1)', {x:{z:5},y:{a:{b:7}}}) )

    console.log("4",await parser.evaluate('Sign(x)', {x:9}))

    console.log("=========test==========")
    console.log("random",await parser.evaluate("Random()+str",{str:2}))
    console.log("sign",await parser.evaluate('Sign(x)', {x:9}))
    console.log("atan2",await parser.evaluate('Atan2(x,y)',{x:2.0,y:1.0}))
    console.log("PadLeft",await parser.evaluate('PadLeft(x,y)',{x:3,y:6}))
    console.log("PadRight",await parser.evaluate('PadRight(x,y)',{x:3,y:6}))
    console.log("Replace",await parser.evaluate('Replace(x,y,z)',{x:'Visit Microsoft!',y:/Microsoft/,z:'W3School'}))
    console.log("Trim",await parser.evaluate('Trim(x)',{x:'   Hello   '}))
    console.log("Lower",await parser.evaluate('Lower(x)',{x:'HeLLo'}))
    console.log("Upper",await parser.evaluate('Upper(x)',{x:'HeLLo'}))
    console.log("Substring",await parser.evaluate('Substring(x,y,z)',{x:'HeLLo',y:2,z:4}))
    console.log("Ceiling",await parser.evaluate('Ceiling(x)',{x:6.7}))
    console.log("Floor",await parser.evaluate('Floor(x)',{x:6.7}))
    console.log("Ascii",await parser.evaluate('Ascii(x)',{x:'a'}))
    console.log("FromCharCode",await parser.evaluate('FromCharCode(x)',{x:97}))

}


class Test extends Component {
    componentWillMount(){
        test()
    }
    render() {
        return (
            <div>
                查看控制台
            </div>
        );
    }
}

export default Test;
