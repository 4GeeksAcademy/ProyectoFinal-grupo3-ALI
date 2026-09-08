import click
from api.models import (
    db,
    User,
    LearningPath,
    Module,
    Lesson,
    Quiz,
    UserProgress,
    UserType,
)

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        """Populate the database with a complete, repeatable demo dataset."""
        users = [
            {
                "email": "admin@academy.test",
                "username": "Admin Academy",
                "password": "Admin123!",
                "role": UserType.admin,
            },
            {
                "email": "student@academy.test",
                "username": "Demo Student",
                "password": "Student123!",
                "role": UserType.student,
            },
        ]

        paths = [
            {
                "title": "Fundamentos de Blockchain",
                "description": "Comprende la arquitectura descentralizada, criptografía básica y el mecanismo de consenso detrás de Bitcoin y Ethereum.",
                "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
                "time_required": "4 horas",
                "level": "Principiante",
                "modules": [
                    {
                        "title": "Módulo 1: Conceptos esenciales",
                        "lessons": [
                            {
                                "title": "¿Qué es una blockchain?",
                                "content": "Una blockchain es un registro distribuido que agrupa transacciones en bloques enlazados y verificables.",
                                "questions": [
                                    {
                                        "question_text": "¿Qué característica distingue a una blockchain?",
                                        "option_a": "Es un registro distribuido",
                                        "option_b": "Solo funciona sin internet",
                                        "option_c": "No usa criptografía",
                                        "correct_option": "a",
                                        "explanation": "La información se replica entre varios participantes de la red."
                                    }
                                ]
                            },
                            {
                                "title": "Criptografía y wallets",
                                "content": "Las claves públicas reciben fondos y las claves privadas permiten firmar operaciones y demostrar la propiedad.",
                                "questions": [
                                    {
                                        "question_text": "¿Qué permite hacer una clave privada?",
                                        "option_a": "Cambiar el precio de un token",
                                        "option_b": "Firmar transacciones",
                                        "option_c": "Eliminar un bloque",
                                        "correct_option": "b",
                                        "explanation": "La clave privada autoriza operaciones mediante firmas criptográficas."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Módulo 2: Consenso",
                        "lessons": [
                            {
                                "title": "Proof of Work",
                                "content": "Proof of Work requiere resolver un problema computacional para proponer y validar nuevos bloques.",
                                "questions": [
                                    {
                                        "question_text": "¿Qué mecanismo utiliza originalmente Bitcoin?",
                                        "option_a": "Proof of Work",
                                        "option_b": "Proof of Authority",
                                        "option_c": "Proof of History",
                                        "correct_option": "a",
                                        "explanation": "Bitcoin utiliza Proof of Work para alcanzar consenso."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Desarrollo de Smart Contracts",
                "description": "Aprende Solidity desde cero. Crea, prueba y despliega contratos inteligentes seguros en la Ethereum Virtual Machine.",
                "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
                "time_required": "10 horas",
                "level": "Intermedio",
                "modules": [
                    {
                        "title": "Módulo 1: Primer contrato",
                        "lessons": [
                            {
                                "title": "Estructura de Solidity",
                                "content": "Un contrato de Solidity define variables de estado, funciones y reglas que ejecuta la EVM.",
                                "questions": [
                                    {
                                        "question_text": "¿Dónde se ejecuta un smart contract de Ethereum?",
                                        "option_a": "En la EVM",
                                        "option_b": "Solo en el navegador",
                                        "option_c": "En una hoja de cálculo",
                                        "correct_option": "a",
                                        "explanation": "La Ethereum Virtual Machine ejecuta el bytecode del contrato."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ]

        created_users = 0
        created_paths = 0
        created_modules = 0
        created_lessons = 0
        created_quizzes = 0
        created_progress = 0

        try:
            user_by_email = {}
            for user_data in users:
                user = db.session.execute(
                    db.select(User).filter_by(email=user_data["email"])
                ).scalar_one_or_none()
                if user is None:
                    user = User(
                        email=user_data["email"],
                        username=user_data["username"],
                        is_active=True,
                        role=user_data["role"],
                    )
                    user.set_password(user_data["password"])
                    db.session.add(user)
                    created_users += 1
                user_by_email[user_data["email"]] = user

            db.session.flush()
            student = user_by_email["student@academy.test"]

            for path_data in paths:
                path = db.session.execute(
                    db.select(LearningPath).filter_by(title=path_data["title"])
                ).scalar_one_or_none()
                if path is None:
                    path = LearningPath(title=path_data["title"])
                    db.session.add(path)
                    created_paths += 1

                path.description = path_data["description"]
                path.image_url = path_data["image_url"]
                path.time_required = path_data["time_required"]
                path.level = path_data["level"]
                db.session.flush()

                for module_data in path_data["modules"]:
                    module = db.session.execute(
                        db.select(Module).filter_by(
                            title=module_data["title"], learning_path_id=path.id
                        )
                    ).scalar_one_or_none()
                    if module is None:
                        module = Module(
                            title=module_data["title"],
                            level=path.level,
                            learning_path=path,
                        )
                        db.session.add(module)
                        created_modules += 1
                    else:
                        module.level = path.level
                    db.session.flush()

                    for order_number, lesson_data in enumerate(
                        module_data["lessons"], start=1
                    ):
                        lesson = db.session.execute(
                            db.select(Lesson).filter_by(
                                title=lesson_data["title"], module_id=module.id
                            )
                        ).scalar_one_or_none()
                        if lesson is None:
                            lesson = Lesson(
                                title=lesson_data["title"],
                                content=lesson_data["content"],
                                order_number=order_number,
                                module=module,
                            )
                            db.session.add(lesson)
                            created_lessons += 1
                        else:
                            lesson.content = lesson_data["content"]
                            lesson.order_number = order_number
                        db.session.flush()

                        quiz = db.session.execute(
                            db.select(Quiz).filter_by(lesson_id=lesson.id)
                        ).scalar_one_or_none()
                        if quiz is None:
                            db.session.add(
                                Quiz(
                                    lesson=lesson,
                                    questions_data=lesson_data["questions"],
                                )
                            )
                            created_quizzes += 1
                        else:
                            quiz.questions_data = lesson_data["questions"]

                        progress = db.session.execute(
                            db.select(UserProgress).filter_by(
                                user_id=student.id, lesson_id=lesson.id
                            )
                        ).scalar_one_or_none()
                        if progress is None:
                            db.session.add(
                                UserProgress(
                                    user=student,
                                    lesson=lesson,
                                    is_completed=False,
                                )
                            )
                            created_progress += 1

            db.session.commit()
        except Exception:
            db.session.rollback()
            raise

        print(
            "Seed completado: "
            f"{created_users} usuarios, {created_paths} rutas, "
            f"{created_modules} módulos, {created_lessons} lecciones, "
            f"{created_quizzes} quizzes y {created_progress} progresos creados."
        )
        print("Usuario demo: student@academy.test / Student123!")
        print("Administrador demo: admin@academy.test / Admin123!")
