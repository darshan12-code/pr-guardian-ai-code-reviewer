# PR Guardian — AI Code Reviewer

PR Guardian is an AI-powered code review assistant that analyzes Git diffs and produces structured feedback about potential bugs, security risks, missing tests, and code quality issues.

## What it does

Users submit a Git diff through a REST API or the web interface. PR Guardian analyzes the changed code and returns:

- Potential bugs and logical issues.
- Security risks, such as unsafe `eval()` usage or possible SQL injection.
- Testing gaps in the submitted changes.
- Style and maintainability suggestions.
- Severity, explanation, suggested fix, and confidence for each finding.

The goal is to help developers identify potential problems before merging code changes.

## How it was built

**Technology stack**

- Frontend: React, Vite, Styled Components.
- Backend: Python, FastAPI.
- AI model: Google Gemini, configured through the `GEMINI_MODEL` environment variable.
- AI integration: Google Gen AI Python SDK (`google-genai`).
- Diff parsing: `unidiff`.
- Data validation: Pydantic.
- Testing: pytest.

**Agent architecture**

The backend parses the submitted Git diff and provides the AI model with three tools:

1. `inspect_changed_files` — identifies changed files and added lines.
2. `scan_security_patterns` — checks added lines for potentially unsafe patterns.
3. `check_test_files` — checks whether test files are included in the submitted diff.

The Gemini model uses function calling to request these tools. The backend executes the requested Python functions and sends their results back to the model.

The model then produces structured review feedback. Pydantic validates the response, and additional checks ensure that reported files and line numbers correspond to the submitted changes.

The submitted code is analyzed as text. PR Guardian does not execute user-submitted code.

## What went wrong and how it was handled

During development, several issues were encountered:

- **Invalid Git diff formatting:** The `unidiff` parser rejected sample diffs when the hunk header's declared line counts did not match the actual added and removed lines. The sample diffs were corrected.
- **FastAPI application startup:** An application initialization/environment issue caused Uvicorn to load incorrectly. The application instance and Python environment were checked.
- **Gemini service availability:** Gemini returned HTTP 503 due to temporary model demand. Model availability and API errors were investigated.
- **Generic AI review errors:** The API returned a generic error while the backend logged the underlying exception. Backend logs were used to investigate failures without exposing internal details to API users.

These issues highlighted the importance of input validation, clear error handling, and separating local tests from external AI API tests.

## What I would do next

- Integrate directly with GitHub pull requests.
- Add repository-level context instead of reviewing only submitted diffs.
- Improve security analysis with dedicated static-analysis tools.
- Add more comprehensive automated tests and mocked AI responses.
- Support larger diffs and multiple programming languages.
- Add review history, authentication, and deployment.
- Evaluate finding accuracy using a curated dataset of known code issues.

## Running locally

### Backend

```bash
cd backend
python -m venv venv
```

Activate the environment and install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_supported_gemini_model
```

Start the API:

```bash
python -m uvicorn main:app --reload
```

API documentation: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

### Run backend tests

From the backend directory:

```bash
pytest -v
```

**Note:** AI-generated findings can be incorrect or incomplete. Results should be reviewed by a developer before acting on them.