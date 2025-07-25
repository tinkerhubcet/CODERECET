from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Suggestions(Base):
    __tablename__ = "suggestions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    tags = Column(String, nullable=False)
    location = Column(String, nullable=False)
    sentiment = Column(String, nullable=False)