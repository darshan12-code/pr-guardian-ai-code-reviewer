# PR Guardian: Evaluation Checklist

This checklist is used to verify the functionality, reliability, and safety of the PR Guardian AI code reviewer.

**Testing principle:** Run local tests first. Use Gemini API calls only for the final end-to-end verification and cases where model behaviour must be evaluated.

## 1. Environment and setup

- [ ] Python virtual environment is activated.
- [ ] Backend dependencies are installed.
- [ ] Gemini API key is configured in `backend/.env`.
- [ ] `.env` is excluded from Git.
- [ ] Correct Gemini model is configured.
- [ ] Frontend dependencies are installed.
- [ ] Backend starts without errors.
- [ ] Frontend starts without errors.

## 2. Backend API

- [ ] `GET /health` returns a healthy status.
- [ ] `GET /docs` displays the FastAPI documentation.
- [ ] `GET /openapi.json` returns the API schema.
- [ ] `POST /api/review` accepts a valid Git diff.
- [ ] Empty diffs are rejected.
- [ ] Invalid request payloads are rejected.
- [ ] Oversized diffs are rejected.
- [ ] Unexpected AI errors are handled without exposing API keys or internal stack traces.

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

- [ ] `inspect_changed_files` identifies changed files.
- [ ] `scan_security_patterns` detects a possible SQL injection pattern.
- [ ] `scan_security_patterns` detects unsafe `eval()` usage.
- [ ] Security scanner does not report unchanged lines as newly introduced issues.
- [ ] `check_test_files` identifies test files included in the diff.
- [ ] Missing test files are reported when source files change without test files in the submitted diff.
- [ ] Tool outputs have the expected structure.

## 5. AI agent and structured feedback

- [ ] Gemini function calling is configured correctly.
- [ ] The backend executes only approved tools.
- [ ] Tool results are returned to the model.
- [ ] The agent trace reflects actual tool executions.
- [ ] The final response follows the expected JSON schema.
- [ ] Pydantic rejects invalid response structures.
- [ ] Findings contain valid categories and severity values.
- [ ] Finding file paths correspond to files in the submitted diff.
- [ ] Finding line numbers correspond to permitted changed lines.
- [ ] Findings contain explanations and suggested fixes.
- [ ] The agent avoids inventing findings when no issue is present.

## 6. Frontend

- [ ] User can paste a Git diff.
- [ ] User can upload a `.diff` file.
- [ ] User can submit a review.
- [ ] Loading state is displayed during review.
- [ ] API errors are displayed clearly.
- [ ] Review summary is displayed.
- [ ] Findings display category and severity.
- [ ] Suggested fixes are visible.
- [ ] Agent activity is displayed from the actual backend response.
- [ ] Empty results are handled gracefully.

## 7. Reliability and security

- [ ] Gemini API keys are never exposed in frontend code.
- [ ] `.env` is not committed to GitHub.
- [ ] Submitted code is treated as untrusted input.
- [ ] Submitted code is never executed.
- [ ] File paths and line references are validated.
- [ ] Invalid diffs do not crash the application.
- [ ] Gemini API failures are handled gracefully.
- [ ] Large requests are restricted by input validation.

## 8. Final acceptance test

- [ ] Submit a diff containing a deliberately unsafe SQL query.
- [ ] Confirm the security scanner detects the suspicious pattern.
- [ ] Submit a diff containing unsafe `eval()` usage.
- [ ] Confirm the review returns structured feedback.
- [ ] Submit a diff with no obvious issues.
- [ ] Confirm the agent does not invent a critical vulnerability.
- [ ] Verify the frontend displays the results correctly.
- [ ] Verify the GitHub repository contains no secrets or virtual environments.
- [ ] Record a short demonstration of the working application.

## Test results

| Area | Status | Notes |
|---|---|---|
| Environment | Not yet verified | |
| API | Not yet verified | |
| Diff parser | Not yet verified | |
| Agent tools | Not yet verified | |
| Gemini integration | Not yet verified | |
| Frontend | Not yet verified | |
| Security | Not yet verified | |

**Important:** Do not mark a test as passed unless it has actually been executed and verified. A missing test file in the submitted diff does not prove that the full repository has no tests.