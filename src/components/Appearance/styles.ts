import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: ${({ theme }) => `rgb(${theme.fontColor || '238, 238, 238'})`};
`;

export const Container = styled.div`
  height: calc(100vh - 40px);
  width: 420px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin: 20px 0 20px 20px;
  background: ${({ theme }) => `rgb(${theme.primaryBackground || '12, 12, 13'})`};
  border: 1px solid ${({ theme }) => theme.cardBorder || 'rgba(255, 255, 255, 0.04)'};
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow-y: auto;
`;

export const FlexWrapper = styled.div`
  width: 100%;

  display: flex;

  > div {
    & + div {
      margin-left: 10px;
    }
  }
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: auto; /* Push to bottom if container flex-direction is column */
  margin-bottom: 20px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: ${({ theme }) => `rgb(${theme.accent || '10, 213, 140'})`};
  color: ${({ theme }) => `rgb(${theme.fontColorSelected || '255, 255, 255'})`};
  
  border: none;
  border-radius: 12px;
  
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px ${({ theme }) => `rgba(${theme.accent || '10, 213, 140'}, 0.3)`};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => `rgba(${theme.accent || '10, 213, 140'}, 0.5)`};
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder || 'rgba(255, 255, 255, 0.1)'};
`;

export const TitleData = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => `rgb(${theme.titleColor || '255, 255, 255'})`};
    margin: 0;
  }

  p {
    font-size: 12px;
    color: ${({ theme }) => theme.fontColor};
    opacity: 0.6;
    margin: 4px 0 0 0;
  }
`;

export const SwitchContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.id === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 4px;
  border-radius: 14px;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
`;

export const SwitchButton = styled.button<{ active?: boolean }>`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  
  /* Active: Green, Inactive: Transparent */
  background: ${({ active, theme }) => active ? `rgb(${theme.accent || '10, 213, 140'})` : 'transparent'}; 
  color: ${({ active, theme }) => active ? `rgb(${theme.fontColorSelected || '255, 255, 255'})` : `rgba(${theme.fontColor}, 0.4)`};
  
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => active ? `rgb(${theme.accent || '10, 213, 140'})` : theme.id === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${({ active, theme }) => active ? `rgb(${theme.fontColorSelected || '255, 255, 255'})` : `rgb(${theme.fontColor})`};
    filter: ${({ active }) => active ? 'brightness(1.1)' : 'none'};
  }
`;

// Tab Layout Components

export const TabbedContainer = styled.div`
  height: 90vh;
  width: 75vw;
  max-width: 1000px;
  display: flex;
  gap: 24px;
  padding: 24px;
  margin: 20px 0 20px 20px;
  background: #131315 !important;
  opacity: 1 !important;
  transform: translate3d(0,0,0);
  backface-visibility: hidden;
  perspective: 1000px;
  position: relative;
  overflow: visible;
`;

export const SidebarNav = styled.div`
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  overflow: visible;
  position: relative;
  background: #131315 !important;
  opacity: 1 !important;
  transform: translate3d(0,0,0);
  backface-visibility: hidden;
  perspective: 1000px;
  z-index: 101; /* Above Options and other overlays */
`;

export const NavList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ContentPanel = styled.div`
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.id === 'dark' ? '#1e1e24 !important' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 12px;
  padding: 15px;
  overflow-y: auto;
  
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 101;
`;

export const NavItem = styled.button<{ active?: boolean; collapsed?: boolean }>`
  width: 100%;
  padding: ${({ collapsed }) => (collapsed ? '12px 0' : '12px 15px')};
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  gap: 12px;
  
  background: ${({ active, theme }) =>
    active
      ? `rgba(${theme.accent || '10, 213, 140'}, 0.15)`
      : 'transparent'
  };
  color: ${({ active, theme }) =>
    active ? `rgb(${theme.fontColor || '255, 255, 255'})` : `rgba(${theme.fontColor || '255, 255, 255'}, 0.5)`
  };
  border: 1px solid ${({ active, theme }) =>
    active ? `rgb(${theme.accent || '10, 213, 140'})` : 'transparent'
  };
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${({ active, theme }) =>
    active
      ? `rgba(${theme.accent || '10, 213, 140'}, 0.2)`
      : 'rgba(255, 255, 255, 0.05)'
  };
    color: rgb(${({ theme }) => theme.fontColor || '255, 255, 255'});
  }
  
  svg {
    font-size: 18px;
    margin: ${({ collapsed }) => (collapsed ? '0' : '0')};
    color: ${({ active, theme }) => active ? `rgb(${theme.accent || '10, 213, 140'})` : 'inherit'};
    transition: all 0.2s ease;
  }
`;
