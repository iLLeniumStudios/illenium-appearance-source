import { useState, useRef, useEffect, ReactElement, useCallback, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  FaVideo,
  FaStreetView,
  FaUndo,
  FaRedo,
  FaSmile,
  FaMale,
  FaShoePrints,
  FaSave,
  FaTimes,
  FaTshirt,
  FaHatCowboy,
  FaSocks,
} from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';

import { CameraState, ClothesState, RotateState } from './interfaces';

interface ToggleButtonProps {
  active: boolean;
}

interface ToggleOptionProps {
  active: boolean;
  onClick: () => void;
  children?: ReactNode;
}

interface ExtendendContainerProps {
  width: number;
}

interface ExtendendOptionProps {
  icon: ReactElement;
  children?: ReactNode;
}

interface OptionsProps {
  camera: CameraState;
  rotate: RotateState;
  clothes: ClothesState;
  handleSetClothes: (key: keyof ClothesState) => void;
  handleSetCamera: (key: keyof CameraState) => void;
  handleTurnAround: () => void;
  handleRotateLeft: () => void;
  handleRotateRight: () => void;
  handleSave: () => void;
  handleExit: () => void;
}

const Container = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 40px 0;

  > * {
    & + * {
      margin-top: 10px;
    }
  }
`;

const ToggleButton = styled.button<ToggleButtonProps>`
  height: 40px;
  width: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 3vh;

  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.2);

  transition: all 0.2s;

  color: rgba(255, 255, 255, 0.9);
  background: rgba(23, 23, 23, 0.7);

  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(220, 20, 60, 0.9);
    transition: background 0.2s;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.8);
  }

  ${({ active }) =>
    active &&
    css`
      color: rgba(255, 255, 255, 0.7);
      background: rgba(220, 20, 60);

      &:hover {
        color: rgba(255, 255, 255, 0.9);
        background: rgba(220, 20, 60, 1);
        transition: background 0.2s;
      }
    `}
`;

const Option = styled.button`
  height: 40px;
  width: 40px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border: 0;
  border-radius: 3vh;

  box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.2);

  transition: all 0.1s;

  color: rgba(255, 255, 255, 0.9);
  background: rgba(23, 23, 23, 0.7);

  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(220, 20, 60, 0.9);
    transition: background 0.2s;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.8);
    color: rgba(23, 23, 23, 0.7);
    background: rgba(220, 20, 60);
  }
`;

const ExtendedContainer = styled.div<ExtendendContainerProps>`
  height: 40px;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  width: ${({ width }) => `${width + 40}px`};

  transition: width 0.3s;

  overflow: hidden;
`;

const ExtendedIcon = styled.div`
  height: 40px;
  width: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border: 0;
  border-radius: 3vh;

  color: rgba(255, 255, 255, 0.9);
  background: rgba(23, 23, 23, 0.7);
`;

const ExtendedChildren = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  padding-left: 10px;

  > * {
    & + * {
      margin-left: 10px;
    }
  }
`;

const ToggleOption: React.FC<ToggleOptionProps> = ({ children, active, onClick }) => {
  return (
    <ToggleButton type="button" active={active} onClick={onClick}>
      {children}
    </ToggleButton>
  );
};

const ExtendedOption: React.FC<ExtendendOptionProps> = ({ children, icon }) => {
  const [extended, setExtended] = useState(true);

  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
      setExtended(false);
    }
  }, [ref, setWidth]);

  const handleMouseEnter = useCallback(() => {
    setExtended(true);
  }, [setExtended]);

  const handleMouseLeave = useCallback(() => {
    setExtended(false);
  }, [setExtended]);

  return (
    <ExtendedContainer width={extended ? width : 0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ExtendedIcon>{icon}</ExtendedIcon>
      <ExtendedChildren ref={ref}>{children}</ExtendedChildren>
    </ExtendedContainer>
  );
};

const Options: React.FC<OptionsProps> = ({
  camera,
  rotate,
  clothes,
  handleSetClothes,
  handleSetCamera,
  handleTurnAround,
  handleRotateLeft,
  handleRotateRight,
  handleExit,
  handleSave,
}) => {
  return (
    <Container>
      <ExtendedOption icon={<FaVideo size={20} />}>
        <ToggleOption active={camera.head} onClick={() => handleSetCamera('head')}>
          <FaSmile size={20} />
        </ToggleOption>
        <ToggleOption active={camera.body} onClick={() => handleSetCamera('body')}>
          <FaMale size={20} />
        </ToggleOption>
        <ToggleOption active={camera.bottom} onClick={() => handleSetCamera('bottom')}>
          <FaShoePrints size={20} />
        </ToggleOption>
      </ExtendedOption>
      <ExtendedOption icon={<GiClothes size={20} />}>
        <ToggleOption active={clothes.head} onClick={() => handleSetClothes('head')}>
          <FaHatCowboy size={20} />
        </ToggleOption>
        <ToggleOption active={clothes.body} onClick={() => handleSetClothes('body')}>
          <FaTshirt size={20} />
        </ToggleOption>
        <ToggleOption active={clothes.bottom} onClick={() => handleSetClothes('bottom')}>
          <FaSocks size={20} />
        </ToggleOption>
      </ExtendedOption>
      <Option onClick={handleTurnAround}>
        <FaStreetView size={20} />
      </Option>
      <ToggleOption active={rotate.left} onClick={handleRotateLeft}>
        <FaRedo size={20} />
      </ToggleOption>
      <ToggleOption active={rotate.right} onClick={handleRotateRight}>
        <FaUndo size={20} />
      </ToggleOption>
      <Option onClick={handleSave}>
        <FaSave size={20} />
      </Option>
      <Option onClick={handleExit}>
        <FaTimes size={20} />
      </Option>
    </Container>
  );
};

export default Options;
