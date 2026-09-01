import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlsplit

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(ROOT_DIR / ".env")

DEFAULT_CORS_ORIGINS = (
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
)

SUPPORTED_SUPABASE_JWT_ALGORITHMS = {"ES256", "RS256"}


@dataclass(frozen=True)
class Settings:
    app_name: str
    cors_origins: list[str]
    supabase_url: str | None
    supabase_jwt_algorithms: tuple[str, ...]


@lru_cache
def get_settings() -> Settings:
    raw_origins = os.getenv("BACKEND_CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS))
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    supabase_url = _normalize_supabase_url(os.getenv("SUPABASE_URL", ""))
    raw_algorithms = os.getenv("SUPABASE_JWT_ALGORITHMS", "ES256")
    supabase_jwt_algorithms = tuple(
        dict.fromkeys(
            algorithm.strip().upper()
            for algorithm in raw_algorithms.split(",")
            if algorithm.strip()
        )
    )
    if not supabase_jwt_algorithms or any(
        algorithm not in SUPPORTED_SUPABASE_JWT_ALGORITHMS
        for algorithm in supabase_jwt_algorithms
    ):
        supported = ", ".join(sorted(SUPPORTED_SUPABASE_JWT_ALGORITHMS))
        raise ValueError(f"SUPABASE_JWT_ALGORITHMS may contain only: {supported}")

    return Settings(
        app_name=os.getenv("BACKEND_APP_NAME", "Speak AI API"),
        cors_origins=origins,
        supabase_url=supabase_url,
        supabase_jwt_algorithms=supabase_jwt_algorithms,
    )


def _normalize_supabase_url(raw_url: str) -> str | None:
    url = raw_url.strip().rstrip("/")
    if not url:
        return None

    parsed = urlsplit(url)
    try:
        parsed.port
    except ValueError as exc:
        raise ValueError("SUPABASE_URL contains an invalid port") from exc

    if (
        parsed.hostname is None
        or parsed.username is not None
        or parsed.password is not None
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("SUPABASE_URL must be an origin without credentials or a path")

    is_https = parsed.scheme.lower() == "https"
    is_local_http = parsed.scheme.lower() == "http" and parsed.hostname in {
        "localhost",
        "127.0.0.1",
        "::1",
    }
    if not is_https and not is_local_http:
        raise ValueError("SUPABASE_URL must use HTTPS except for loopback development")

    return url
