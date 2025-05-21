import pytest
from backend import schemas

def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {'status': 'This is my server!!!'}

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
    print(test_activities[0].id)
    res = authorized_client.delete(f"/user/activities/{test_activities[0].id}")
    print(res.json())
    assert res.status_code == 200
    assert res.json() == {"status": "Successfully deleted"}