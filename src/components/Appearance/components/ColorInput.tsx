import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useNuiState } from '../../../hooks/nuiState';
import styled, { css, keyframes } from 'styled-components';
import { FaPlus } from 'react-icons/fa';

interface ColorInputProps {
  title?: string;
  colors?: number[][];
  defaultValue?: number;
  clientValue?: number;
  colorValue?: string;
  onChange?: (value: number) => void;
  onColorChange?: (color: string) => void;
}

// --- Utilities ---
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const hsvToRgb = (h: number, s: number, v: number) => {
  let r = 0, g = 0, b = 0;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, v };
};

const getClosestColorIndex = (pickedRGB: { r: number, g: number, b: number }, colors: number[][]) => {
  let minDistance = Infinity;
  let minIndex = 0;
  colors.forEach((color, index) => {
    const distance = Math.pow(pickedRGB.r - color[0], 2) + Math.pow(pickedRGB.g - color[1], 2) + Math.pow(pickedRGB.b - color[2], 2);
    if (distance < minDistance) {
      minDistance = distance;
      minIndex = index;
    }
  });
  return minIndex;
};

// --- Styles ---
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
  width: 100%;
  margin-bottom: 20px;

  > span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: ${({ theme }) => `rgb(${theme.fontColor})`};
    opacity: 0.6;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const Swatch = styled.button<{ selected: boolean; colorValue: string }>`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  border: 2px solid ${({ selected, theme }) => (selected ? `rgb(${theme.fontColorSelected || '255, 255, 255'})` : 'transparent')};
  background-color: ${({ colorValue }) => colorValue};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => `rgba(${theme.fontColor}, 0.5)`};
  }
`;

const PickerButton = styled.button<{ selected: boolean; colorValue?: string }>`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  border: 2px solid ${({ selected, theme }) => (selected ? `rgb(${theme.fontColorSelected || '255, 255, 255'})` : `rgba(${theme.fontColor}, 0.1)`)};
  background: ${({ colorValue }) => colorValue || 'rgba(0, 0, 0, 0.2)'};
  color: ${({ theme }) => `rgb(${theme.fontColor})`};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    filter: brightness(1.2);
    border-color: ${({ theme }) => `rgba(${theme.fontColor}, 0.5)`};
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const Dialog = styled.div`
  background: #111111;
  border-radius: 12px;
  padding: 16px;
  width: 320px;
  display: flex; flex-direction: column; gap: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  user-select: none;
`;

const SaturationMap = styled.div<{ hue: number }>`
  width: 100%;
  aspect-ratio: 1.8 / 1;
  border-radius: 8px;
  position: relative;
  background-color: hsl(${({ hue }) => hue * 360}, 100%, 50%);
  background-image: linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent);
  cursor: crosshair;
  overflow: hidden;
`;

const Pointer = styled.div<{ x: number; y: number; color: string }>`
  position: absolute;
  top: ${({ y }) => y * 100}%;
  left: ${({ x }) => x * 100}%;
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 3px solid white;
  background: ${({ color }) => color};
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  pointer-events: none;
`;

const HueSlider = styled.div`
  width: 100%;
  height: 28px;
  border-radius: 14px;
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
  position: relative;
  cursor: pointer;
`;

const HuePointer = styled.div<{ x: number; color: string }>`
  position: absolute;
  top: 50%;
  left: ${({ x }) => x * 100}%;
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 3px solid white;
  background: ${({ color }) => color};
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  pointer-events: none;
`;

const FormatTabs = styled.div`
  display: flex;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  background: ${({ active }) => active ? '#1a1a1a' : 'transparent'};
  color: ${({ active }) => active ? 'white' : 'rgba(255,255,255,0.4)'};
  border: none;
  border-radius: 6px;
  padding: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { color: white; }
`;

const ValueInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  text-align: center;
  font-family: monospace;
  font-size: 15px;
  color: white;
  letter-spacing: 1px;
  outline: none;
  
  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const ColorInput: React.FC<ColorInputProps> = ({ title, colors = [], defaultValue = 0, clientValue, colorValue, onChange, onColorChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [format, setFormat] = useState<'HEX' | 'RGB' | 'HSL'>('HEX');
  const isDragging = useRef(false);

  // HSV state for the picker
  const getInitialHsv = () => {
    if (colorValue) {
      const rgb = colorValue.split(',').map(v => parseInt(v.trim()));
      if (rgb.length === 3) return rgbToHsv(rgb[0], rgb[1], rgb[2]);
    }
    const color = colors[defaultValue] || [255, 0, 0];
    return rgbToHsv(color[0], color[1], color[2]);
  };

  const [hsv, setHsv] = useState(getInitialHsv());

  const satMapRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging.current) return;
    const color = colors[defaultValue] || [255, 0, 0];
    setHsv(rgbToHsv(color[0], color[1], color[2]));
  }, [defaultValue, colors]);

  const handleSatMapMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!satMapRef.current) return;
    const rect = satMapRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    let s = (x - rect.left) / rect.width;
    let v = 1 - (y - rect.top) / rect.height;

    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));

    const newHsv = { ...hsv, s, v };
    setHsv(newHsv);
    updateGameColor(newHsv);

    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  };

  const handleHueMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

    let h = (x - rect.left) / rect.width;
    h = Math.max(0, Math.min(1, h));

    const newHsv = { ...hsv, h };
    setHsv(newHsv);
    updateGameColor(newHsv);

    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  };

  const updateGameColor = (currentHsv: { h: number; s: number; v: number }) => {
    const rgb = hsvToRgb(currentHsv.h, currentHsv.s, currentHsv.v);
    if (onColorChange) {
      onColorChange(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    if (onChange && colors.length > 0) {
      const closestIndex = getClosestColorIndex(rgb, colors);
      onChange(closestIndex);
    }
  };

  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
  const baseHueRgb = hsvToRgb(hsv.h, 1, 1);
  const baseHueColor = `rgb(${baseHueRgb.r}, ${baseHueRgb.g}, ${baseHueRgb.b})`;

  // Brand Presets mapped to closest indices
  const presets = [
    { r: 10, g: 213, b: 140 }, // Green
    { r: 37, g: 99, b: 235 }, // Blue
    { r: 139, g: 92, b: 246 }, // Purple
    { r: 239, g: 68, b: 68 }, // Red
    { r: 249, g: 115, b: 22 }, // Orange
  ];

  const pickedColor = colorValue
    ? colorValue.split(',').map(v => parseInt(v.trim()))
    : (colors[defaultValue] || [255, 0, 0]);
  const pickedColorValue = `rgb(${pickedColor[0]}, ${pickedColor[1]}, ${pickedColor[2]})`;

  const { locales } = useNuiState();

  const isSelected = (r: number, g: number, b: number) => {
    if (colorValue) return colorValue === `${r}, ${g}, ${b}`;
    if (colors.length > 0) return defaultValue === getClosestColorIndex({ r, g, b }, colors);
    return false;
  };

  const isPickerSelected = !presets.some(p => isSelected(p.r, p.g, p.b));

  return (
    <Container>
      <span>
        <small>{title || locales?.headOverlays?.color || 'Cor'}</small>
        {clientValue !== undefined && <small>{clientValue}</small>}
      </span>
      <div>
        {presets.map((color, index) => (
          <Swatch
            key={index}
            colorValue={`rgb(${color.r}, ${color.g}, ${color.b})`}
            selected={isSelected(color.r, color.g, color.b)}
            onClick={() => {
              if (onColorChange) onColorChange(`${color.r}, ${color.g}, ${color.b}`);
              if (onChange && colors.length > 0) onChange(getClosestColorIndex(color, colors));
            }}
          />
        ))}
        <PickerButton
          selected={isPickerSelected}
          colorValue={pickedColorValue}
          onClick={() => setIsDialogOpen(true)}
        >
          {isPickerSelected ? null : <FaPlus />}
        </PickerButton>
      </div>

      {isDialogOpen && (
        <DialogOverlay onClick={() => setIsDialogOpen(false)}>
          <Dialog onClick={(e) => e.stopPropagation()}>
            <SaturationMap
              ref={satMapRef}
              hue={hsv.h}
              onMouseDown={(e) => {
                isDragging.current = true;
                handleSatMapMove(e);
                const moveHandler = (me: MouseEvent) => handleSatMapMove(me);
                const upHandler = () => {
                  isDragging.current = false;
                  window.removeEventListener('mousemove', moveHandler);
                  window.removeEventListener('mouseup', upHandler);
                };
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
              }}
            >
              <Pointer x={hsv.s} y={1 - hsv.v} color={currentHex} />
            </SaturationMap>

            <HueSlider
              ref={hueSliderRef}
              onMouseDown={(e) => {
                isDragging.current = true;
                handleHueMove(e);
                const moveHandler = (me: MouseEvent) => handleHueMove(me);
                const upHandler = () => {
                  isDragging.current = false;
                  window.removeEventListener('mousemove', moveHandler);
                  window.removeEventListener('mouseup', upHandler);
                };
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
              }}
            >
              <HuePointer x={hsv.h} color={baseHueColor} />
            </HueSlider>

            <FormatTabs>
              {(['HEX', 'RGB', 'HSL'] as const).map(f => (
                <TabButton key={f} active={format === f} onClick={() => setFormat(f)}>{f}</TabButton>
              ))}
            </FormatTabs>

            <ValueInput
              value={(() => {
                if (format === 'RGB') return `${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}`;
                if (format === 'HSL') {
                  // HSV to HSL conversion for display
                  const l = (2 - hsv.s) * hsv.v / 2;
                  const s = l && l < 1 ? hsv.s * hsv.v / (l < 0.5 ? l * 2 : 2 - l * 2) : hsv.s;
                  return `${Math.round(hsv.h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
                }
                return currentHex.toUpperCase();
              })()}
              onChange={(e) => {
                const val = e.target.value;
                if (format === 'HEX' && /^#[0-9A-F]{6}$/i.test(val)) {
                  const rgb = hexToRgb(val);
                  const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                  setHsv(newHsv);
                  updateGameColor(newHsv);
                }
                // (RGB/HSL input could be added here if needed, keeping it readonly-ish for now or just HEX)
              }}
              readOnly={format !== 'HEX'}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <button
                onClick={() => setIsDialogOpen(false)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  background: 'rgb(10, 213, 140)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </div>
          </Dialog>
        </DialogOverlay>
      )}
    </Container>
  );
};

export default ColorInput;
