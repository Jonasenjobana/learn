import json
import random
from datetime import datetime


def exercise1_self_intro():
    """题目 1：自我介绍"""
    name = input("姓名：")
    age = int(input("年龄："))
    hobby = input("喜欢的方向：")
    print(f"你好，我叫{name}，今年{age}岁，我喜欢 {hobby}。")


def exercise2_arithmetic():
    """题目 2：四则运算"""
    number1 = int(input("第一个数字："))
    number2 = int(input("第二个数字："))

    print(f"和：{number1 + number2}")
    print(f"差：{number1 - number2}")
    print(f"积：{number1 * number2}")

    if number2 == 0:
        print("商：无法除以 0")
        print("整除：无法除以 0")
        print("取余：无法除以 0")
    else:
        print(f"商：{number1 / number2}")
        print(f"整除：{number1 // number2}")
        print(f"取余：{number1 % number2}")


def exercise3_grade():
    """题目 3：成绩评级"""
    score = int(input("输入分数："))

    if score >= 90:
        print("A")
    elif score >= 80:
        print("B")
    elif score >= 70:
        print("C")
    elif score >= 60:
        print("D")
    else:
        print("E")


def exercise4_parity():
    """题目 4：判断奇偶"""
    number = int(input("输入整数："))

    if number % 2 == 0:
        print(f"{number} 是偶数")
    else:
        print(f"{number} 是奇数")


def exercise5_leap_year():
    """题目 5：判断闰年"""
    year = int(input("输入年份："))

    if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
        print("闰年")
    else:
        print("不是闰年")


def exercise6_print_1_to_100():
    """题目 6：输出 1 到 100"""
    for i in range(1, 101):
        print(f"{i:3}", end="\n" if i % 10 == 0 else " ")
    print()


def exercise7_sum_1_to_100():
    """题目 7：求 1 到 100 的和"""
    total = 0
    for i in range(1, 101):
        total += i
    print(f"1 到 100 的和是：{total}")


def exercise8_guess_number_game():
    """题目 8：猜数字小游戏"""
    target = random.randint(1, 10)
    print("我已经想好了 1 到 10 之间的一个数字。")

    while True:
        try:
            guess = int(input("请输入你的猜测："))
        except ValueError:
            print("请输入整数。")
            continue

        if guess < target:
            print("太小了")
        elif guess > target:
            print("太大了")
        else:
            print("猜对了")
            break


def exercise9_list_basic():
    """题目 9：列表基础"""
    scores = [88, 92, 76, 95, 67]

    print(f"第一个元素：{scores[0]}")
    print(f"最后一个元素：{scores[-1]}")
    print(f"列表长度：{len(scores)}")
    print(f"平均分：{sum(scores) / len(scores)}")


def exercise10_list_filter():
    """题目 10：列表筛选"""
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    even_numbers = []

    for number in numbers:
        if number % 2 == 0:
            even_numbers.append(number)

    print(f"偶数列表：{even_numbers}")


def exercise11_dict_basic():
    """题目 11：字典查询"""
    student = {
        "name": "小明",
        "age": 18,
        "score": 88,
    }

    print(f"名字：{student['name']}")
    print(f"年龄：{student['age']}")

    student["city"] = "上海"
    student["score"] = 95

    print(f"修改后的字典：{student}")


def exercise12_character_frequency():
    """题目 12：词频统计"""
    text = input("请输入一段文字：")
    frequency = {}

    for char in text:
        frequency[char] = frequency.get(char, 0) + 1

    for char, count in frequency.items():
        print(f"{char}: {count}")


def is_even(n):
    return n % 2 == 0


def average(nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)


def exercise13_functions():
    """题目 13：函数封装"""
    print(f"8 是偶数吗：{is_even(8)}")
    print(f"7 是偶数吗：{is_even(7)}")
    print(f"平均值：{average([10, 20, 30, 40])}")


class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def is_passed(self):
        return self.score >= 60

    def show_info(self):
        status = "及格" if self.is_passed() else "不及格"
        print(f"{self.name}：{self.score} 分，{status}")


def exercise14_student_object():
    """题目 14：学生对象"""
    students = [
        Student("小明", 88),
        Student("小红", 95),
        Student("小刚", 52),
    ]

    for student in students:
        student.show_info()


class Book:
    def __init__(self, title, author, price):
        self.title = title
        self.author = author
        self.price = price

    def show_info(self):
        print(f"《{self.title}》 - {self.author} - {self.price} 元")


def exercise15_book_management():
    """题目 15：图书管理小练习"""
    books = [
        Book("Python 入门", "张三", 59.8),
        Book("机器学习基础", "李四", 79.0),
        Book("深度学习实践", "王五", 89.5),
    ]

    for book in books:
        book.show_info()


def exercise16_file_write():
    """题目 16：文件写入"""
    content = input("请输入今天的学习内容：")
    with open("study_log.txt", "a", encoding="utf-8") as file:
        file.write(f"{datetime.now():%Y-%m-%d %H:%M:%S} - {content}\n")
    print("已写入 study_log.txt")


def exercise17_json_basic():
    """题目 17：JSON 基础"""
    data = {
        "name": "小明",
        "age": 18,
        "score": 88,
    }

    with open("student.json", "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

    with open("student.json", "r", encoding="utf-8") as file:
        loaded = json.load(file)

    print(loaded)


def score_manager_add_student(students):
    name = input("学生姓名：")
    score = int(input("学生分数："))
    students.append({"name": name, "score": score})
    print("已添加。")


def score_manager_show_students(students):
    if not students:
        print("当前没有学生。")
        return

    for index, student in enumerate(students, start=1):
        print(f"{index}. {student['name']} - {student['score']}")


def score_manager_average_score(students):
    if not students:
        print("当前没有学生。")
        return

    scores = [student["score"] for student in students]
    print(f"平均分：{sum(scores) / len(scores)}")


def score_manager_top_student(students):
    if not students:
        print("当前没有学生。")
        return

    top_student = max(students, key=lambda item: item["score"])
    print(f"最高分：{top_student['name']} - {top_student['score']}")


def exercise18_score_manager():
    """题目 18：综合小项目"""
    students = []

    while True:
        print("\n学生成绩管理器")
        print("1. 添加学生")
        print("2. 查看所有学生")
        print("3. 计算平均分")
        print("4. 查找最高分")
        print("0. 返回主菜单")

        choice = input("请选择：").strip()

        if choice == "1":
            score_manager_add_student(students)
        elif choice == "2":
            score_manager_show_students(students)
        elif choice == "3":
            score_manager_average_score(students)
        elif choice == "4":
            score_manager_top_student(students)
        elif choice == "0":
            break
        else:
            print("无效选择。")


def show_menu():
    print("\n请选择要运行的题目：")
    print("1. 自我介绍")
    print("2. 四则运算")
    print("3. 成绩评级")
    print("4. 判断奇偶")
    print("5. 判断闰年")
    print("6. 输出 1 到 100")
    print("7. 求 1 到 100 的和")
    print("8. 猜数字小游戏")
    print("9. 列表基础")
    print("10. 列表筛选")
    print("11. 字典查询")
    print("12. 词频统计")
    print("13. 函数封装")
    print("14. 学生对象")
    print("15. 图书管理小练习")
    print("16. 文件写入")
    print("17. JSON 基础")
    print("18. 综合小项目")
    print("0. 退出")


def main():
    actions = {
        "1": exercise1_self_intro,
        "2": exercise2_arithmetic,
        "3": exercise3_grade,
        "4": exercise4_parity,
        "5": exercise5_leap_year,
        "6": exercise6_print_1_to_100,
        "7": exercise7_sum_1_to_100,
        "8": exercise8_guess_number_game,
        "9": exercise9_list_basic,
        "10": exercise10_list_filter,
        "11": exercise11_dict_basic,
        "12": exercise12_character_frequency,
        "13": exercise13_functions,
        "14": exercise14_student_object,
        "15": exercise15_book_management,
        "16": exercise16_file_write,
        "17": exercise17_json_basic,
        "18": exercise18_score_manager,
    }

    while True:
        show_menu()
        choice = input("请输入题号：").strip()

        if choice == "0":
            print("已退出。")
            break

        action = actions.get(choice)
        if action is None:
            print("请输入有效题号。")
            continue

        action()


if __name__ == "__main__":
    main()
