from pydantic import BaseModel,Field,ConfigDict
from typing import Literal

class ReviewRequest(BaseModel):
    model_config= ConfigDict(extra="forbid")
    diff:str=Field(min_length=10,max_length=50000,description="Git unified diff content")
    
class Finding(BaseModel):
    category: Literal[
        "bug",
        "security",
        "testing",
        "style"
    ]
    
    severity: Literal[
        
        "critical",
        "high",
        "medium",
        "low"
    ]
    
    file_path: str
    line_number: int | None =None
    
    title:str = Field(min_length=3)
    
    explanation:str =Field(min_length=5)
    suggested_fix:str
    
    confidence: float=Field(ge=0,le=1)

class ReviewResponse(BaseModel):
    summary:str
    findings:list[Finding]
    files_reviewed:int
    agent_trace: list[str]=[]
    
    
    