import React from 'react';
import styled from 'styled-components';
import { FaHome, FaGamepad, FaQuestionCircle } from 'react-icons/fa';

interface HeaderProps {
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  // Render functions for icons
  const renderHomeIcon = () => {
    const homeIcon = FaHome({ size: 18 });
    return homeIcon;
  };

  const renderGamepadIcon = () => {
    const gamepadIcon = FaGamepad({ size: 18 });
    return gamepadIcon;
  };

  const renderHelpIcon = () => {
    const helpIcon = FaQuestionCircle({ size: 18 });
    return helpIcon;
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src="/HAWL_LOGO.png" alt="Hawl Al-Mamlakah - حول المملكة" />
      </LogoContainer>

      <ButtonsContainer>
        {onReset && (
          <HeaderButton onClick={onReset} title="إنهاء اللعبة">
            {renderHomeIcon()}
            <ButtonText>الخروج للوحة</ButtonText>
          </HeaderButton>
        )}
        <HeaderButton onClick={() => window.location.reload()} title="لعبة جديدة">
          {renderGamepadIcon()}
          <ButtonText>لعبة جديدة</ButtonText>
        </HeaderButton>
        <HeaderButton 
          onClick={() => alert('لعبة حول المملكة! اختبر معلوماتك عن المملكة العربية السعودية')}
          title="عن اللعبة"
        >
          {renderHelpIcon()}
          <ButtonText>عن اللعبة</ButtonText>
        </HeaderButton>
      </ButtonsContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--primary-color);
  color: white;
  height: var(--header-height);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 48px;
  max-width: 100%;
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 42px;
  }
  
  @media (max-width: 480px) {
    height: 36px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const HeaderButton = styled.button`
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all var(--transition-medium);
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    justify-content: center;
    border-radius: 50%;
    width: 36px;
    height: 36px;
  }
`;

const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export default Header; 