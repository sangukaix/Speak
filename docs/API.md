# API

Base URL in local development: `http://localhost:8000`.

## GET /health

Reports whether the FastAPI process can serve requests. Authentication is not required.

Response `200 OK`:

```json
{
  "status": "ok"
}
```

This endpoint currently checks application availability only. It does not claim that planned database or AI services are connected.
