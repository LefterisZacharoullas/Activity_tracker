import pytest
from backend import schemas

# -----------------------------
# GET /todo
# -----------------------------
def test_get_all_user_todos(authorized_client, test_todos):
    res = authorized_client.get("user/todo")
    assert res.status_code == 200
    assert len(res.json()) == len(test_todos)

def test_unauthorized_get_todos(client):
    res = client.get("user/todo")
    assert res.status_code == 401

# -----------------------------
# GET /todo/{status_id}
# -----------------------------
def test_get_todos_by_status(authorized_client, test_status, test_todos):
    res = authorized_client.get(f"user/todo/{test_status[0]}")
    assert res.status_code == 200
    for todo in res.json():
        assert todo["status_id"] == test_status[0]

def test_get_todos_by_invalid_status(authorized_client):
    res = authorized_client.get("user/todo/9999")
    assert res.status_code == 404

# -----------------------------
# POST /todo/{status_id}
# -----------------------------
@pytest.mark.parametrize("text, date", [
    ("Buy milk", "2025-05-20"),
    ("Read a book", "2025-05-21"),
    ("Go to the gym", "2025-05-22"),
])
def test_create_todo(authorized_client, test_status, text, date):
    todo_data = {"text": text, "date_created" : date}
    res = authorized_client.post(f"user/todo/{test_status[0]}", json=todo_data)

    created = schemas.TodoOut(**res.json())
    assert res.status_code == 200
    assert created.text == text
    assert created.status_id == test_status[0]

def test_create_duplicate_todo(authorized_client, test_status, test_todos):
    todo_data = {"text": test_todos[0].text, "date_created" : str(test_todos[0].date_created)}
    res = authorized_client.post(f"user/todo/{test_status[0]}", json=todo_data)
    assert res.status_code == 400

# -----------------------------
# DELETE /todo/{todo_id}
# -----------------------------
def test_delete_todo(authorized_client, test_todos):
    res = authorized_client.delete(f"user/todo/{test_todos[0].id}")
    assert res.status_code == 200
    assert res.json() == {"status": "Successfully deleted"}

def test_delete_nonexistent_todo(authorized_client):
    res = authorized_client.delete("user/todo/9999")
    assert res.status_code == 404
