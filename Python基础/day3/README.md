# Day3：类与对象

这一阶段开始进入 Python 的面向对象基础。

如果你有 JavaScript 基础，可以把“类”理解成一种更适合组织复杂数据和行为的写法：

- 类是模板。
- 对象是根据模板创建出来的具体实例。

后面无论是写小工具、整理数据，还是学习 PyTorch、接口封装、项目代码结构，都会经常见到类。

## 学习目标

学完 Day3 后，你应该能：

- 看懂 `class` 的基本写法。
- 理解对象、实例属性、类属性、方法的区别。
- 掌握 `__init__` 和 `self` 的含义。
- 会写简单的类来封装数据和行为。
- 能把字典式的写法，慢慢过渡到类式的写法。

## 先记住三个词

### 1. 类

类是模板，定义“这类东西应该有什么属性、能做什么事”。

### 2. 对象

对象是类创建出来的具体实例。

### 3. 属性和方法

- 属性：对象身上的数据
- 方法：对象能做的动作

## 基本写法

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def show_info(self):
        print(f"学生：{self.name}，分数：{self.score}")


student = Student("小明", 88)
student.show_info()
```

## `__init__`

`__init__` 是初始化方法。创建对象时会自动执行。

```python
student = Student("小明", 88)
```

等价于：

```python
student = Student.__new__(Student)
Student.__init__(student, "小明", 88)
```

你现在不用手动写这两句，先知道它“负责初始化对象”就够了。

## `self`

`self` 代表当前这个对象本身。

```python
class Student:
    def __init__(self, name):
        self.name = name

    def say_hello(self):
        print(f"你好，我是{self.name}")
```

当你执行：

```python
s1 = Student("小明")
s2 = Student("小红")
```

`s1.say_hello()` 里的 `self` 就是 `s1`。

`s2.say_hello()` 里的 `self` 就是 `s2`。

## 实例属性和类属性

### 实例属性

实例属性属于某一个对象。

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
```

每个学生都可以有不同的 `name` 和 `score`。

### 类属性

类属性属于类本身，通常用于所有对象共享的数据。

```python
class Student:
    school = "Python 学习班"

    def __init__(self, name):
        self.name = name


print(Student.school)
```

如果所有学生都属于同一个学校，就适合放成类属性。

## 常用方法

方法就是定义在类里的函数。

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def is_passed(self):
        return self.score >= 60

    def show_info(self):
        status = "及格" if self.is_passed() else "不及格"
        print(f"{self.name}：{self.score} 分，{status}")
```

## 为什么要用类

如果只是临时保存一条数据，字典就够了。

```python
student = {"name": "小明", "score": 88}
```

但如果这条数据还有行为，比如：

- 判断是否及格
- 输出信息
- 更新分数
- 序列化保存

那么类会更清晰。

## 一个完整例子

```python
class Student:
    school = "Python 学习班"

    def __init__(self, name, score):
        self.name = name
        self.score = score

    def update_score(self, new_score):
        self.score = new_score

    def is_passed(self):
        return self.score >= 60

    def show_info(self):
        status = "及格" if self.is_passed() else "不及格"
        print(f"[{self.school}] {self.name}：{self.score} 分，{status}")


students = [
    Student("小明", 88),
    Student("小红", 95),
    Student("小刚", 52),
]

for student in students:
    student.show_info()
```

## 和 JavaScript 的关系

你可以把 Python 的类理解成类似 JS `class` 的写法，但 Python 有几个不同点：

- 方法第一个参数通常是 `self`
- 属性一般通过 `self.xxx` 访问
- `__init__` 负责初始化
- 类属性和实例属性分得比较明确

## 本阶段要掌握的重点

- 会写 `class`
- 会写 `__init__`
- 会用 `self`
- 会定义方法
- 会区分实例属性和类属性
- 能看懂对象列表这种写法：

```python
students = [Student("A", 90), Student("B", 80)]
```

## 建议练习

- Student 类
- Book 类
- Car 类
- 商品类
- 学生成绩管理小练习

## 入口文件

- [Day3 练习题](./练习题.md)
- [Day3 示例代码](./index.py)
- [Day3 进阶：继承与类的拓展](./进阶.md)
