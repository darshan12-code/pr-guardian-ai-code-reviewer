import { useState } from "react";
import styled from "styled-components";
import { Badge, Button } from "../styles/components";

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ $severity, theme }) => {
    if ($severity === "critical" || $severity === "high") {
      return theme.colors.danger;
    }
    if ($severity === "medium") return theme.colors.warning;
    return theme.colors.success;
  }};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 18px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const FindingTitle = styled.h3`
  font-size: 14px;
  font-weight: 650;
`;

const Metadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  margin-top: 8px;
`;

const Explanation = styled.p`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.7;
`;

const FixContainer = styled.div`
  margin-top: 14px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.colors.successLight};
`;

const FixLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 5px;
`;

const FixText = styled.p`
  color: #166534;
  font-size: 12px;
  line-height: 1.6;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
`;

function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false);

  const severityColors = {
    critical: "danger",
    high: "danger",
    medium: "warning",
    low: "success",
  };

  const severity = finding.severity?.toLowerCase() || "low";

  const confidence = Number(finding.confidence);

  return (
    <Card $severity={severity}>
      <TopRow>
        <div>
          <FindingTitle>{finding.title}</FindingTitle>

          <Metadata>
            <span>{finding.file_path}</span>
            {finding.line_number != null && (
              <span>Line {finding.line_number}</span>
            )}
            <span>
              {finding.category?.toUpperCase()}
            </span>
          </Metadata>
        </div>

        <Badge $color={severityColors[severity] || "info"}>
          {severity.toUpperCase()}
        </Badge>
      </TopRow>

      <Explanation>
        {finding.explanation}
      </Explanation>

      {finding.suggested_fix && (
        <FixContainer>
          <FixLabel>Suggested fix</FixLabel>
          <FixText>{finding.suggested_fix}</FixText>
        </FixContainer>
      )}

      <BottomRow>
        <Metadata>
          Confidence:{" "}
          {Number.isFinite(confidence)
            ? `${Math.round(confidence * 100)}%`
            : "Not provided"}
        </Metadata>

        <Button
          $variant="secondary"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide details" : "Details"}
        </Button>
      </BottomRow>

      {expanded && (
        <Explanation>
          Category: {finding.category || "Not specified"}
          <br />
          File: {finding.file_path}
          <br />
          Line: {finding.line_number ?? "Not specified"}
        </Explanation>
      )}
    </Card>
  );
}

export default FindingCard;