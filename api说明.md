参考：https://github.com/silentmatt/expr-eval#operator-precedence


### 核心点四点

使用 `import {Parser} from 'expr-eval'`

1. **Parser.evaluate(expr, vars) 等价于 Parser.parse(expr).evaluate(vars).** 
    
        //Parser属性: evaluate: ƒ (expr, variables)  parse: ƒ (expr)
        console.log("Parser属性",Parser.prototype) 
        
    - expr为表达式 例如  `'2 * x + 1'`
    - vars为对象 例如 {x:2}
    
2. **Parser.parse("x * (y * atan(1))").XXXXX**
    - substitute(variable: string, expression: Expression | string | number) 创建一个新的表达式去代替另一个表达
    - simplify(variables: object) 简化常量子表达式
    - variables(options?: object) 得到一组没有绑定值得参数
    - symbols(options?: object) 得到一组值，包含创建的函数名和参数名
    - toString()  转化一个表达式为字符串包括每个子表达式（文字、变量和函数除外）,故它对于调试优先级错误非常有用
    - toJSFunction(parameters: array | string, variables?: object) 将表达式转换为函数
3. 函数

    - 预设函数
  
        | Function      | Description                                                              |
        | :------------ | :----------------------------------------------------------------------- |
        | random(n)     | 在[0,n]范围内得到一个随机数，如果n为0，或者没有提供，则默认值为1。       |
        | min(a,b,…)    | Get the smallest (minimum) number in the list                            |
        | max(a,b,…)    | Get the largest (maximum) number in the list                             |
        | hypot(a,b)    | 参数平方和的平方根                                                       |
        | pyt(a, b)     | hypot的别名                                                              |
        | pow(x, y)     | Equivalent to x^y. For consistency with JavaScript's Math object.        |
        | atan2(y, x)   | Arc tangent of x/y. i.e. the angle between (0, 0) and (x, y) in radians. |
        | if(c, a, b)   | c ? a : b                                                                |
        | roundTo(x, n) | 小数点后x位四舍五入到n位                                                 |
        | fac(n)        | 弃用，采用!operator代替                                                  |

        使用
      
            var parser = new Parser();
            parser.evaluate('max(3,4)');

    - 自定义函数

            var parser = new Parser();
            parser.functions.customAddFunction = function (arg1, arg2) {
                return arg1 + arg2;
            };
            console.log("自定义函数customAddFunction",parser.evaluate('customAddFunction(2, 4) == 6')); 
            // true

    - 删除定义的函数

            delete parser.functions.fac; 

4. 常量

    - 预设常量（parser.consts.E）

        | Constant | Description                                         |
        | :------- | :-------------------------------------------------- |
        | E        | The value of `Math.E` from your JavaScript runtime  |
        | PI       | The value of `Math.PI` from your JavaScript runtime |
        | true     | Logical `true` value                                |
        | false    | Logical `false` value                               |

        
    - 自定义常量

            parser.consts.R = 1.234;
            console.log("自定义的常量R",parser.parse('A+B/R').toString()); 
            //此处toString发挥用处，用于调试

5. 附加 表达式表

    基础操作符表

    | Operator                 | Associativity | Description                                                                                                          |
    | :----------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------- |
    | (...)                    | None          | Grouping                                                                                                             |
    | f(), x.y                 | Left          | Function call, property access                                                                                       |
    | !                        | Left          | Factorial                                                                                                            |
    | ^                        | Right         | Exponentiation                                                                                                       |
    | +, -, not, sqrt, etc.    | Right         | Unary prefix operators (see below for the full list)                                                                 |
    | \*, /, %                 | Left          | Multiplication, division, remainder                                                                                  |
    | +, -, \|\|               | Left          | Addition, subtraction, concatenation                                                                                 |
    | ==, !=, >=, <=, >, <, in | Left          | Equals, not equals, etc. "in" means "is the left operand included in the right array operand?" (disabled by default) |
    | and                      | Left          | Logical AND                                                                                                          |
    | or                       | Left          | Logical OR                                                                                                           |
    | x ? y : z                | Right         | Ternary conditional (if x then y else z)                                                                             |

    **对操作符进行设置**

        var parser = new Parser({
        operators: {
            // These default to true, but are included to be explicit
            add: true,
            concatenate: true,
            conditional: true,
            divide: true,
            factorial: true,
            multiply: true,
            power: true,
            remainder: true,
            subtract: true,

            // Disable and, or, not, <, ==, !=, etc.
            logical: false,
            comparison: false,

            // The in operator is disabled by default in the current version
            'in': true
        }
        });


    一元操作符表   
    | Operator | Description                                                                  |
    | :------- | :--------------------------------------------------------------------------- |
    | -x       | Negation                                                                     |
    | +x       | Unary plus. This converts it's operand to a number, but has no other effect. |
    | x!       | Factorial (x * (x-1) * (x-2) * … * 2 * 1). gamma(x + 1) for non-integers.    |
    | abs x    | Absolute value (magnatude) of x                                              |
    | acos x   | Arc cosine of x (in radians)                                                 |
    | acosh x  | Hyperbolic arc cosine of x (in radians)                                      |
    | asin x   | Arc sine of x (in radians)                                                   |
    | asinh x  | Hyperbolic arc sine of x (in radians)                                        |
    | atan x   | Arc tangent of x (in radians)                                                |
    | atanh x  | Hyperbolic arc tangent of x (in radians)                                     |
    | ceil x   | Ceiling of x — the smallest integer that’s >= x                            |
    | cos x    | Cosine of x (x is in radians)                                                |
    | cosh x   | Hyperbolic cosine of x (x is in radians)                                     |
    | exp x    | e^x (exponential/antilogarithm function with base e)                         |
    | floor x  | Floor of x — the largest integer that’s <= x                               |
    | length x | String length of x                                                           |
    | ln x     | Natural logarithm of x                                                       |
    | log x    | Natural logarithm of x (synonym for ln, not base-10)                         |
    | log10 x  | Base-10 logarithm of x                                                       |
    | not x    | Logical NOT operator                                                         |
    | round x  | X, rounded to the nearest integer, using "gradeschool rounding"              |
    | sin x    | Sine of x (x is in radians)                                                  |
    | sinh x   | Hyperbolic sine of x (x is in radians)                                       |
    | sqrt x   | Square root of x. Result is NaN (Not a Number) if x is negative.             |
    | tan x    | Tangent of x (x is in radians)                                               |
    | tanh x   | Hyperbolic tangent of x (x is in radians)                                    |
    | trunc x  | Integral part of a X, looks like floor(x) unless for negative number         |



