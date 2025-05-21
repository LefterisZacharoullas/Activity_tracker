from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db
from backend.security import create_access_token
from backend import models
from datetime import date

DB_URL = "sqlite:///:memory:"
engine = create_engine(
    DB_URL,
    connect_args={
        "check_same_thread": False,
    },
    poolclass= StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def client(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)

@pytest.fixture
def test_user2(client) -> dict:
    user_data = {
        "name" : "user2",
        "email": "sanjeev123@gmail.com",
        "password": "1234"
    }
    res = client.post("/auth/signup", json=user_data)

    assert res.status_code == 200

    new_user = res.json()
    new_user['password'] = user_data['password']
    return new_user


@pytest.fixture
def test_user(client) -> dict:
    user_data = {
        "name" : "user",
        "email": "sanjeev@gmail.com",
        "password": "1234"
    }
    res = client.post("/auth/signup", json=user_data)

    assert res.status_code == 200

    new_user = res.json()
    new_user['password'] = user_data['password']
    
    return new_user


@pytest.fixture
def token(test_user):
    return create_access_token(data={"sub": test_user["name"]})


@pytest.fixture
def authorized_client(client, token):
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client


@pytest.fixture
def test_activities(test_user, session) -> list[models.Activities]:
    activities_data = [{ 
        "exercise_name": "Deadlift",
        "exercise_weight": 100,
        "exercise_reps": 5,
        "date": date(2025, 5, 19),
        "user_id": test_user["id"]
    },{
        "exercise_name": "push-ups",
        "exercise_weight": 20,
        "exercise_reps": 20,
        "date": date(2025, 5, 19),
        "user_id": test_user["id"]
    }]

    def create_post_model(activitie):
        return models.Activities(**activitie)

    activitie_map = map(create_post_model, activities_data)
    activities = list(activitie_map)

    session.add_all(activities)
    session.commit()

    activities = session.query(models.Activities).all()
    return activities