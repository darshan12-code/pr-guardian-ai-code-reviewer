import styled from "styled-components";
import {
  Heading,
  Description,
} from "../styles/components";

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 19px;
  box-shadow: ${({ theme }) => theme.shadow.small};
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 750;
  letter-spacing: -1px;
  color: ${({ $color, theme }) =>
    theme.colors[$color] || theme.colors.text};
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

function ReviewSummary({ findings = [], filesReviewed = 0 }) {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  findings.forEach((finding) => {
    if (counts[finding.severity] !== undefined) {
      counts[finding.severity] += 1;
    }
  });

  const cards = [
    {
      label: "Critical issues",
      value: counts.critical,
      color: "danger",
    },
    {
      label: "High severity",
      value: counts.high,
      color: "danger",
    },
    {
      label: "Medium severity",
      value: counts.medium,
      color: "warning",
    },
    {
      label: "Files reviewed",
      value: filesReviewed,
      color: "info",
    },
  ];

  return (
    <section>
      <div style={{ marginBottom: "15px" }}>
        <Heading>Review overview</Heading>
        <Description>
          Summary of issues detected in your code changes.
        </Description>
      </div>

      <SummaryGrid>
        {cards.map((card) => (
          <SummaryCard key={card.label}>
            <SummaryValue $color={card.color}>
              {card.value.toString().padStart(2, "0")}
            </SummaryValue>

            <SummaryLabel>{card.label}</SummaryLabel>
          </SummaryCard>
        ))}
      </SummaryGrid>
    </section>
  );
}

export default ReviewSummary;