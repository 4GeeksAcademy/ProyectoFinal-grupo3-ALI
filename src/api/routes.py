import os
import re
from datetime import timedelta

from flask import request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    decode_token,
)
from flask_mail import Message

from api.models import db, User, UserType, LearningPath, Module, Lesson, Quiz, UserProgress
from api.utils import APIException
from api.mail import mail

api = Blueprint('api', __name__)
CORS(api)

EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w+$'


# ============================================================================
# AUTENTICACIÓN (registro + verificación de correo)
# ============================================================================

@api.route('/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Cuerpo de la petición inválido"}), 400

    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Debes proporcionar un correo electrónico válido"}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    existing = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if existing and existing.is_active:
        return jsonify({"error": "El correo ya está registrado y activo. Inicia sesión."}), 400

    if existing and not existing.is_active:
        existing.username = username
        existing.set_password(password)
        user = existing
    else:
        user = User(email=email, username=username,
                    is_active=False, role=UserType.student)
        user.set_password(password)
        db.session.add(user)

    db.session.commit()

    token = create_access_token(
        identity=user.email,
        expires_delta=timedelta(hours=24),
        additional_claims={"type": "verify_email"}
    )
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    verification_link = f"{frontend_url}/verify-email?token={token}"

    try:
        msg = Message(
            subject="Verifica tu cuenta en ALI",
            recipients=[user.email],
            html=f"""
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;
                        padding:32px 24px;line-height:1.6;color:#212529">
              <h2 style="margin:0 0 20px 0">¡Hola{f', {username}' if username else ''}!</h2>
              <p style="margin:0 0 24px 0">
                Gracias por registrarte en ALI. Confirma tu correo para activar tu cuenta:
              </p>
              <p style="margin:0 0 24px 0">
                <a href="{verification_link}"
                   style="display:inline-block;background:#0d6efd;color:#fff;
                          padding:14px 32px;border-radius:6px;text-decoration:none;
                          font-weight:bold">Verificar mi cuenta</a>
              </p>
              <p style="margin:0 0 8px 0;color:#6c757d;font-size:14px">
                Este enlace vence en 24 horas.
              </p>
              <p style="margin:0;color:#6c757d;font-size:14px">
                Si no fuiste tú, ignora este correo de forma segura.
              </p>
            </div>
            """
        )
        mail.send(msg)
    except Exception as e:
        print("Error enviando correo de verificación:", str(e))
        return jsonify({
            "message": "Usuario registrado, pero hubo un error al enviar el correo.",
            "error": str(e)
        }), 500

    return jsonify({"message": "Usuario registrado con éxito. Revisa tu correo para verificar tu cuenta."}), 201


@api.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Cuerpo de la petición inválido"}), 400

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()

    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    if not user.is_active:
        return jsonify({"error": "Debes verificar tu correo antes de iniciar sesión."}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route('/verify-email', methods=['POST'])
def handle_verify_email():
    data = request.get_json()
    token = data.get('token') if data else None
    if not token:
        return jsonify({"error": "No se proporcionó ningún token de verificación."}), 400

    try:
        decoded = decode_token(token)
        if decoded.get('type') != 'verify_email':
            return jsonify({"error": "Tipo de token inválido"}), 400

        email = decoded.get('sub')
        user = db.session.execute(
            db.select(User).filter_by(email=email)
        ).scalar_one_or_none()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        if user.is_active:
            return jsonify({"message": "Tu cuenta ya se encuentra verificada."}), 200

        user.is_active = True
        db.session.commit()
        return jsonify({"message": "¡Cuenta verificada exitosamente! Ya puedes iniciar sesión."}), 200

    except Exception as e:
        return jsonify({"error": "El enlace de verificación es inválido o ha expirado.", "detail": str(e)}), 400


@api.route('/forgot-password', methods=['POST'])
def handle_forgot_password():
    data = request.get_json()
    email = data.get('email', '').strip().lower() if data else ''

    if not email:
        return jsonify({"error": "Debes proporcionar un correo electrónico."}), 400

    user = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()

    # Por seguridad, respondemos igual exista o no el correo (no revelamos
    # si un email está registrado).
    generic_message = "Si el correo existe, hemos enviado las instrucciones para restablecer tu contraseña."

    if not user:
        return jsonify({"message": generic_message}), 200

    token = create_access_token(
        identity=user.email,
        expires_delta=timedelta(hours=1),
        additional_claims={"type": "reset_password"}
    )
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    try:
        msg = Message(
            subject="Recuperación de contraseña - ALI",
            recipients=[user.email],
            html=f"""
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;
                        padding:32px 24px;line-height:1.6;color:#212529">
              <h2 style="margin:0 0 20px 0">Hola{f', {user.username}' if user.username else ''},</h2>
              <p style="margin:0 0 24px 0">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                Haz clic en el siguiente botón para continuar:
              </p>
              <p style="margin:0 0 24px 0">
                <a href="{reset_link}"
                   style="display:inline-block;background:#0d6efd;color:#fff;
                          padding:14px 32px;border-radius:6px;text-decoration:none;
                          font-weight:bold">Restablecer contraseña</a>
              </p>
              <p style="margin:0 0 8px 0;color:#6c757d;font-size:14px">
                Este enlace expirará en 1 hora.
              </p>
              <p style="margin:0;color:#6c757d;font-size:14px">
                Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
              </p>
            </div>
            """
        )
        mail.send(msg)
    except Exception as e:
        print("Error enviando correo de recuperación:", str(e))

    return jsonify({"message": generic_message}), 200


@api.route('/reset-password', methods=['POST'])
def handle_reset_password():
    data = request.get_json()
    token = data.get('token') if data else None
    new_password = data.get('password') if data else None

    if not token or not new_password:
        return jsonify({"error": "Faltan datos para restablecer la contraseña."}), 400
    if len(new_password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    try:
        decoded = decode_token(token)
        if decoded.get('type') != 'reset_password':
            return jsonify({"error": "Tipo de token inválido"}), 400

        email = decoded.get('sub')
        user = db.session.execute(
            db.select(User).filter_by(email=email)
        ).scalar_one_or_none()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        user.set_password(new_password)
        db.session.commit()

        return jsonify({"message": "Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión."}), 200

    except Exception as e:
        return jsonify({"error": "El enlace es inválido o ha expirado.", "detail": str(e)}), 400


# ============================================================================
# RUTAS ORIGINALES DEL PROYECTO (sin cambios)
# ============================================================================

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ---- USERS ----


@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = db.session.execute(db.select(User)).scalars().all()
    return jsonify([u.serialize() for u in users]), 200


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200

# ---- LEARNING PATHS ----


@api.route('/learning-paths', methods=['GET'])
def get_learning_paths():
    paths = db.session.execute(db.select(LearningPath)).scalars().all()
    return jsonify([{"id": p.id, "title": p.title, "image_url": p.image_url, "description": p.description, "time_required": p.time_required, "level": p.level, "number_of_modules": len(p.modules)} for p in paths]), 200


@api.route('/learning-paths/<int:path_id>', methods=['GET'])
def get_learning_path(path_id):
    path = db.session.get(LearningPath, path_id)
    if not path:
        return jsonify({"error": "Learning path not found"}), 404
    return jsonify({
        "id": path.id,
        "title": path.title,
        "image_url": path.image_url,
        "description": path.description,
        "time_required": path.time_required,
        "level": path.level,
        "number_of_modules": len(path.modules),
        "modules": [{"id": m.id, "title": m.title} for m in path.modules]}), 200


@api.route('/learning-paths', methods=['POST'])
@jwt_required()
def create_learning_path():
    body = request.json
    path = LearningPath(title=body["title"], image_url=body.get("image_url"), description=body.get(
        "description"), time_required=body.get("time_required"), level=body.get("level"))
    db.session.add(path)
    db.session.commit()
    return jsonify({"id": path.id, "title": path.title, "image_url": path.image_url, "description": path.description, "time_required": path.time_required, "level": path.level}), 201

# ---- MODULES ----


@api.route('/modules', methods=['GET'])
def get_modules():
    modules = db.session.execute(db.select(Module)).scalars().all()
    return jsonify([{"id": m.id, "title": m.title, "level": m.level, "learning_path_id": m.learning_path_id} for m in modules]), 200


@api.route('/modules/<int:module_id>', methods=['GET'])
def get_module(module_id):
    module = db.session.get(Module, module_id)
    if not module:
        return jsonify({"error": "Module not found"}), 404
    return jsonify({"id": module.id, "title": module.title, "level": module.level}), 200


@api.route('/modules', methods=['POST'])
@jwt_required()
def create_module():
    body = request.json
    module = Module(title=body["title"], level=body.get(
        "level"), learning_path_id=body["learning_path_id"])
    db.session.add(module)
    db.session.commit()
    return jsonify({"id": module.id, "title": module.title}), 201

# ---- LESSONS ----


@api.route('/lessons', methods=['GET'])
def get_lessons():
    lessons = db.session.execute(db.select(Lesson)).scalars().all()
    return jsonify([{"id": l.id, "title": l.title, "module_id": l.module_id, "order_number": l.order_number} for l in lessons]), 200


@api.route('/lessons/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    lesson = db.session.get(Lesson, lesson_id)
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404
    return jsonify({"id": lesson.id, "title": lesson.title, "content": lesson.content}), 200


@api.route('/lessons', methods=['POST'])
@jwt_required()
def create_lesson():
    body = request.json
    lesson = Lesson(
        title=body["title"],
        content=body["content"],
        module_id=body["module_id"],
        order_number=body["order_number"]
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify({"id": lesson.id, "title": lesson.title}), 201

# ---- QUIZZES ----


@api.route('/quizzes/<int:lesson_id>', methods=['GET'])
def get_quiz(lesson_id):
    quiz = db.session.execute(
        db.select(Quiz).filter_by(lesson_id=lesson_id)).scalar()
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify({"id": quiz.id, "questions": quiz.questions_data}), 200


@api.route('/quizzes', methods=['POST'])
@jwt_required()
def create_quiz():
    body = request.json
    quiz = Quiz(lesson_id=body["lesson_id"],
                questions_data=body["questions_data"])
    db.session.add(quiz)
    db.session.commit()
    return jsonify({"id": quiz.id}), 201

# ---- USER PROGRESS ----


@api.route('/progress/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_progress(user_id):
    progress = db.session.execute(
        db.select(UserProgress).filter_by(user_id=user_id)).scalars().all()
    return jsonify([{"lesson_id": p.lesson_id, "is_completed": p.is_completed, "quiz_score": p.quiz_score} for p in progress]), 200


@api.route('/progress', methods=['POST'])
@jwt_required()
def update_progress():
    body = request.json
    progress = UserProgress(
        user_id=body["user_id"],
        lesson_id=body["lesson_id"],
        quiz_score=body.get("quiz_score"),
        is_completed=body.get("is_completed", False)
    )
    db.session.add(progress)
    db.session.commit()
    return jsonify({"message": "Progress saved"}), 201


@api.route('/dashboard', methods=['GET'])
@jwt_required()
def handle_dashboard():
    user_id = get_jwt_identity()
    user = db.get_or_404(User, int(user_id))
    return jsonify({"message": "Bienvenido", "user": user.serialize()}), 200
