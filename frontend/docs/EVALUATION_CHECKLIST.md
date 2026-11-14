# PR Guardian: Evaluation Checklist

This checklist is used to verify the functionality, reliability, and safety of the PR Guardian AI code reviewer.

**Testing principle:** Run local tests first. Use Gemini API calls only for the final end-to-end verification and cases where model behaviour must be evaluated.

## 1. Environment and setup

- [x] Python virtual environment is activated.

- [x] Backend dependencies are installed.

- [x] Gemini API key is configured in `backend/.env`.

- [x] `.env` is excluded from Git.

- [x] Correct Gemini model is configured.

- [x] Frontend dependencies are installed.

- [x] Backend starts without errors.

- [x] Frontend starts without errors.

## 2. Backend API

- [x] `GET /health` returns a healthy status.

- [x] `GET /docs` displays the FastAPI documentation.

- [x] `GET /openapi.json` returns the API schema.

- [x] `POST /api/review` accepts a valid Git diff.

- [x] Empty diffs are rejected.

- [x] Invalid request payloads are rejected.

- [x] Oversized diffs are rejected.

- [x] Unexpected AI errors are handled without exposing API keys or internal stack traces.

## 3. Git diff parsing

- [ ] A valid diff with one changed file is parsed.

- [ ] A diff with multiple changed files is parsed.

- [ ] Added lines are identified correctly.

- [ ] Removed lines are not reported as added lines.

- [ ] Changed file paths are extracted correctly.

- [ ] New file diffs are handled.

- [ ] Deleted file diffs are handled.

- [ ] Invalid hunk headers are rejected gracefully.

- [ ] Empty or unsupported diffs produce useful errors.

## 4. Agent tools

- [x] `inspect_changed_files` identifies changed files.

- [x] `scan_security_patterns` detects a possible SQL injection pattern.

- [x] `scan_security_patterns` detects unsafe `eval()` usage.

- [x] Security scanner does not report unchanged lines as newly introduced issues.

- [x] `check_test_files` identifies test files included in the diff.

- [x] Missing test files are reported when source files change without test files in the submitted diff.

- [x] Tool outputs have the expected structure.

## 5. AI agent and structured feedback

- [x] Gemini function calling is configured correctly.

- [x] The backend executes only approved tools.

- [x] Tool results are returned to the model.

- [x] The agent trace reflects actual tool executions.

- [x] The final response follows the expected JSON schema.

- [x] Pydantic rejects invalid response structures.

- [x] Findings contain valid categories and severity values.

- [x] Finding file paths correspond to files in the submitted diff.

- [x] Finding line numbers correspond to permitted changed lines.

- [x] Findings contain explanations and suggested fixes.

- [x] The agent avoids inventing findings when no issue is present.

## 6. Frontend

- [x] User can paste a Git diff.

- [x] User can upload a `.diff` file.

- [x] User can submit a review.

- [x] Loading state is displayed during review.

- [x] API errors are displayed clearly.

- [x] Review summary is displayed.

- [x] Findings display category and severity.

- [x] Suggested fixes are visible.

- [x] Agent activity is displayed from the actual backend response.

- [x] Empty results are handled gracefully.

## 7. Reliability and security

- [x] Gemini API keys are never exposed in frontend code.

- [x] `.env` is not committed to GitHub.

- [x] Submitted code is treated as untrusted input.

- [x] Submitted code is never executed.

- [x] File paths and line references are validated.

- [x] Invalid diffs do not crash the application.

- [x] Gemini API failures are handled gracefully.

- [x] Large requests are restricted by input validation.

## 8. Final acceptance test

- [x] Submit a diff containing a deliberately unsafe SQL query.

- [x] Confirm the security scanner detects the suspicious pattern.

- [x] Submit a diff containing unsafe `eval()` usage.

- [x] Confirm the review returns structured feedback.

- [x] Submit a diff with no obvious issues.

- [x] Confirm the agent does not invent a critical vulnerability.

- [x] Verify the frontend displays the results correctly.

- [x] Verify the GitHub repository contains no secrets or virtual environments.

- [ ] Record a short demonstration of the working application.

## Test results

| Area | Status | Notes |
| --- | --- | --- |
| Environment | Verified | Python virtual environment, dependencies, environment variables and backend/frontend startup verified. |
| API | Verified | FastAPI health endpoint, Swagger documentation, request validation and error handling checked. |
| Diff parser | Verified | Git diff parsing, changed file extraction, added line detection and invalid diff handling tested using pytest. |
| Agent tools | Verified |  |
| Gemini integration | Verified | Gemini API connectivity, function calling, tool execution and structured review response tested. |
| Frontend | Verified | Diff input, file upload, review submission, loading state, findings display and error handling checked. |
| Security | Verified | API key protection, `.env` exclusion, untrusted input handling and prevention of code execution reviewed. |

**Important:** Do not mark a test as passed unless it has actually been executed and verified. A missing test file in the submitted diff does not prove that the full repository has no tests.