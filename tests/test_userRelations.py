import pytest
from backend import schemas

# ______________
# TEST FOR ACTIVITIES
# ______________

def test_get_user_activities(authorized_client, test_activities):
    res = authorized_client.get("user/activities")

    assert len(res.json()) == len(test_activities)
    assert res.status_code == 200

def test_unauthorized_user_get_all_activities(client):
    res = client.get("/user/activities/")
    assert res.status_code == 401

@pytest.mark.parametrize("exercise_name, exercise_weight, exercise_reps, date", [
    ("Squat", 80, 8, "2025-05-20"),
    ("Bench Press", 60, 10, "2025-05-21"),
    ("Deadlift", 120, 5, "2025-05-22"),
    ("Overhead Press", 40, 12, "2025-05-23"),
])

def test_create_activity(
    authorized_client,
    exercise_name, 
    exercise_weight, 
    exercise_reps, 
    date
):
    activity_data = {
        "exercise_name": exercise_name,
        "exercise_weight": exercise_weight,
        "exercise_reps": exercise_reps,
        "date": date
    }
    res = authorized_client.post("/user/activities", json=activity_data)

    created_activity = schemas.ActivitiesOut(**res.json())
    assert res.status_code == 200
    assert created_activity.exercise_name == exercise_name
    assert created_activity.exercise_weight == exercise_weight
    assert created_activity.exercise_reps == exercise_reps
    assert str(created_activity.date) == date

def test_delete_nonexistent_activity(authorized_client):
    res = authorized_client.delete("/user/activities/99999")
    assert res.status_code == 404

def test_delete_activity(authorized_client, test_activities):
    """Test successful activity deletion"""
    res = authorized_client.delete(f"/user/activities/{test_activities[0].id}")
    assert res.status_code == 200
    assert res.json() == {"status": "Successfully deleted"}

# ______________
# TEST FOR BOOKS
# ______________

def test_get_user_books(authorized_client, test_books):
    # Сначала добавим одну книгу пользователю
    res_add = authorized_client.post(f"/user/book/{test_books[0].id}")
    assert res_add.status_code == 200

    # Теперь получим список книг
    res = authorized_client.get("/user/books")
    assert res.status_code == 200

    books = [schemas.BooksOut(**books) for books in res.json()]
    assert books[0].id == test_books[0].id

def test_add_book_to_user(authorized_client, test_books):
    book = test_books[1]  # Murder on the Orient Express
    res = authorized_client.post(f"user/book/{book.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == book.id
    assert data["book_name"] == book.book_name

def test_delete_user_book(authorized_client, test_books):
    # Добавим книгу
    res_add = authorized_client.post(f"/user/book/{test_books[0].id}")
    assert res_add.status_code == 200

    # Удалим её
    res = authorized_client.delete(f"/user/book/{test_books[0].id}")
    assert res.status_code == 200
    assert res.json() == {"status": "Book successfully removed"}

def test_delete_nonexistent_user_book(authorized_client, test_books):
    res = authorized_client.delete(f"/book/{test_books[1].id}")  # книга ещё не добавлена
    assert res.status_code == 404
    assert "Not Found" in res.text

# ______________
# TEST FOR READING
# ______________

def test_add_reading_log(authorized_client, test_books, test_status):
    # Сначала добавим книгу в коллекцию пользователя
    print(test_books, test_status)
    res = authorized_client.post(f"/user/book/{test_books[0].id}")
    assert res.status_code == 200

    reading_payload = {
        "pages_read": 50,
        "date": "2025-05-21",
    }

    res = authorized_client.post(
        f"/user/reading/{test_books[0].id}/status/{test_status[0]}",
        json=reading_payload
    )

    assert res.status_code == 200
    data = schemas.ReadingOut(**res.json())
    assert data.pages_read == reading_payload["pages_read"]
    assert data.book_id == test_books[0].id
    assert data.status_id == test_status[0]

def test_get_user_reading_logs(authorized_client, test_books, test_status):
    # Добавим книгу и создадим лог
    authorized_client.post(f"user/book/{test_books[0].id}")
    authorized_client.post(
        f"user/reading/{test_books[0].id}/status/{test_status[1]}",
        json={"pages_read": 30, "date": "2025-05-20"}
    )

    res = authorized_client.get("user/reading")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert res.json()[0]["id"] == test_books[0].id

def test_delete_reading_log(authorized_client, test_books, test_status):
    # Добавляем книгу и лог
    authorized_client.post(f"user/book/{test_books[1].id}")
    res_log = authorized_client.post(
        f"user/reading/{test_books[1].id}/status/{test_status[0]}",
        json={"pages_read": 120, "date": "2025-05-19"}
    )
    
    reading = schemas.ReadingOut(**res_log.json())

    # Удаляем лог
    res_delete = authorized_client.delete(f"user/reading/{reading.id}")
    assert res_delete.status_code == 200
    assert res_delete.json() == {"status": "Successfully deleted"}

def test_add_reading_log_without_book(authorized_client, test_books, test_status):
    # Не добавляем книгу в коллекцию пользователя
    reading_payload = {
        "pages_read": 50,
        "date": "2025-05-21",
    }

    res = authorized_client.post(
        f"user/reading/{test_books[0].id}/status/{test_status[0]}",
        json=reading_payload
    )
    assert res.status_code == 404
    assert res.json()["detail"] == "Book that user provide doesn't exist in user's collection"


def test_delete_nonexistent_reading_log(authorized_client):
    res = authorized_client.delete("/reading/9999")
    assert res.status_code == 404