# Day3 进阶示例：继承与类的拓展


class Person:
    def __init__(self, name):
        self.name = name

    def info(self):
        return f"姓名：{self.name}"


class Student(Person):
    school = "Python 学习班"

    def __init__(self, name, score):
        super().__init__(name)
        self.score = score

    def is_passed(self):
        return self.score >= 60

    def info(self):
        status = "及格" if self.is_passed() else "不及格"
        return f"{super().info()}，分数：{self.score}，{status}"


class MathTool:
    @staticmethod
    def add(a, b):
        return a + b

    @classmethod
    def from_student(cls, student):
        return cls.add(student.score, 10)


class ScoreBox:
    def __init__(self, score):
        self._score = score

    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if value < 0:
            value = 0
        self._score = value


class Classroom:
    def __init__(self, students):
        self.students = students

    def __len__(self):
        return len(self.students)


student = Student("小明", 88)
print(student.info())

print(MathTool.add(3, 5))
print(MathTool.from_student(student))

box = ScoreBox(90)
box.score = -10
print(box.score)

classroom = Classroom([student, Student("小红", 95)])
print(len(classroom))
