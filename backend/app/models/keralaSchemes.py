from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class keralaSchemes(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    tags = Column(String)
    contact_no = Column(Integer)
    source = Column(String, nullable=False)