import { useMemo, useState } from "react";
import styled from "styled-components";
import FindingCard from "./FindingCard";
import {
  Panel,
  PanelHeader,
  Heading,
  Description,
  EmptyState,
} from "../styles/components";

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 7px 12px;
  border-radius: 20px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : theme.colors.surface};

  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};

  font-size: 11px;
  font-weight: 600;
`;

const FindingsContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const filters = [
  "all",
  "critical",
  "high",
  "medium",
  "low",
];

function FindingsList({ findings = [], reviewed }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredFindings = useMemo(() => {
    if (activeFilter === "all") return findings;

    return findings.filter(
      (finding) => finding.severity?.toLowerCase() === activeFilter
    );
  }, [findings, activeFilter]);

  return (
    <Panel>
      <PanelHeader>
        <div>
          <Heading>Code review findings</Heading>
          <Description>
            {findings.length} issue(s) identified.
          </Description>
        </div>
      </PanelHeader>

      <FindingsContainer>
        <FilterBar>
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              $active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "all"
                ? "All findings"
                : filter.toUpperCase()}
            </FilterButton>
          ))}
        </FilterBar>

        {!reviewed ? (
          <EmptyState>
            Submit a Git diff to see code review findings.
          </EmptyState>
        ) : filteredFindings.length === 0 ? (
          <EmptyState>
            No findings in this category.
          </EmptyState>
        ) : (
          filteredFindings.map((finding, index) => (
            <FindingCard
              key={`${finding.file_path}-${finding.line_number}-${index}`}
              finding={finding}
            />
          ))
        )}
      </FindingsContainer>
    </Panel>
  );
}

export default FindingsList;