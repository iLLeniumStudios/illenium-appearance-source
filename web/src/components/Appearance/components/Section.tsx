import { useState, useEffect, useRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useSpring, animated } from 'react-spring';

interface SectionProps {
  title: string;
  deps?: any[];
  children?: ReactNode;
}

interface HeaderProps {
  active: boolean;
}

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  color: rgba(${props => props.theme.fontColor || '255, 255, 255'}, 1);

  user-select: none;

  & + div {
    margin-top: 10px;
  }
`;

const Header = styled.div<HeaderProps>`
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;
  border-radius: ${props => props.theme.borderRadius || '4px'};

  z-index: 2;

  background: rgba(${props => props.theme.secondaryBackground || '0, 0, 0'}, ${({ active }) => (active ? '0.9' : '0.7')});

  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.2);

  transition: background 0.1s;

  &:hover {
    background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 0.9);
    transform: scale(1.05);
    transition: background 0.2s;
    cursor: pointer;
  }

  ${({ active }) =>
    active &&
    css`
      background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 1);
      &:hover {
        ${props => props.theme.smoothBackgroundTransition ? 'transition: background 0.2s;' : ''}
        background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 1);
      }
    `}

  span {
    font-size: 15px;
    font-weight: ${props => props.theme.sectionFontWeight || 'normal'};
  }
`;

const Items = styled.div`
  padding: 0 2px 5px 2px;

  overflow: hidden;
`;

const Section: React.FC<SectionProps> = ({ children, title, deps = [] }) => {
  const [active, setActive] = useState(false);

  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const props = useSpring({
    height: active ? height : 0,
    opacity: active ? 1 : 0,
  });

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, setHeight]);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, setHeight, deps]);

  return (
    <Container>
      <Header active={active} onClick={() => setActive(state => !state)}>
        <span>{title}</span>
        {active ? <FiChevronUp size={30} /> : <FiChevronDown size={30} />}
      </Header>

      <animated.div style={{ ...props, overflow: 'hidden' }}>
        <Items ref={ref}>{children}</Items>
      </animated.div>
    </Container>
  );
};

export default Section;
