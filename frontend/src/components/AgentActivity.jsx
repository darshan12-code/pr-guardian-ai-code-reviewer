import styled from "styled-components";
import {
  Panel,
  PanelHeader,
  PanelBody,
  Heading,
  Description,
  EmptyState,
} from "../styles/components";

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ActivityIcon = styled.div`
  width: 29px;
  height: 29px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
  font-weight: 700;
`;

const ActivityTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const ActivityDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  margin-top: 2px;
`;

const toolDescriptions = {
  inspect_changed_files: {
    title: "Inspect changed files",
    description: "Parsed files and identified added lines.",
  },
  scan_security_patterns: {
    title: "Security pattern scan",
    description: "Checked changes for potentially unsafe patterns.",
  },
  check_test_files: {
    title: "Check test files",
    description: "Checked which test files were included in the diff.",
  },
};

function AgentActivity({ trace = [], reviewed }) {
  return (
    <Panel>
      <PanelHeader>
        <div>
          <Heading>Agent activity</Heading>
          <Description>
            Tools executed during the review.
          </Description>
        </div>
      </PanelHeader>

      <PanelBody>
        {!reviewed || trace.length === 0 ? (
          <EmptyState>
            Agent activity will appear here after a review.
          </EmptyState>
        ) : (
          <ActivityList>
            {trace.map((tool, index) => {
              const item = toolDescriptions[tool] || {
                title: tool,
                description: "Tool executed by the agent.",
              };

              return (
                <ActivityItem key={`${tool}-${index}`}>
                  <ActivityIcon>✓</ActivityIcon>

                  <div>
                    <ActivityTitle>{item.title}</ActivityTitle>
                    <ActivityDescription>
                      {item.description}
                    </ActivityDescription>
                  </div>
                </ActivityItem>
              );
            })}
          </ActivityList>
        )}
      </PanelBody>
    </Panel>
  );
}

export default AgentActivity;