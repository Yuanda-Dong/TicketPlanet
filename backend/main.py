from flask import Flask, jsonify, render_template,request
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models.shared import db
from models.cars import CarsModel
from models.host import HostModel
from models.user import UserModel

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
db.init_app(app)
migrate = Migrate(app, db)



@app.route('/')
def index():
    return jsonify({"Choo Choo": "This is the home page🚅"})
    
# @app.route('/login/google')
# def google_login():

    
@app.route('/cars', methods=['POST', 'GET'])
def handle_cars():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_car = CarsModel(name=data['name'], model=data['model'], doors=data['doors'])
            db.session.add(new_car)
            db.session.commit()
            return {"message": f"car {new_car.name} has been created successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        cars = CarsModel.query.all()
        results = [
            {
                "name": car.name,
                "model": car.model,
                "doors": car.doors
            } for car in cars]

        return {"count": len(results), "cars": results}


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))

