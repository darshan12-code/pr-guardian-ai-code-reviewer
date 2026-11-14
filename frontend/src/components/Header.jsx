import styled from "styled-components";

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderContent = styled.div`
  max-width: 1440px;
  margin: auto;
  padding: 16px 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

const Logo = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 21px;
`;

const BrandName = styled.h1`
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.5px;
`;

const BrandDescription = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $connected, theme }) =>
    $connected ? theme.colors.success : theme.colors.danger};
  font-size: 12px;
  font-weight: 600;
`;

const StatusDot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: currentColor;
`;

function Header({ backendOnline }) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Brand>
          <Logo>✦</Logo>

          <div>
            <BrandName>PR Guardian</BrandName>
            <BrandDescription>
              AI-powered code review assistant
            </BrandDescription>
          </div>
        </Brand>

        <Status $connected={backendOnline}>
          <StatusDot />
          {backendOnline ? "Backend connected" : "Backend offline"}
        </Status>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;