# Day4：函数进阶与异常处理

这一阶段继续深入函数。

你已经学过变量、数据类型、解包、类，所以 Day4 的重点不是“函数是什么”，而是 Python 里函数更常见、更实用的写法：

- 默认参数
- 关键字参数
- `*args`
- `**kwargs`
- 返回多个值
- 作用域
- 匿名函数
- 异常处理

## 学习目标

学完 Day4 后，你应该能：

- 写出更灵活的函数参数。
- 理解 `*args` 和 `**kwargs` 与解包的关系。
- 会用函数返回多个值。
- 理解局部变量和全局变量。
- 会用 `try / except` 处理常见错误。
- 能把重复逻辑封装成函数。

## 1. 默认参数

默认参数就是给参数一个默认值。

```python
def greet(name, message="你好"):
    print(f"{message}，{name}")


greet("小明")
greet("小红", "早上好")
```

注意：默认参数尽量不要用可变对象，比如列表。

不推荐：

```python
def add_item(item, items=[]):
    items.append(item)
    return items
```

推荐：

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

## 2. 关键字参数

Python 调用函数时，可以指定参数名。

```python
def create_user(name, age, city):
    return {"name": name, "age": age, "city": city}


user = create_user(name="小明", age=18, city="上海")
```

这样可读性更强，特别适合参数比较多的时候。

## 3. `*args`

`*args` 用来接收任意多个位置参数，最后会变成一个元组。

```python
def add(*args):
    return sum(args)


print(add(1, 2, 3))
```

你可以理解成：

```text
add(1, 2, 3) -> args = (1, 2, 3)
```

## 4. `**kwargs`

`**kwargs` 用来接收任意多个关键字参数，最后会变成一个字典。

```python
def show_info(**kwargs):
    print(kwargs)


show_info(name="小明", age=18)
```

你可以理解成：

```text
show_info(name="小明", age=18) -> kwargs = {"name": "小明", "age": 18}
```

## 5. 解包传参

这和你之前学的解包是连在一起的。

### 列表或元组用 `*`

```python
def add(a, b):
    return a + b


nums = [3, 5]
print(add(*nums))
```

### 字典用 `**`

```python
def create_user(name, age):
    return {"name": name, "age": age}


data = {"name": "小明", "age": 18}
print(create_user(**data))
```

## 6. 返回多个值

Python 函数可以看起来返回多个值。

```python
def get_min_max(numbers):
    return min(numbers), max(numbers)


min_value, max_value = get_min_max([3, 8, 1, 9])
```

本质上它返回的是一个元组，然后接收时被解包。

## 7. 作用域

函数内部定义的变量，默认只能在函数内部使用。

```python
def demo():
    name = "小明"
    print(name)


demo()
```

如果在函数里修改全局变量，需要 `global`，但入门阶段不推荐频繁使用。

```python
count = 0


def increase():
    global count
    count += 1
```

更推荐把值作为参数传入，再返回新值。

```python
def increase(count):
    return count + 1
```

## 8. lambda 匿名函数

`lambda` 用来写简短的小函数。

```python
add = lambda a, b: a + b
print(add(3, 5))
```

实际更常见的用法是搭配排序。

```python
students = [
    {"name": "小明", "score": 88},
    {"name": "小红", "score": 95},
    {"name": "小刚", "score": 76},
]

students.sort(key=lambda student: student["score"])
```

## 9. 异常处理

程序运行时可能出错，比如：

- 输入的不是数字
- 文件不存在
- 除以 0
- 字典 key 不存在

可以用 `try / except` 处理。

```python
try:
    age = int(input("请输入年龄："))
    print(age + 1)
except ValueError:
    print("请输入有效数字")
```

## 10. `finally`

`finally` 不管有没有异常都会执行。

```python
try:
    print("开始")
except Exception:
    print("出错")
finally:
    print("结束")
```

## 11. 主动抛出异常

有时候数据不符合要求，可以主动抛出异常。

```python
def set_score(score):
    if score < 0 or score > 100:
        raise ValueError("分数必须在 0 到 100 之间")
    return score
```

## Day4 要掌握的重点

- `*args` 是多个位置参数
- `**kwargs` 是多个关键字参数
- `*` 可以解包列表或元组
- `**` 可以解包字典
- 函数返回多个值时，本质上是返回元组
- `try / except` 用来处理可能发生的错误

## 入口文件

- [Day4 练习题](./练习题.md)
- [Day4 示例代码](./index.py)
