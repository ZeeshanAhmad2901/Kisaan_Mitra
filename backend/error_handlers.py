import logging

from fastapi import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("kisaan_mitra")


async def unexpected_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
        },
    )