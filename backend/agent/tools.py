import re
from services.diff_service import parse_diff


def inspect_changed_files(diff:str)-> dict:
    """
    Identify changed files and their added lines.
    """

    parsed=parse_diff(diff)

    return {
        "total_files": parsed["total_files"],
        "files": parsed["files"]
    }

def scan_security_patterns(diff:str):
    """
    Detect common suspicious patterns in added code.

    This is a heuristic scanner, not a full
    security analysis engine.
    """
    parsed=parse_diff(diff)
    patterns={
        "possible_sql_injection":re.compile(
            r"(SELECT|INSERT|UPDATE|DELETE).*"
            r"(\+|\.format\s*\(|f['\"])",
            re.IGNORECASE
        ),
        "unsafe_eval":re.compile(r"\beval\s*\("),
        "unsafe_subprocess": re.compile(
            r"shell\s*=\s*True"
        ),

        "possible_hardcoded_secret": re.compile(
            r"(api[_-]?key|password|secret|token)"
            r"\s*[:=]\s*['\"][^'\"]{8,}['\"]",
            re.IGNORECASE
        )
    }

    matches=[]
    for file in parsed["files"]:
        for line in file["added_lines"]:
            content=line["content"]
            
            for issue,pattern in patterns.items():
                if pattern.search(content):
                    matches.append({
                        "file_path": file["file_path"],
                        "line_number": line["line_number"],
                        "issue":issue,
                        "code":content.strip()
                    })
    return {
        "matches_found":len(matches),
        "matches":matches
    }
    
def check_test_files(diff:str):
    """
    Identify source files and test files changed
    in the submitted diff.

    This does not prove actual test coverage.
    """

    parsed = parse_diff(diff)

    changed_files = [
        file["file_path"]
        for file in parsed["files"]
    ]

    def is_test_file(path: str) -> bool:
        name = path.lower()

        return (
            "/tests/" in name
            or name.startswith("tests/")
            or "/test_" in name
            or name.startswith("test_")
            or ".test." in name
            or ".spec." in name
            or name.endswith("_test.py")
        )

    test_files = [
        path
        for path in changed_files
        if is_test_file(path)
    ]

    source_files = [
        path
        for path in changed_files
        if not is_test_file(path)
    ]

    return {
        "changed_source_files": source_files,
        "changed_test_files": test_files,
        "no_test_files_in_diff": (
            len(source_files) > 0
            and len(test_files) == 0
        ),
        "note": (
            "This checks test files included in the diff. "
            "It cannot determine the repository's full "
            "test coverage."
        )
    }


ALLOWED_TOOLS = {
    "inspect_changed_files": inspect_changed_files,
    "scan_security_patterns": scan_security_patterns,
    "check_test_files": check_test_files,
}

def execute_tool(name, args):
    if name not in ALLOWED_TOOLS:
        raise ValueError("Unsupported tool")

    return ALLOWED_TOOLS[name](**args)