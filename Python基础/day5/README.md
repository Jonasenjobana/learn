# Day5：文件读写、JSON 与 CSV

这一阶段开始学习 Python 处理文件。

如果你后面要学 AI，文件读写非常重要，因为数据、配置、模型结果、接口返回内容，很多时候都会以文件形式保存。

## 学习目标

学完 Day5 后，你应该能：

- 使用 `open()` 读取和写入文本文件。
- 理解 `with open(...)` 的作用。
- 会处理文件不存在等异常。
- 会读写 JSON 文件。
- 会读写 CSV 文件。
- 知道什么时候用文本、JSON、CSV。

## 1. 为什么用 `with open`

最推荐的文件写法是：

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("今天学习文件读写")
```

`with` 的好处是：文件用完后会自动关闭。

## 2. 文件模式

常见模式：

| 模式 | 含义 |
| --- | --- |
| `r` | 读取文件 |
| `w` | 写入文件，会覆盖原内容 |
| `a` | 追加写入，不覆盖原内容 |
| `x` | 创建新文件，如果文件已存在会报错 |

常用组合：

| 模式 | 含义 |
| --- | --- |
| `r` | 读文本 |
| `w` | 写文本 |
| `a` | 追加文本 |
| `rb` | 读二进制 |
| `wb` | 写二进制 |

## 3. 写入文本

```python
with open("study_log.txt", "w", encoding="utf-8") as file:
    file.write("Day5：文件读写\n")
    file.write("继续学习 Python\n")
```

注意：`w` 会覆盖原文件内容。

## 4. 追加文本

```python
with open("study_log.txt", "a", encoding="utf-8") as file:
    file.write("追加一行学习记录\n")
```

`a` 适合写日志。

## 5. 读取文本

一次性读取：

```python
with open("study_log.txt", "r", encoding="utf-8") as file:
    content = file.read()

print(content)
```

逐行读取：

```python
with open("study_log.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())
```

## 6. 文件异常处理

读取不存在的文件会报错。

```python
try:
    with open("missing.txt", "r", encoding="utf-8") as file:
        print(file.read())
except FileNotFoundError:
    print("文件不存在")
```

## 7. 路径处理

推荐后面逐步使用 `pathlib`。

```python
from pathlib import Path

path = Path("data") / "note.txt"
print(path)
```

`Path` 比字符串拼路径更清晰。

## 8. JSON 是什么

JSON 很像 JavaScript 对象字面量，经常用于：

- 保存配置
- 保存结构化数据
- 处理接口返回内容
- 大模型 API 请求和响应

Python 里用 `json` 标准库处理。

## 9. 写入 JSON

```python
import json

student = {
    "name": "小明",
    "age": 18,
    "score": 88,
}

with open("student.json", "w", encoding="utf-8") as file:
    json.dump(student, file, ensure_ascii=False, indent=2)
```

参数说明：

- `ensure_ascii=False`：中文不要转义成 Unicode 编码
- `indent=2`：格式化缩进，方便阅读

## 10. 读取 JSON

```python
import json

with open("student.json", "r", encoding="utf-8") as file:
    student = json.load(file)

print(student["name"])
```

## 11. CSV 是什么

CSV 是表格数据格式，经常用于保存一行一行的数据。

例如：

```text
name,score
小明,88
小红,95
```

后面学 `pandas` 时，CSV 会非常常见。

## 12. 写入 CSV

```python
import csv

students = [
    {"name": "小明", "score": 88},
    {"name": "小红", "score": 95},
]

with open("students.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(students)
```

`newline=""` 在 Windows 上很重要，可以避免多出空行。

## 13. 读取 CSV

```python
import csv

with open("students.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["name"], row["score"])
```

注意：CSV 读出来的值默认都是字符串。

如果要计算分数，需要转换：

```python
score = int(row["score"])
```

## 14. 什么时候用哪种文件

| 场景 | 推荐 |
| --- | --- |
| 普通文本、日志 | `.txt` |
| 结构化数据、配置、接口数据 | `.json` |
| 表格数据、数据集 | `.csv` |

## Day5 要掌握的重点

- `with open(...)` 是文件读写推荐写法。
- 写文件时注意 `w` 会覆盖，`a` 会追加。
- JSON 适合结构化数据。
- CSV 适合表格数据。
- 文件读取到的数据可能需要类型转换。
- Windows 写 CSV 时记得 `newline=""`。

## 入口文件

- [Day5 练习题](./练习题.md)
- [Day5 示例代码](./index.py)
