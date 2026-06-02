# Day5 示例代码：文件读写、JSON 与 CSV

import csv
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
NOTE_PATH = BASE_DIR / "note.txt"
JSON_PATH = BASE_DIR / "student.json"
CSV_PATH = BASE_DIR / "students.csv"


def write_text():
    with open(NOTE_PATH, "w", encoding="utf-8") as file:
        file.write("今天学习sss Python 文件读写\n")


def append_text():
    with open(NOTE_PATH, "a", encoding="utf-8") as file:
        file.write("继续学习 JSON 和 CSV\n")


def read_text():
    try:
        with open(NOTE_PATH, "r", encoding="utf-8") as file:
            print(file.read())
    except FileNotFoundError:
        print("note.txt 不存在")


def read_text_by_line():
    try:
        with open(NOTE_PATH, "r", encoding="utf-8") as file:
            for line in file:
                print(line.strip())
    except FileNotFoundError:
        print("note.txt 不存在")


def write_json():
    student = {
        "name": "小明",
        "age": 18,
        "score": 88,
    }

    with open(JSON_PATH, "w", encoding="utf-8") as file:
        json.dump(student, file, ensure_ascii=False, indent=2)


def read_json():
    with open(JSON_PATH, "r", encoding="utf-8") as file:
        student = json.load(file)

    print(student["name"], student["score"])


def write_csv():
    students = [
        {"name": "小明", "score": 88},
        {"name": "小红", "score": 95},
        {"name": "小刚", "score": 76},
    ]

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["name", "score"])
        writer.writeheader()
        writer.writerows(students)


def read_csv():
    with open(CSV_PATH, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            print(row["name"], row["score"])


def calculate_average_score():
    scores = []

    with open(CSV_PATH, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            scores.append(int(row["score"]))

    print(f"平均分：{sum(scores) / len(scores)}")


def find_top_student():
    students = []

    with open(CSV_PATH, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            row["score"] = int(row["score"])
            students.append(row)

    top_student = max(students, key=lambda student: student["score"])
    print(f"最高分学生：{top_student['name']}，{top_student['score']} 分")


write_text()
append_text()
read_text()
read_text_by_line()

write_json()
read_json()

write_csv()
read_csv()
calculate_average_score()
find_top_student()
