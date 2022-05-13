import { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: string | ReactNode;
  margin?: string;
  width?: string;
  onClick: () => void;
}

const CustomButton = styled.span<ButtonProps>`
  padding: 5px 12px;
  margin: ${props => props?.margin || "0px"};
  width: ${props => props?.width || "auto"};
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-weight: 200;
  cursor: pointer;
`;

const Button = ({ children, onClick, margin, width }: ButtonProps) => {
  return <CustomButton onClick={onClick} margin={margin} width={width}>{children}</CustomButton>;
};

export default Button;
