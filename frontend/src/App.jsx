import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "./components/Header";
import DiffEditor from "./components/DiffEditor";
import ReviewSummary from "./components/ReviewSummary";
import AgentActivity from "./components/AgentActivity";
import FindingsList from "./components/FindingsList";

import { reviewCode, checkBackendHealth } from "./services/reviewService";

import {
  PageContainer,
  Section,
  Heading,
  Description,
  Panel,
  PanelBody,
  Badge,
} from "./styles/components";

const Intro = styled.div`
  margin: 30px 0;

  h1 {
    font-size: 28px;
    letter-spacing: -0.9px;
    font-weight: 750;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 7px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 23px;
    }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ResultsMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const ResultsSidebar = styled.div`
  position: sticky;
  top: 20px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const SummaryText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.8;
`;

const ErrorPanel = styled(Panel)`
  border-color: ${({ theme }) => theme.colors.danger};
`;

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  margin-bottom: 5px;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  overflow-wrap: anywhere;
`;

function App() {
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      const online = await checkBackendHealth();

      if (mounted) {
        setBackendOnline(online);
      }
    };

    checkHealth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleReview = async () => {
    if (!diff.trim()) {
      setError("Please paste or upload a Git diff first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await reviewCode(diff);

      setResult(data);
      setBackendOnline(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header backendOnline={backendOnline} />

      <PageContainer>
        <Intro>
          <h1>Review your code changes</h1>
          <p>
            Find bugs, security vulnerabilities and missing tests before merging
            your pull request.
          </p>
        </Intro>

        <Section>
          <DiffEditor
            diff={diff}
            setDiff={setDiff}
            onReview={handleReview}
            loading={loading}
          />
        </Section>

        {error && (
          <Section>
            <ErrorPanel>
              <PanelBody>
                <ErrorTitle>Review failed</ErrorTitle>
                <ErrorMessage>{error}</ErrorMessage>
              </PanelBody>
            </ErrorPanel>
          </Section>
        )}

        {loading && (
          <Section>
            <Panel>
              <PanelBody>
                <Heading>Analyzing your changes...</Heading>
                <Description>
                  The AI agent is inspecting your diff and executing its review
                  tools. This may take a little while.
                </Description>
              </PanelBody>
            </Panel>
          </Section>
        )}

        {result && !loading && (
          <>
            <Section>
              <ReviewSummary
                findings={result.findings || []}
                filesReviewed={result.files_reviewed || 0}
              />
            </Section>

            <ResultsGrid>
              <ResultsMain>
                <Panel>
                  <PanelBody>
                    <Heading>AI review summary</Heading>

                    <div style={{ marginTop: "12px" }}>
                      <SummaryText>{result.summary}</SummaryText>
                    </div>

                    <div style={{ marginTop: "15px" }}>
                      <Badge $color="success">Review completed</Badge>
                    </div>
                  </PanelBody>
                </Panel>

                <FindingsList
                  findings={result.findings || []}
                  reviewed={true}
                />
              </ResultsMain>

              <ResultsSidebar>
                <AgentActivity
                  trace={result.agent_trace || []}
                  reviewed={true}
                />
              </ResultsSidebar>
            </ResultsGrid>
          </>
        )}

        {!result && !loading && !error && (
          <Section>
            <Panel>
              <PanelBody>
                <Heading>Ready to review?</Heading>
                <Description>
                  Submit a diff to see the AI-generated summary, security
                  findings and agent execution trace here.
                </Description>
              </PanelBody>
            </Panel>
          </Section>
        )}
      </PageContainer>
    </>
  );
}

export default App;
