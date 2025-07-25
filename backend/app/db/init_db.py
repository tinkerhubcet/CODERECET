from app.db.session import engine
from app.db.base import Base
from app.models import suggestions, keralaSchemes

def init_db():
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()