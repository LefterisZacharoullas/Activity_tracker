from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, StaticPool, select
from sqlalchemy.orm import sessionmaker, Session
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

@pytest.fixture
def test_books(session: Session) -> list[models.Books]:
    books_data = [
        {"book_name": "Foundation", "last_page": 255},
        {"book_name": "Murder on the Orient Express", "last_page": 312}
    ]
    session.add_all([models.Books(**book) for book in books_data])
    session.commit()
    return session.scalars(select(models.Books)).all()

@pytest.fixture
def test_authors(session: Session) -> list[models.Author]:
    author_data = [
        {"author_name": "Lefteris", "author_surname": "Zacharoullas"},
        {"author_name": "authoruser", "author_surname": "autrhossurname"}
    ]
    session.add_all([models.Author(**author) for author in author_data])
    session.commit()
    return session.scalars(select(models.Author)).all()

@pytest.fixture
def test_status(session: Session) -> list[int]:
    status_data = [
        {"status": "Not Started"},
        {"status": "In Progress"},
        {"status": "Completed"}
    ]

    status_list = [models.Status(**data) for data in status_data]

    session.add_all(status_list)
    session.commit()

    return [status.id for status in status_list]

@pytest.fixture
def test_todos(session: Session, test_user, test_status) -> list[models.Todo]:
    print(test_user)
    todo_data = [
        {"text": "Buy milk", "status_id": test_status[0], "user_id": test_user["id"], "date_created" : date(2025, 5, 19)},
        {"text": "Read a book", "status_id": test_status[1], "user_id": test_user["id"], "date_created" : date(2025, 5, 20)},
        {"text": "Go to the gym", "status_id": test_status[2], "user_id": test_user["id"], "date_created" : date(2025, 5, 29)},
    ]
    session.add_all([models.Todo(**data) for data in todo_data])
    session.commit()
    return session.scalars(select(models.Todo)).all()