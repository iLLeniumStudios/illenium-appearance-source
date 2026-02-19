import React, { ReactNode } from 'react';
import { MriButton } from '@mriqbox/ui-kit';
import styled from 'styled-components';

interface ButtonProps {
  children: string | ReactNode;
  margin?: string;
  width?: string;
  onClick: () => void;
  disabled?: boolean;
}

const StyledButton = styled(MriButton)`
  background: ${({ theme }) => `rgb(${theme.accent || '10, 213, 140'})`} !important;
  color: ${({ theme }) => `rgb(${theme.fontColorSelected || '255, 255, 255'})`} !important;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px ${({ theme }) => `rgba(${theme.accent || '10, 213, 140'}, 0.25)`};

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
    box-shadow: 0 6px 16px ${({ theme }) => `rgba(${theme.accent || '10, 213, 140'}, 0.4)`};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Button = ({ children, onClick, margin, width, disabled }: ButtonProps) => {
  return (
    <div style={{ width: width || 'auto', margin: margin || '0px' }}>
      <StyledButton
        onClick={onClick}
        disabled={disabled}
        className="w-full"
      >
        {children}
      </StyledButton>
    </div>
  );
};

export default Button;
