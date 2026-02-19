import styled from 'styled-components';
import { ReactNode } from 'react';

interface ItemProps {
  title?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

const Container = styled.div`
  margin-top: 0.5rem;

  display: flex;
  flex-direction: column;

  padding: 16px;
  border-radius: 8px;

  background: #1e1e24 !important;
  opacity: 1 !important;
  transform: translate3d(0,0,0);
  backface-visibility: hidden;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  span {
    color: rgba(${props => props.theme.fontColor || '255, 255, 255'}, 0.7);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Inputs = styled.div`
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;

  margin-top: 10px;

  > div {
    & + div {
      margin-top: 10px;
    }
  }
`;

const Item: React.FC<ItemProps> = ({ children, title, style }) => {
  return (
    <Container style={style}>
      {title && <span>{title}</span>}
      <Inputs>{children}</Inputs>
    </Container>
  );
};

export default Item;
