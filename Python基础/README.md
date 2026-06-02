# Python 基础入门

这套内容面向有 JavaScript / 前端基础的人，用 Python 补齐 AI 应用开发需要的核心能力。

推荐先看总览，再按 day 学习：

- [Day1-Day5 总览](./Day1-Day5总览.md)
- [Python 与 JavaScript 对比](./JavaScript对比.md)
- [Python 数据类型与类](./数据类型与类.md)
- [Python 解包](./解包.md)

## 阶段目录

| 阶段 | 主题 | 入口 |
| --- | --- | --- |
| Day1 | 基础语法与入门练习 | [day1](./day1/) |
| Day2 | Python 速通（JavaScript 基础版） | [day2](./day2/) |
| Day3 | 类与对象、继承、魔术方法 | [day3](./day3/) |
| Day4 | 函数进阶与异常处理 | [day4](./day4/) |
| Day5 | 文件读写、JSON 与 CSV | [day5](./day5/) |

## 学习目标

学完 Day1-Day5 后，应能够：

- 看懂常见 Python 代码。
- 使用 Python 处理列表、字典、JSON、CSV。
- 写函数、类、异常处理和文件读写。
- 理解 Python 与 JavaScript 的关键差异。
- 为后续 FastAPI、LangChain、知识库、RAG 应用打基础。

## 阶段 1：环境准备

需要先完成：

- 安装 Python。
- 学会使用命令行运行 `.py` 文件。
- 安装并使用一个代码编辑器，例如 VS Code。
- 理解 Python 文件、终端、解释器之间的关系。

建议先掌握这些命令：

```powershell
python --version
python 文件名.py
pip --version
```

## 阶段 2：基础语法

需要学习：

- 注释
- 变量
- 数字、字符串、布尔值
- 输入与输出
- 基础运算符
- 类型转换

示例：

```python
name = input("请输入你的名字：")
age = int(input("请输入你的年龄："))

print("你好，" + name)
print("明年你", age + 1, "岁")
```

练习：

- 写一个程序，输入姓名和年龄，输出一句自我介绍。
- 写一个程序，输入两个数字，输出它们的和、差、乘积、商。

## 阶段 3：条件判断

需要学习：

- `if`
- `elif`
- `else`
- 比较运算符
- 逻辑运算符 `and`、`or`、`not`

示例：

```python
score = int(input("请输入分数："))

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("需要继续努力")
```

练习：

- 判断一个数字是正数、负数还是 0。
- 根据分数输出等级。
- 判断用户输入的年份是否可能是闰年。

## 阶段 4：循环

需要学习：

- `for` 循环
- `while` 循环
- `range`
- `break`
- `continue`

示例：

```python
for i in range(1, 6):
    print("第", i, "次学习 Python")
```

练习：

- 输出 1 到 100。
- 计算 1 到 100 的和。
- 猜数字小游戏。

## 阶段 5：常见数据结构

需要学习：

- 列表 `list`
- 元组 `tuple`
- 字典 `dict`
- 集合 `set`
- 字符串常用操作

示例：

```python
scores = {
    "小明": 88,
    "小红": 95,
    "小刚": 76,
}

for name, score in scores.items():
    print(name, score)
```

练习：

- 用列表保存 5 个分数，计算平均分。
- 用字典保存学生姓名和分数，输出最高分学生。
- 统计一段文字中每个字出现的次数。

专题详解：

- [Python 数据类型与类](./数据类型与类.md)

## 阶段 6：函数

需要学习：

- 为什么需要函数
- 定义函数
- 参数
- 返回值
- 变量作用域

示例：

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)
```

练习：

- 写一个函数，判断数字是否为偶数。
- 写一个函数，计算列表平均值。
- 写一个函数，接收姓名和年龄，返回自我介绍字符串。

## 阶段 7：文件读写

需要学习：

- 打开文件
- 读取文件
- 写入文件
- `with open(...)` 的用法

示例：

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("今天开始学习 Python")

with open("note.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
```

练习：

- 写入一篇学习日记。
- 读取一个文本文件并统计字数。
- 将用户输入的待办事项保存到文件。

## 阶段 8：模块与包

需要学习：

- `import`
- 标准库
- 第三方库
- `pip install`
- 虚拟环境的基本概念

先熟悉这些标准库：

- `math`
- `random`
- `datetime`
- `os`
- `json`

示例：

```python
import random

number = random.randint(1, 10)
print(number)
```

## 阶段 9：面向对象基础

AI 入门初期不需要深入面向对象，但要能看懂基础写法。

需要学习：

- 类 `class`
- 对象
- 属性
- 方法
- `__init__`

示例：

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def introduce(self):
        print(self.name, "的分数是", self.score)

student = Student("小明", 88)
student.introduce()
```

专题详解：

- [Python 数据类型与类](./数据类型与类.md)

## 阶段 10：综合练习

完成下面的小项目：

- 命令行计算器
- 猜数字小游戏
- 学生成绩管理小程序
- 文本词频统计工具
- JSON 文件读写练习

## 推荐学习顺序

1. 环境准备
2. 基础语法
3. 条件判断
4. 循环
5. 列表和字典
6. 函数
7. 文件读写
8. 模块与包
9. 面向对象基础
10. 综合练习

## 与 AI 学习的关系

后续学习 AI 时，Python 会经常用于：

- 读取和处理数据。
- 调用模型接口。
- 编写训练脚本。
- 使用 NumPy、Pandas、Matplotlib、PyTorch 等工具。
- 搭建大模型应用、RAG 和 Agent。

因此本阶段重点不是背语法，而是多写小程序，先把代码手感练出来。
