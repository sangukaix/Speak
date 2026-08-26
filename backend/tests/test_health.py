from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_check_allows_configured_web_origin() -> None:
    response = client.get(
        "/health",
        headers={"Origin": "http://127.0.0.1:8081"},
    )

    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:8081"
