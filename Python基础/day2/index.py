# Day2 示例代码：适合有 JavaScript 基础的学习者

# 这份文件更偏“速通参考”。
# 重点看 Python 的差异点，而不是重复练 JS 里早就熟的基础控制流。

# 示例 1：输入后的类型转换
age = int(input("请输入年龄："))
print(f"你明年将是 {age + 1} 岁")

# 示例 2：truthy / falsy
values = ["", "hello", 0, 1, [], [1]]

for value in values:
    print(repr(value), bool(value))

# 示例 3：切片和解包
nums = [10, 20, 30, 40, 50, 60]
print(nums[:3])
print(nums[1:4])
print(nums[::2])

a = 100
b = 200
a, b = b, a
print(a, b)

# 示例 4：列表推导式
evens = [n for n in range(1, 21) if n % 2 == 0]
print(evens)

# 示例 5：字典遍历和默认值
student = {"name": "小明", "age": 18, "score": 88}

for key, value in student.items():
    print(key, value)

print(student.get("city", "未知"))

# 示例 6：enumerate 和 zip
names = ["小明", "小红", "小刚"]
scores = [88, 95, 76]

for index, name in enumerate(names, start=1):
    print(index, name)

for name, score in zip(names, scores):
    print(name, score)
