from models.shared import db

class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    address = db.Column(db.String())
    artist = db.Column(db.String())

    def __init__(self, name, address, artist):
        self.name = name
        self.address = address
        self.artist = artist

    def __repr__(self):
        return f"<{self.name}>"