from flask import Blueprint, request, jsonify
from app.models import User  # Your SQLAlchemy model

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    from app import db, bcrypt
    data = request.get_json()  # or request.json if using JSON

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone'),
        country=data.get('country')
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    from app import db, bcrypt
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful",
                        "user": {
                            "id": user.id,           # ✅ Send user ID
                            "email": user.email,
                        }}), 200
    else:
        return jsonify({"message": "Incorrect password"}), 401