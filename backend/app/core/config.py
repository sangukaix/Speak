import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(ROOT_DIR / ".env")

DEFAULT_CORS_ORIGINS = (
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
)


@dataclass(frozen=True)
class Settings:
    app_name: str
    cors_origins: list[str]


@lru_cache
def get_settings() -> Settings:
    raw_origins = os.getenv("BACKEND_CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS))
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    return Settings(
        app_name=os.getenv("BACKEND_APP_NAME", "Speak AI API"),
        cors_origins=origins,
    )
