from models.shared import db

class HostModel(db.Model):
    __tablename__ = 'hosts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    address = db.Column(db.String())
    venueType = db.Column(db.Integer())

    def __init__(self, name, address, venueType):
        self.name = name
        self.address = address
        self.doors = venueType

    def __repr__(self):
        return f"<{self.name}>"