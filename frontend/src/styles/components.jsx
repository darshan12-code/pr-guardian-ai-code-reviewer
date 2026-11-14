import styled from "styled-components";

export const PageContainer = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 40px 60px;

  @media (max-width: 768px) {
    padding: 20px 16px 40px;
  }
`;

export const Section = styled.section`
  margin-bottom: 28px;
`;

export const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: ${({ theme }) => theme.shadow.small};
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 15px;
    flex-wrap: wrap;
  }
`;

export const PanelBody = styled.div`
  padding: 22px;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

export const Heading = styled.h2`
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "secondary"
        ? theme.colors.border
        : "transparent"};

  border-radius: ${({ theme }) => theme.radius.medium};

  background: ${({ $variant, theme }) =>
    $variant === "secondary"
      ? theme.colors.surface
      : theme.colors.primary};

  color: ${({ $variant, theme }) =>
    $variant === "secondary"
      ? theme.colors.text
      : "#FFFFFF"};

  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) =>
      $variant === "secondary"
        ? theme.colors.surfaceSecondary
        : theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;

  background: ${({ $color, theme }) =>
    theme.colors[`${$color}Light`] || theme.colors.surfaceSecondary};

  color: ${({ $color, theme }) =>
    theme.colors[$color] || theme.colors.textSecondary};
`;

export const EmptyState = styled.div`
  padding: 38px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;