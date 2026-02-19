import { useState, useCallback } from 'react';
import styled, { css, useTheme } from 'styled-components';
import {
  FaUndo,
  FaRedo,
  FaTimes, // Exit
  FaSyncAlt, // Turn Around
  FaSearch, // Zoom
  FaLightbulb, // Light
  FaMouse, // Rotate icon (visual)
  FaCamera,
  FaTshirt,
  FaHatCowboy,
  FaSocks,
  FaMale,
  FaSmile,
  FaShoePrints
} from 'react-icons/fa';

import { CameraState, ClothesState, RotateState } from './interfaces';

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
  enableExit: boolean;
  layout: 'accordion' | 'tabs';
  collapsed?: boolean;
}

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh;
  padding: 40px 0;
  margin-left: 10px;
  pointer-events: auto; /* Changed from none to auto to ensure clickability in CEF */
  z-index: 100;
  flex-shrink: 0;
`;

const Strip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto; /* Changed from none to auto */
  
  & > * {
    pointer-events: auto;
  }
`;

const RoundButton = styled.button<{ active?: boolean; variant?: 'primary' | 'danger' | 'default' }>`
  pointer-events: auto;
  height: 40px;
  width: 40px;
  
  display: flex;
  align-items: center;
  justify-content: center;
 
  border: 0;
  border-radius: 50%;

  color: ${({ theme }) => `rgb(${theme.fontColor || '255, 255, 255'})`};
  
  /* Variant Backgrounds */
  ${({ variant, active, theme }) => {
    if (variant === 'danger') return 'background: #ef4444;'; // Red
    if (variant === 'primary' || active) return `background: rgb(${theme.accent || '10, 213, 140'});`; // Emerald
    return 'background: #28282d;'; // Default Dark
  }}

  /* Hover Effects */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.1);
    ${({ variant, active, theme }) => {
    if (variant === 'danger') return 'background: rgba(220, 38, 38, 1);';
    if (variant === 'primary' || active) return `background: rgb(${theme.accent || '10, 213, 140'}); filter: brightness(1.1);`;
    return 'background: rgba(60, 60, 65, 0.9);';
  }}
  }

  svg {
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
  }
`;

// --- Sub Menu (Flyout) ---
const Flyout = styled.div<{ show: boolean }>`
  position: absolute;
  left: 100%; /* Append to the right side */
  top: 0;
  margin-left: 10px; /* Gap between main button and flyout */
  
  display: flex;
  gap: 8px;
  
  opacity: ${({ show }) => (show ? 1 : 0)};
  transform: translateX(${({ show }) => (show ? '0' : '-10px')});
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  
  transition: all 0.2s ease;
`;

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
  enableExit,
  layout,
  collapsed
}) => {
  const [showClothes, setShowClothes] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const theme = useTheme() as any;

  return (
    <OptionsContainer>
      {/* --- Top: Mode Toggles --- */}
      <Strip>
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowCamera(true)}
          onMouseLeave={() => setShowCamera(false)}
        >
          <RoundButton active={showCamera} variant="primary">
            <FaCamera size={18} />
          </RoundButton>
          <Flyout show={showCamera}>
            <RoundButton onClick={() => handleSetCamera('head')} active={camera.head} title="Head">
              <FaSmile size={16} />
            </RoundButton>
            <RoundButton onClick={() => handleSetCamera('body')} active={camera.body} title="Body">
              <FaMale size={16} />
            </RoundButton>
            <RoundButton onClick={() => handleSetCamera('bottom')} active={camera.bottom} title="Feet">
              <FaShoePrints size={16} />
            </RoundButton>
          </Flyout>
        </div>

        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowClothes(true)}
          onMouseLeave={() => setShowClothes(false)}
        >
          <RoundButton active={showClothes} variant="default">
            <FaTshirt size={18} />
          </RoundButton>
          <Flyout show={showClothes}>
            <RoundButton onClick={() => handleSetClothes('head')} active={clothes.head} title="Hat">
              <FaHatCowboy size={16} />
            </RoundButton>
            <RoundButton onClick={() => handleSetClothes('body')} active={clothes.body} title="Shirt">
              <FaTshirt size={16} />
            </RoundButton>
            <RoundButton onClick={() => handleSetClothes('bottom')} active={clothes.bottom} title="Pants">
              <FaSocks size={16} />
            </RoundButton>
          </Flyout>
        </div>
      </Strip>

      {/* --- Bottom: Actions --- */}
      <Strip>
        <RoundButton onClick={handleRotateLeft}>
          <FaUndo size={14} />
        </RoundButton>
        <RoundButton onClick={handleRotateRight}>
          <FaRedo size={14} />
        </RoundButton>
        <RoundButton onClick={handleTurnAround} variant="primary">
          <FaSyncAlt size={14} />
        </RoundButton>
        {enableExit && (
          <RoundButton
            onClick={handleExit}
            variant="primary"
          >
            <FaTimes size={16} />
          </RoundButton>
        )}
      </Strip>
    </OptionsContainer>
  );
};

export default Options;


