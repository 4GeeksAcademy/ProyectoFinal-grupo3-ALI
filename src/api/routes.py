from flask import request, jsonify, Blueprint
from api.models import db, User, LearningPath, Module, Lesson, Quiz, UserProgress
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
CORS(api)

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
