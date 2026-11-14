import styled, { keyframes } from "styled-components";
import { useReviewLoader } from "../services/useReviewLoader";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 16px;
`;

const LoaderCard = styled.div`
  width: 100%;
  max-width: 520px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors?.border || "#e5e7eb"};
  border-radius: 16px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 38px;
  height: 38px;
  margin: 0 auto 20px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Title = styled.h3`
  margin-bottom: 12px;
  font-size: 18px;
`;

const Message = styled.p`
  min-height: 48px;
  color: #6b7280;
  line-height: 1.6;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 16px;
  margin-left: 3px;
  background: #6366f1;
  vertical-align: middle;
  animation: ${blink} 0.8s infinite;
`;

const Timer = styled.div`
  margin-top: 18px;
  color: #9ca3af;
  font-size: 13px;
`;

export default function ReviewLoader() {
  const { typedMessage, elapsedTime, isTakingLong } = useReviewLoader();

  return (
    <LoaderContainer>
      <LoaderCard>
        <Spinner />

        <Title>PR Guardian is on the job</Title>

        <Message aria-live="polite">
          {typedMessage}
          <Cursor />
        </Message>

        <Timer>
          <div>Elapsed time: {elapsedTime}</div>
          <div>
            {isTakingLong
              ? "Still working on your review. Thanks for waiting!"
              : "Most reviews take around 10–30 seconds."}
          </div>
        </Timer>
      </LoaderCard>
    </LoaderContainer>
  );
}
