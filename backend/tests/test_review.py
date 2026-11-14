
from services.diff_service import (
    parse_diff,
    get_changed_line_map
)

from agent.tools import (
    inspect_changed_files,
    scan_security_patterns,
    check_test_files
)

SAMPLE_DIFF = """diff --git a/users.py b/users.py
--- a/users.py
+++ b/users.py
@@ -1,2 +1,4 @@
 def get_user(user_id):
-    return db.get_user(user_id)
+    query = "SELECT * FROM users WHERE id = " + user_id
+    cursor.execute(query)
+    return eval(query)
"""

def test_parse_diff():

    result = parse_diff(SAMPLE_DIFF)

    assert result["total_files"] == 1

    assert result["files"][0]["file_path"] == "users.py"


def test_changed_line_numbers():

    parsed = parse_diff(SAMPLE_DIFF)

    line_map = get_changed_line_map(parsed)

    assert "users.py" in line_map

    assert len(line_map["users.py"]) == 3


def test_inspect_changed_files():

    result = inspect_changed_files(SAMPLE_DIFF)

    assert result["total_files"] == 1


def test_security_scanner():

    result = scan_security_patterns(SAMPLE_DIFF)

    issues = [
        item["issue"]
        for item in result["matches"]
    ]

    assert "possible_sql_injection" in issues

    assert "unsafe_eval" in issues


def test_test_file_detection():

    result = check_test_files(SAMPLE_DIFF)

    assert result["no_test_files_in_diff"] is True


def test_review_endpoint_without_gemini(client, monkeypatch):
    from api import review_routes

    def fake_run_agent(diff):
        return {
            "summary": "Mock review completed",
            "files_reviewed": 1,
            "findings": [],
            "agent_trace": ["inspect_changed_files"]
        }

    monkeypatch.setattr(
        review_routes,
        "run_agent",
        fake_run_agent
    )

    response = client.post(
        "/api/review",
        json={"diff": "diff --git a/a.py b/a.py\n"}
    )

    assert response.status_code == 200
    assert response.json()["summary"] == "Mock review completed"