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
                                        "question_text": "¿Qué garantiza que un bloque ya escrito no pueda alterarse sin que la red lo note?",
                                        "option_a": "Cada bloque guarda el hash del anterior, así que alterar uno rompe toda la cadena",
                                        "option_b": "Los bloques se cifran con la clave del minero",
                                        "option_c": "Un servidor central verifica cada bloque",
                                        "correct_option": "a",
                                        "explanation": "El encadenamiento por hash hace inmutable el historial: cambiar un bloque obliga a recalcular todos los siguientes."
                                    },
                                    {
                                        "question_text": "¿Qué significa que una blockchain sea descentralizada?",
                                        "option_a": "Que está en varios servidores de la misma empresa",
                                        "option_b": "Que muchos nodos independientes guardan el registro y validan las transacciones",
                                        "option_c": "Que no tiene dueño legal registrado",
                                        "correct_option": "b",
                                        "explanation": "La descentralización está en quién valida y guarda el registro, sin una autoridad única."
                                    },
                                    {
                                        "question_text": "¿Qué es un nodo?",
                                        "option_a": "Una computadora que participa en la red guardando y validando el registro",
                                        "option_b": "Cada transacción dentro de un bloque",
                                        "option_c": "La dirección pública de una wallet",
                                        "correct_option": "a",
                                        "explanation": "Cuantos más nodos independientes, más difícil es censurar o alterar la cadena."
                                    },
                                    {
                                        "question_text": "¿Por qué se dice que una blockchain pública es transparente?",
                                        "option_a": "Porque revela la identidad real de cada usuario",
                                        "option_b": "Porque cualquiera puede leer el historial completo de transacciones",
                                        "option_c": "Porque las empresas publican sus balances en la cadena",
                                        "correct_option": "b",
                                        "explanation": "Transparencia no es identidad: el historial es público, pero las direcciones son seudónimas."
                                    }
                                ]
                            },
                            {
                                "title": "Criptografía y wallets",
                                "content": "Las claves públicas reciben fondos y las claves privadas permiten firmar operaciones y demostrar la propiedad.",
                                "questions": [
                                    {
                                        "question_text": "¿Qué permite hacer una clave privada?",
                                        "option_a": "Ocultar tu saldo a los demás usuarios",
                                        "option_b": "Firmar transacciones y demostrar que controlas los fondos de una dirección",
                                        "option_c": "Recuperar fondos enviados por error",
                                        "correct_option": "b",
                                        "explanation": "La clave privada es control. Quien la tiene, mueve los fondos."
                                    },
                                    {
                                        "question_text": "Si pierdes tu frase semilla y no tienes otra copia, ¿qué pasa con tus fondos?",
                                        "option_a": "Se pierden de forma definitiva",
                                        "option_b": "Los recuperas verificando tu identidad con el proveedor",
                                        "option_c": "Vuelven automáticamente a la dirección de origen",
                                        "correct_option": "a",
                                        "explanation": "En una wallet no custodial nadie más tiene la clave. No hay soporte que pueda recuperarla."
                                    },
                                    {
                                        "question_text": "¿Cuál es la diferencia entre una wallet custodial y una no custodial?",
                                        "option_a": "La custodial cobra comisiones y la otra es gratuita",
                                        "option_b": "En la custodial un tercero guarda tus claves; en la no custodial las guardas tú",
                                        "option_c": "La no custodial solo funciona con Bitcoin",
                                        "correct_option": "b",
                                        "explanation": "La diferencia está en quién controla las claves, y con ellas los fondos."
                                    },
                                    {
                                        "question_text": "¿Qué puedes compartir sin riesgo para recibir un pago?",
                                        "option_a": "Tu clave privada",
                                        "option_b": "Tu frase semilla",
                                        "option_c": "Tu dirección pública",
                                        "correct_option": "c",
                                        "explanation": "La dirección se deriva de la clave privada, pero el proceso no es reversible."
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
                                        "question_text": "¿En qué consiste el trabajo que hacen los mineros en Proof of Work?",
                                        "option_a": "Votar por el siguiente bloque según cuántas monedas tienen",
                                        "option_b": "Buscar por fuerza bruta un valor que produzca un hash bajo un objetivo dado",
                                        "option_c": "Verificar manualmente la identidad de quienes transaccionan",
                                        "correct_option": "b",
                                        "explanation": "El minero prueba millones de valores hasta dar con uno válido. Ese costo asegura la red."
                                    },
                                    {
                                        "question_text": "¿Por qué el gasto de energía es parte del diseño y no un defecto?",
                                        "option_a": "Porque hace que atacar la red sea económicamente caro",
                                        "option_b": "Porque acelera las transacciones",
                                        "option_c": "Porque permite más datos por bloque",
                                        "correct_option": "a",
                                        "explanation": "Reescribir la cadena exigiría más poder de cómputo que el resto de la red junta."
                                    },
                                    {
                                        "question_text": "¿Cuál es la diferencia central entre Proof of Work y Proof of Stake?",
                                        "option_a": "PoW usa poder de cómputo, PoS usa capital bloqueado como garantía",
                                        "option_b": "PoW es para Bitcoin y PoS solo para tokens sin valor",
                                        "option_c": "PoW no permite smart contracts y PoS sí",
                                        "correct_option": "a",
                                        "explanation": "Ambos buscan que atacar salga caro: uno lo respalda con energía y el otro con capital en riesgo."
                                    },
                                    {
                                        "question_text": "¿Qué es un ataque del 51%?",
                                        "option_a": "Cuando el 51% de los usuarios vende al mismo tiempo",
                                        "option_b": "Cuando una entidad controla más de la mitad del poder de minado y puede reescribir bloques recientes",
                                        "option_c": "Cuando el 51% de los nodos se desconecta",
                                        "correct_option": "b",
                                        "explanation": "Con mayoría de hashrate se pueden revertir transacciones recientes, aunque no robar fondos ajenos."
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
                                        "question_text": "¿Qué indica la línea pragma solidity ^0.8.20;?",
                                        "option_a": "La versión del contrato que se está escribiendo",
                                        "option_b": "Las versiones del compilador con las que el contrato puede compilarse",
                                        "option_c": "La cantidad de gas que consumirá",
                                        "correct_option": "b",
                                        "explanation": "El pragma restringe qué compilador puede usarse, para que cambios del lenguaje no rompan el contrato."
                                    },
                                    {
                                        "question_text": "¿Qué diferencia hay entre una variable public y una private?",
                                        "option_a": "La private está cifrada y nadie puede leerla",
                                        "option_b": "La public genera una función de lectura automática; la private solo restringe el acceso desde código",
                                        "option_c": "La public se guarda en la cadena y la private en el servidor",
                                        "correct_option": "b",
                                        "explanation": "Todo lo que está en la cadena es legible. private limita el acceso desde código, no la visibilidad."
                                    },
                                    {
                                        "question_text": "¿Qué significa que una función esté marcada como payable?",
                                        "option_a": "Que puede recibir ether al ser llamada",
                                        "option_b": "Que quien la llama paga una comisión extra al creador",
                                        "option_c": "Que devuelve fondos automáticamente",
                                        "correct_option": "a",
                                        "explanation": "Sin payable, una función que reciba ether revierte la transacción."
                                    },
                                    {
                                        "question_text": "¿Qué implica que un contrato desplegado sea inmutable?",
                                        "option_a": "Que su código no puede modificarse una vez en la red",
                                        "option_b": "Que nadie puede llamar a sus funciones sin permiso",
                                        "option_c": "Que su saldo queda bloqueado para siempre",
                                        "correct_option": "a",
                                        "explanation": "Por eso las auditorías importan: un error desplegado no se corrige, hay que desplegar otro contrato."
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
