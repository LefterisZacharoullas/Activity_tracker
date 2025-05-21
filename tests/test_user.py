import pytest

def test_get_user_info(authorized_client, test_user):
    res = authorized_client.get("/user/user_info")
    assert res.status_code == 200
    assert res.json()["email"] == test_user["email"]


def test_update_user_info(authorized_client):
    update_data = {"surname": "UpdatedName", "email": "hello@gmail.com"}
    res = authorized_client.patch("/user/user_info", json=update_data)
    assert res.status_code == 200
    assert res.json()["surname"] == "UpdatedName"
    assert res.json()["email"] == "hello@gmail.com"


def test_change_user_name_valid(authorized_client):
    new_name = "NewUniqueName"
    res = authorized_client.patch(f"/user/user_name?name={new_name}")
    assert res.status_code == 200
    assert res.json()["name"] == new_name


def test_change_user_name_duplicate(authorized_client, test_user2):
    # Attempt to change the authorized user's name to the name of test_user2, expect conflict
    new_name = test_user2["name"]
    res = authorized_client.patch(f"/user/user_name?name={new_name}")
    assert res.status_code == 400
    assert res.json()["detail"] == "User with this name already exist"

@pytest.mark.parametrize("invalid_name", ["John123", "Name!", "123", "Name_"])
def test_change_user_name_invalid_chars(authorized_client, invalid_name):
    res = authorized_client.patch(f"/user/user_name?name={invalid_name}")
    assert res.status_code == 422
    assert res.json()["detail"] == "Name must contain only letters"


def test_update_password(authorized_client):
    res = authorized_client.patch("/user/update_password?password=newsecurepass123")
    assert res.status_code == 200
    assert res.json()["status"] == "your new password was set"
