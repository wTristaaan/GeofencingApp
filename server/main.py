# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape   


DATABASE_URL = "postgresql://postgres:password@localhost/geodb"
#DATABASE_URL = "postgresql://geodb_d4g4_user:CDoCva52F0uWg1gWczc2m1W8uJC3560v@dpg-cub0im52ng1s73al8gcg-a/geodb_d4g4"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèle de la base de données
class Coordinate(Base):
    __tablename__ = "coordinates"
    id = Column(Integer, primary_key=True, index=True)
    geom = Column(Geometry('POINT', srid=4326))
    accuracy = Column(Float)

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CoordinateModel(BaseModel):
    latitude: float
    longitude: float
    accuracy: float
    timestamp: int

class CoordinateResponse(BaseModel):
    id: int
    geom: str
    accuracy: float

@app.post("/coordinates")
async def receive_coordinates(coordinates: List[CoordinateModel]):
    if len(coordinates) != 15:
        raise HTTPException(status_code=400, detail="The list must contain exactly 15 coordinates")

    db = SessionLocal()
    try:
        for coord in coordinates:
            db_coord = Coordinate(
                geom=f'SRID=4326;POINT({coord.longitude} {coord.latitude})',
                accuracy=coord.accuracy,
            )
            db.add(db_coord)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error inserting coordinates: {e}")

        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
    return {"message": "Coordinates received", "count": len(coordinates)}


@app.get("/coordinates", response_model=List[CoordinateResponse])
def get_coordinates():
    db = SessionLocal()
    coordinates = db.query(Coordinate).all()
    return [
        CoordinateResponse(
            id=coord.id,
            geom=to_shape(coord.geom).wkt,
            accuracy=coord.accuracy,
        )
        for coord in coordinates
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
