# Python 与 JavaScript 对比

这份文档把学习过程中常见的 Python / JavaScript 差异集中放在一起，方便有前端基础时快速对照。

## 1. 变量声明

JavaScript：

```js
let name = "Tom"
const age = 18
```

Python：

```python
name = "Tom"
age = 18
```

Python 没有 `let` / `const`，变量名直接赋值。

## 2. 代码块

JavaScript 使用 `{}`：

```js
if (score >= 60) {
  console.log("及格")
}
```

Python 使用缩进：

```python
if score >= 60:
    print("及格")
```

Python 缩进不是风格问题，而是语法。

## 3. 空值

JavaScript：

```js
null
undefined
```

Python：

```python
None
```

判断 `None` 推荐：

```python
if value is None:
    print("没有值")
```

## 4. 布尔值

JavaScript：

```js
true
false
```

Python：

```python
True
False
```

转 JSON 时会自动变成 JSON 小写：

```python
import json

json.dumps({"ok": True})
```

结果：

```json
{"ok": true}
```

## 5. 字符串模板

JavaScript：

```js
const text = `你好，我叫 ${name}`
```

Python：

```python
text = f"你好，我叫{name}"
```

Python 这种写法叫 `f-string`。

## 6. 数组和列表

JavaScript：

```js
const nums = [1, 2, 3]
```

Python：

```python
nums = [1, 2, 3]
```

常见操作：

```python
nums.append(4)
nums[0]
nums[-1]
nums[1:3]
```

Python 列表支持负数索引和切片。

## 7. 对象和字典

JavaScript：

```js
const user = { name: "Tom", age: 18 }
console.log(user.name)
```

Python：

```python
user = {"name": "Tom", "age": 18}
print(user["name"])
```

安全读取：

```python
age = user.get("age", 18)
```

## 8. 可选链

JavaScript：

```js
const name = user?.profile?.name
```

Python 没有原生 `?.`。

字典常用：

```python
name = user.get("profile", {}).get("name")
```

对象常用：

```python
profile = getattr(user, "profile", None)
name = getattr(profile, "name", None) if profile else None
```

## 9. 函数

JavaScript：

```js
function add(a, b) {
  return a + b
}
```

Python：

```python
def add(a, b):
    return a + b
```

## 10. 箭头函数和 lambda

JavaScript：

```js
const add = (a, b) => a + b
```

Python：

```python
add = lambda a, b: a + b
```

Python 的 `lambda` 只能写一个表达式，复杂逻辑推荐用 `def`。

## 11. 解构和解包

JavaScript：

```js
const [a, b] = [1, 2]
```

Python：

```python
a, b = [1, 2]
```

不定长度：

```python
first, *rest = [1, 2, 3, 4]
```

字典传参：

```python
data = {"name": "Tom", "age": 18}
show_user(**data)
```

## 12. `*args` 和 `**kwargs`

JavaScript 常用剩余参数：

```js
function add(...args) {
  return args.reduce((a, b) => a + b, 0)
}
```

Python：

```python
def add(*args):
    return sum(args)
```

关键字参数：

```python
def show_user(**kwargs):
    print(kwargs)
```

## 13. 类

JavaScript：

```js
class Student {
  constructor(name) {
    this.name = name
  }
}
```

Python：

```python
class Student:
    def __init__(self, name):
        self.name = name
```

Python 方法第一个参数通常是 `self`。

## 14. getter / setter 和 property

JavaScript：

```js
class Student {
  get score() {
    return this._score
  }
}
```

Python：

```python
class Student:
    @property
    def score(self):
        return self._score
```

设置值：

```python
@score.setter
def score(self, value):
    self._score = value
```

## 15. static 和 classmethod

JavaScript：

```js
class MathTool {
  static add(a, b) {
    return a + b
  }
}
```

Python 静态方法：

```python
class MathTool:
    @staticmethod
    def add(a, b):
        return a + b
```

Python 类方法：

```python
class Student:
    @classmethod
    def from_dict(cls, data):
        return cls(data["name"])
```

简单记：

- `self`：对象方法
- `cls`：类方法
- 没有 `self` / `cls`：静态方法

## 16. 魔术方法

JavaScript 更像通过原型方法或内置协议控制对象行为。

Python 通过魔术方法接入语言语法：

```python
class Classroom:
    def __len__(self):
        return 3
```

调用：

```python
len(classroom)
```

常见对应：

```text
str(obj)     -> obj.__str__()
len(obj)     -> obj.__len__()
obj + other  -> obj.__add__(other)
obj[index]   -> obj.__getitem__(index)
for x in obj -> obj.__iter__()
```

## 17. 异常

JavaScript：

```js
throw new Error("出错")
```

Python：

```python
raise ValueError("出错")
```

捕获：

```python
try:
    ...
except ValueError as error:
    print(error)
```

## 18. with

Python 的 `with` 用于资源管理。

```python
with open("note.txt", "r", encoding="utf-8") as file:
    content = file.read()
```

可以粗略理解成自动帮你写了 `try / finally`。

自定义类如果实现 `__enter__` 和 `__exit__`，也能使用 `with`。

## 19. async / await

JavaScript：

```js
async function main() {
  const result = await fetchData()
}
```

Python：

```python
async def main():
    result = await fetch_data()
```

Python 启动异步程序常用：

```python
import asyncio

asyncio.run(main())
```

## 20. JSON

Python 转 JSON 字符串：

```python
json.dumps(data, ensure_ascii=False, indent=2)
```

JSON 字符串转 Python：

```python
json.loads(json_text)
```

写入文件：

```python
json.dump(data, file, ensure_ascii=False, indent=2)
```

读取文件：

```python
json.load(file)
```

记忆：

```text
dumps: Python -> JSON 字符串
dump : Python -> JSON 文件
loads: JSON 字符串 -> Python
load : JSON 文件 -> Python
```
