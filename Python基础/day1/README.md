# Day1：基础语法与入门练习

这一阶段用于把 Python 最基本的运行方式跑起来。

如果你有 JavaScript 基础，Day1 不需要停太久，重点看 Python 这些差异：

- Python 不需要 `let` / `const`
- 代码块靠缩进
- `input()` 得到的永远是字符串
- 字符串模板用 `f-string`
- 布尔值是 `True` / `False`
- 空值是 `None`

## 学习目标

学完 Day1 后，你应该能：

- 用 `print()` 输出内容。
- 用 `input()` 接收用户输入。
- 使用 `int()`、`float()`、`str()` 做类型转换。
- 写简单的条件判断和循环。
- 看懂基础练习答案。

## 文件说明

- [练习题](./练习题.md)
- [答案合集](./train.py)
- [临时代码](./index.py)

## 推荐学习方式

1. 先看 [练习题](./练习题.md)
2. 自己写一版
3. 对照 [答案合集](./train.py)
4. 有疑问时回到 [Python 与 JavaScript 对比](../JavaScript对比.md)

## Day1 重点提醒

### `input()` 返回字符串

```python
age = int(input("请输入年龄："))
```

如果不转成整数，后面做加减乘除会出错。

### `f-string`

```python
name = "小明"
age = 18

print(f"我叫{name}，今年{age}岁")
```

### 缩进

```python
if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

缩进是 Python 语法的一部分，不是单纯格式风格。
