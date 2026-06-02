# Day3 示例代码：类与对象


class Student:
    school = "Python 学习班"

    def __init__(self, name, score):
        self.name = name
        self.score = score

    def is_passed(self):
        return self.score >= 60

    def update_score(self, new_score):
        self.score = new_score

    def show_info(self):
        status = "及格" if self.is_passed() else "不及格"
        print(f"[{self.school}] {self.name}：{self.score} 分，{status}")


class Book:
    def __init__(self, title, author, price):
        self.title = title
        self.author = author
        self.price = price

    def show_info(self):
        print(f"《{self.title}》 - {self.author} - {self.price} 元")


students = [
    Student("小明", 88),
    Student("小红", 95),
    Student("小刚", 52),
]

for student in students:
    student.show_info()

print("----")

students[2].update_score(72)
students[2].show_info()

print("----")

books = [
    Book("Python 入门", "张三", 59.8),
    Book("机器学习基础", "李四", 79.0),
    Book("深度学习实践", "王五", 89.5),
]

for book in books:
    book.show_info()
