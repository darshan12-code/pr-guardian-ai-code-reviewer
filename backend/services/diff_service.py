from unidiff import PatchSet
def parse_diff(diff:str) -> dict:
    """
    Parse a unified Git diff.

    Returns changed files and added lines
    with their actual target line numbers.
    """
    if not diff or not diff.strip():
        raise ValueError("Git diff is empty")
    
    try:
        patch=PatchSet(diff.splitlines(keepends=True))
    except Exception as exc:
        raise ValueError("Unable to parse Git diff"
                         ) from exc
    files=[]
    
    for patched_file in patch:
        path=patched_file.path
        
        if not path or path =="/dev/null":
            continue
        if path.startswith("b/"):
            path=path[2:]
        elif path.startswith("a/"):
            path=path[2:]
        added_lines=[]
        
        for hunk in patched_file:
            for line in hunk:
                if line.is_added:
                    added_lines.append({
                        "line_number": line.target_line_no,
                        "content":line.value.rstrip("\n")
                    })
        files.append({
            "file_path": path,
            "is_added": patched_file.is_added_file,
            "is_removed": patched_file.is_removed_file,
            "added_lines":added_lines
        })
        
        if not files:
            raise ValueError("No changed files found in Git diff")
        
        return {
            "total_files": len(files),
            "files": files
        }
        

def get_changed_line_map(parsed_diff:dict)->dict:
    """ 
    Map each file to its added line numbers.
    """
    
    return {
        file["file_path"]:{
           line["line_number"]
           for line in file["added_lines"] 
        } for file in parsed_diff["files"]
    }