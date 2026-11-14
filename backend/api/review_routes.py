import logging

from fastapi import APIRouter, HTTPException
from schemas import ReviewRequest, ReviewResponse
from agent.orchestrator import run_agent

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/review", response_model=ReviewResponse)
def review_code(request: ReviewRequest):

    try:
        result = run_agent(request.diff)
        return ReviewResponse.model_validate(result)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        logger.exception("Code review request failed")

        status_code = getattr(exc, "code", None)
        if status_code is None:
            status_code = getattr(exc, "status_code", None)

        if status_code == 429:
            raise HTTPException(
                status_code=429,
                detail=(
                    "Gemini API quota exceeded. "
                    "Please wait for your quota to reset or check "
                    "your Google AI Studio billing and rate limits."
                )
            )

        raise HTTPException(
            status_code=502,
            detail="AI code review failed. Check backend logs."
        )