# Day2：Python 速通（JavaScript 基础版）

如果你已经会 JavaScript，这一天就不用再花太多时间重复 `if`、`for`、`while` 这些概念了。重点应该放在 Python 和 JS 的差异，以及 Python 特别常见、后面做 AI 时会高频出现的写法。

## 学习目标

学完 Day2 后，你应该能：

- 快速把 JS 的思维切换到 Python。
- 理解 Python 的缩进、类型、`None`、可变与不可变。
- 熟练使用 `list`、`dict`、`tuple`、`set`。
- 看懂切片、推导式、解包、`enumerate`、`zip`。
- 能写出更 Python 风格的循环和数据处理代码。

## 和 JavaScript 最不一样的地方

### 1. 代码块靠缩进，不靠大括号

```python
if score >= 60:
    print("及格")
else:
    print("不及格")
```

### 2. `input()` 永远返回字符串

```python
age = int(input("请输入年龄："))
```

### 3. `None` 很常见

它相当于“没有值”。

```python
result = None
```

### 4. Python 很重视“可变”和“不可变”

- 不可变：`int`、`float`、`str`、`tuple`
- 可变：`list`、`dict`、`set`

### 5. Python 很爱用“短、直接”的数据处理写法

比如列表推导式：

```python
evens = [x for x in range(1, 11) if x % 2 == 0]
```

## 学习顺序

建议按下面顺序学习：

1. Python 和 JS 的差异
2. `None`、布尔值、真值判断
3. 切片和解包
4. `list` / `tuple` / `dict` / `set`
5. `enumerate()`、`zip()`
6. 列表推导式和字典推导式
7. 条件判断和循环的 Python 写法
8. 综合练习

## 本日重点

### 切片

```python
nums = [10, 20, 30, 40, 50]

print(nums[1:4])
print(nums[:3])
print(nums[::2])
```

### 解包

```python
a, b = 1, 2
a, b = b, a
```

### 遍历

```python
names = ["小明", "小红", "小刚"]

for index, name in enumerate(names, start=1):
    print(index, name)
```

### 推导式

```python
nums = [1, 2, 3, 4, 5]
evens = [n for n in nums if n % 2 == 0]
```

### 字典常用操作

```python
student = {"name": "小明", "score": 88}
print(student.get("age", 18))
```

## 建议练习

- 判断字符串是否为空
- 列表切片
- 列表推导式
- 字典遍历
- `enumerate` 和 `zip`
- 可变对象引用问题
- 用 Python 写一个简短的数据清洗小脚本

## 入口文件

- [Day2 练习题](./练习题.md)
- [Day2 示例代码](./index.py)
