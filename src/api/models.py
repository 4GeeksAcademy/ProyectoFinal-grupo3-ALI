from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, func, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Any, Dict
from enum import Enum
from sqlalchemy import Enum as SAEnum
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class UserType(Enum):
    student = "student"
    admin = "admin"

class User(db.Model):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(80), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    role: Mapped[UserType] = mapped_column(SAEnum(UserType))

    progress: Mapped[list["UserProgress"]
                     ] = relationship(back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
        }


class LearningPath(db.Model):
    __tablename__ = 'learning_paths'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    # Campos agregados: routes.py y CourseDescription.jsx ya los esperaban,
    # pero faltaban en el modelo. Se dejan nullable=True para no romper
    # filas existentes que no los tengan.
    description: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String(300), nullable=True)
    time_required: Mapped[str] = mapped_column(String(50), nullable=True)
    level: Mapped[str] = mapped_column(String(50), nullable=True)

    modules: Mapped[list["Module"]] = relationship(
        back_populates="learning_path")


class Module(db.Model):
    __tablename__ = 'modules'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    level: Mapped[str] = mapped_column(String(50))
    learning_path_id: Mapped[int] = mapped_column(
        ForeignKey('learning_paths.id'))

    lessons: Mapped[list["Lesson"]] = relationship(back_populates="module")
    learning_path: Mapped["LearningPath"] = relationship(
        back_populates="modules")


class Lesson(db.Model):
    __tablename__ = 'lessons'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    module_id: Mapped[int] = mapped_column(ForeignKey('modules.id'))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    order_number: Mapped[int] = mapped_column(nullable=False)

    module: Mapped["Module"] = relationship(back_populates="lessons")
    quiz: Mapped["Quiz"] = relationship(uselist=False, back_populates="lesson")
    user_progresses: Mapped[list["UserProgress"]
                            ] = relationship(back_populates="lesson")


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey('lessons.id'))
    questions_data: Mapped[Dict[str, Any]
                           ] = mapped_column(JSON, nullable=False)

    lesson: Mapped["Lesson"] = relationship(back_populates="quiz")


class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    lesson_id: Mapped[int] = mapped_column(ForeignKey('lessons.id'))
    quiz_score: Mapped[int] = mapped_column(nullable=True)
    is_completed: Mapped[bool] = mapped_column(default=False)
    completed_at: Mapped[datetime] = mapped_column(nullable=True)

    user: Mapped["User"] = relationship(back_populates="progress")
    lesson: Mapped["Lesson"] = relationship(back_populates="user_progresses")
