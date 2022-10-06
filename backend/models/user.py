from models.shared import db

class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String())
    gender = db.Column(db.String()) #MFO
    postCode = db.Column(db.String())
    # preference?
    # ? google_account: Boolean


    def __init__(self, name, address, artist):
        self.name = name
        self.address = address
        self.artist = artist

    def __repr__(self):
        return f"<{self.name}>"
        