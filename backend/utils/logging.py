"""Structured application logging configuration."""

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from config.settings import settings

_CONFIGURED = False


def configure_logging() -> None:
    """Configure console and rotating-file logging once per process."""
    global _CONFIGURED
    if _CONFIGURED:
        return

    log_dir = Path(settings.base_dir) / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    file_handler = RotatingFileHandler(
        log_dir / "pharmainspect.log", maxBytes=5_000_000, backupCount=3, encoding="utf-8"
    )
    console_handler = logging.StreamHandler()
    for handler in (file_handler, console_handler):
        handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(settings.log_level)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    _CONFIGURED = True


def get_logger(name: str) -> logging.Logger:
    """Get a named application logger."""
    return logging.getLogger(name)
