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
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;
  border-radius: ${props => props.theme.borderRadius || '12px'};
  margin-bottom: ${({ active }) => (active ? '10px' : '0')};

  z-index: 2;

  background: ${({ active, theme }) =>
    active
      ? `rgb(${theme.accent || '139, 92, 246'})`
      : `rgba(${theme.fontColor || '255, 255, 255'}, 0.05)`
  };

  color: ${({ active, theme }) => active ? 'white' : `rgba(${theme.fontColor || '255, 255, 255'}, 0.8)`};
  
  border: 1px solid ${({ active, theme }) => active ? 'transparent' : `rgba(${theme.fontColor || '255, 255, 255'}, 0.1)`};
  box-shadow: ${({ active }) => active ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'};

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${({ active, theme }) =>
    active
      ? `rgb(${theme.accent || '139, 92, 246'})`
      : `rgba(${theme.fontColor || '255, 255, 255'}, 0.1)`
  };
    cursor: pointer;
  }

  span {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Items = styled.div`
  padding: 0 2px 5px 2px;

  overflow: hidden;
`;

const Section: React.FC<SectionProps & { forcedOpen?: boolean }> = ({ children, title, deps = [], forcedOpen = false }) => {
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

  if (forcedOpen) {
    return (
      <Container>
        <Items>{children}</Items>
      </Container>
    );
  }

  return (
    <Container style={{ backgroundColor: '#1e1e24', opacity: 1, transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', perspective: '1000px' }}>
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
