import click
from api.models import db, User, LearningPath, Module, Lesson

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
        # Crea 3 rutas de aprendizaje de ejemplo, cada una con un módulo y una lección,
        # para poder probar /courses y /course/:id con datos reales.
        if db.session.execute(db.select(LearningPath)).first():
            print("Ya hay rutas de aprendizaje, no se insertó nada.")
            return

        rutas = [
            {
                "title": "Fundamentos de Blockchain",
                "description": "Comprende la arquitectura descentralizada, criptografía básica y el mecanismo de consenso detrás de Bitcoin y Ethereum.",
                "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
                "time_required": "4 horas",
                "level": "Principiante",
            },
            {
                "title": "Desarrollo de Smart Contracts",
                "description": "Aprende Solidity desde cero. Crea, prueba y despliega contratos inteligentes seguros en la Ethereum Virtual Machine.",
                "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
                "time_required": "10 horas",
                "level": "Intermedio",
            },
            {
                "title": "Arquitectura DeFi & Protocolos",
                "description": "Análisis profundo de Automated Market Makers (AMMs), Liquidity Pools y estrategias para mitigar ataques y vulnerabilidades.",
                "image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
                "time_required": "8 horas",
                "level": "Avanzado",
            },
        ]

        for ruta_data in rutas:
            ruta = LearningPath(**ruta_data)
            db.session.add(ruta)
            db.session.commit()

            modulo = Module(
                title=f"Módulo 1: Introducción a {ruta.title}", level=ruta_data["level"], learning_path_id=ruta.id)
            db.session.add(modulo)
            db.session.commit()

            leccion = Lesson(
                title=f"Lección 1: ¿Qué es {ruta.title}?",
                content="Contenido de ejemplo para esta lección.",
                module_id=modulo.id,
                order_number=1,
            )
            db.session.add(leccion)
            db.session.commit()
            print(f"Ruta creada: {ruta.title}")

        print("Datos de prueba insertados.")
