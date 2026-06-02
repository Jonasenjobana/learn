# Python 基础 Day1-Day5 总览

这份总览用于快速定位已经学过的内容。

当前路线更适合有 JavaScript 基础的人：不重复花太多时间在通用编程概念上，而是重点补 Python 特有语法、文件处理、AI 应用前置能力。

## Day1：基础语法与入门练习

目录：[day1](./day1/)

重点：

- 输入输出
- 类型转换
- 条件判断
- 简单循环
- 基础练习答案合集

文件：

- [学习文档](./day1/README.md)
- [练习题](./day1/练习题.md)
- [答案合集](./day1/train.py)
- [临时代码](./day1/index.py)

适合目标：

- 熟悉 `input()`、`print()`、`int()`、`f-string`
- 先把 Python 最基本的运行方式跑起来

## Day2：Python 速通（JavaScript 基础版）

目录：[day2](./day2/)

重点：

- Python 和 JavaScript 的差异
- `None`
- truthy / falsy
- 切片
- 解包
- `list` / `dict` / `tuple` / `set`
- `enumerate()` / `zip()`
- 列表推导式

文件：

- [学习文档](./day2/README.md)
- [练习题](./day2/练习题.md)
- [示例代码](./day2/index.py)

适合目标：

- 把 JS 思维快速切到 Python
- 掌握 Python 常见的数据处理写法

## Day3：类与对象

目录：[day3](./day3/)

重点：

- `class`
- `self`
- `__init__`
- 实例属性
- 类属性
- 方法
- 继承
- 方法重写
- `super()`
- `@classmethod`
- `@staticmethod`
- `@property`
- 魔术方法

文件：

- [学习文档](./day3/README.md)
- [练习题](./day3/练习题.md)
- [基础示例](./day3/index.py)
- [进阶文档](./day3/进阶.md)
- [进阶示例](./day3/进阶示例.py)

适合目标：

- 看懂 Python 项目里的类
- 为后续 LangChain、FastAPI、Pydantic 等库打基础

## Day4：函数进阶与异常处理

目录：[day4](./day4/)

重点：

- 默认参数
- 关键字参数
- `*args`
- `**kwargs`
- 解包传参
- 返回多个值
- 作用域
- `lambda`
- `try / except`
- `raise`

文件：

- [学习文档](./day4/README.md)
- [练习题](./day4/练习题.md)
- [示例代码](./day4/index.py)

适合目标：

- 写出更灵活的函数
- 理解 Python 函数参数和 JS 函数参数的差异
- 会处理输入错误、除零、文件不存在等异常

## Day5：文件读写、JSON 与 CSV

目录：[day5](./day5/)

重点：

- `with open(...)`
- 文件模式 `r` / `w` / `a`
- `pathlib`
- 文本读写
- JSON 读写
- CSV 读写
- 文件异常处理

文件：

- [学习文档](./day5/README.md)
- [练习题](./day5/练习题.md)
- [示例代码](./day5/index.py)

适合目标：

- 为后续知识库、RAG、数据处理做准备
- 理解 Python 怎么处理本地文件、配置、表格数据

## 专题文档

- [Python 数据类型与类](./数据类型与类.md)
- [Python 解包](./解包.md)
- [Python 与 JavaScript 对比](./JavaScript对比.md)

## 后续建议

学完 Day1-Day5 后，建议继续：

1. Day6：模块、包、pip、虚拟环境
2. Day7：FastAPI 基础
3. Day8：requests / httpx 调接口
4. Day9：SQLite 基础
5. Day10：LangChain + 简单知识库
