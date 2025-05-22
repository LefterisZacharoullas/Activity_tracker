import pytest
from backend import schemas

def test_get_all_books(client, test_books):
    res = client.get("/books")
    
    assert len(res.json()) == len(test_books)
    assert res.status_code == 200

def test_post_book(client):
    book = {
        "book_name": "string",
        "last_page": 0
    }
    res = client.post("/books", json= book)
    books = schemas.BooksOut(**res.json())
    
    assert res.status_code == 200
    assert books.book_name == book["book_name"]
    assert books.last_page == book["last_page"]

def test_get_all_authors(client, test_authors):
    res = client.get("/authors")

    assert len(res.json()) == len(test_authors)
    assert res.status_code == 200

def test_post_author(client):
    author =  {
        "author_name": "string",
        "author_surname": "string"
    }
    res = client.post("/authors" , json= author)
    author_out = schemas.AuthorOut(**res.json())

    assert res.status_code == 200
    assert author_out.author_name == author["author_name"]
    assert author_out.author_surname == author["author_surname"]

@pytest.mark.parametrize("book_data, status_code", [
    ({"book_name": "Only name"}, 422),                      # Missing last_page
    ({"last_page": 10}, 422),                               # Missing book_name
    ({"book_name": "", "last_page": 10}, 422),              # Empty book_name
    ({"book_name": "Test", "last_page": "not a number"}, 422),  # Invalid last_page type
])
def test_post_book_invalid_data(client, book_data, status_code):
    res = client.post("/books", json=book_data)
    assert res.status_code == status_code

@pytest.mark.parametrize("author_data, status_code", [
    ({"author_surname": "Only surname"}, 422),                # Missing author_name
    ({"author_name": "", "author_surname": "Surname"}, 422),  # Empty author_name
])
def test_post_author_invalid_data(client, author_data, status_code):
    res = client.post("/authors", json=author_data)
    assert res.status_code == status_code

def test_get_status(client, test_status):
    res = client.get("/status")

    assert len(res.json()) == len(test_status)
    assert res.status_code == 200

def test_set_author_book(client, test_books, test_authors):
    book = test_books[0]
    author = test_authors[0]

    response = client.post(f"/books/{book.id}/authors/{author.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == author.id
    assert data["author_name"] == author.author_name

def test_set_author_book_twice(client, test_books, test_authors):
    book = test_books[0]
    author = test_authors[0]

    # Первый раз — ОК
    response1 = client.post(f"/books/{book.id}/authors/{author.id}")
    assert response1.status_code == 200

    # Второй раз — должна быть ошибка
    response2 = client.post(f"/books/{book.id}/authors/{author.id}")
    assert response2.status_code == 400
    assert "already related" in response2.text