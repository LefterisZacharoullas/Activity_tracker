import pytest

# -----------------------------
# RATE LIMIT TESTS
# -----------------------------
def test_get_user_info_rate_limit(authorized_client):
    # 20 allowed per minute
    for i in range(20):
        res = authorized_client.get("user/user_info")
        assert res.status_code == 200

    # 21st should be blocked
    res = authorized_client.get("user/user_info")
    assert res.status_code == 429
    assert "rate limit exceeded" in res.text.lower()

def test_update_user_info_rate_limit(authorized_client):
    data = {"bio": "Rate test"}
    for i in range(10):
        res = authorized_client.patch("user/user_info", json=data)
        assert res.status_code == 200

    res = authorized_client.patch("user/user_info", json=data)
    assert res.status_code == 429

def test_update_password_rate_limit(authorized_client):
    for i in range(10):
        res = authorized_client.patch("user/update_password", params={"password": f"TestPass{i}"})
        assert res.status_code == 200

    res = authorized_client.patch("user/update_password", params={"password": "FinalFail"})
    assert res.status_code == 429
