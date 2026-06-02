# Day4 示例代码：函数进阶与异常处理


def greet(name, message="你好"):
    print(f"{message}，{name}")


def add(*args):
    return sum(args)


def show_user(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")


def get_min_max(numbers):
    return min(numbers), max(numbers)


def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "不能除以 0"


def check_score(score):
    if score < 0 or score > 100:
        raise ValueError("分数必须在 0 到 100 之间")
    return score


def create_student(name, score, **extra):
    student = {"name": name, "score": score}
    student.update(extra)
    return student


greet("小明")
greet("小红", "早上好")

print(add(1, 2, 3, 4))

show_user(name="小明", age=18, city="上海")

nums = [3, 5]
print(add(*nums))

user = {"name": "小明", "age": 18}
show_user(**user)

min_value, max_value = get_min_max([3, 8, 1, 9])
print(min_value, max_value)

students = [
    {"name": "小明", "score": 88},
    {"name": "小红", "score": 95},
    {"name": "小刚", "score": 76},
]

students.sort(key=lambda student: student["score"])
print(students)

print(divide(10, 2))
print(divide(10, 0))

try:
    print(check_score(120))
except ValueError as error:
    print(error)

student = create_student("小明", 88, city="上海", age=18)
print(student)
