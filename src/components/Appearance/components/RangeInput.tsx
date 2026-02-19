import { useCallback, useRef } from 'react';
import styled from 'styled-components';

interface RangeInputProps {
  title?: string;
  min: number;
  max: number;
  factor?: number;
  defaultValue?: number;
  clientValue?: number;
  onChange: (value: number) => void;
}

const Container = styled.div`
  width: 100%;

    color: ${({ theme }) => `rgb(${theme.fontColor || '255, 255, 255'})`};

  > div {
    display: flex;
    align-items: center;

    position: relative;

    margin-top: 10px;

    > small {
      font-weight: 200;
      font-size: 8px;
    }
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 15px;
    background: ${({ theme }) => theme.id === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    outline: none;
    opacity: 1;
    border-radius: 2px;
    margin: 0 10px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 17px;
    height: 17px;
    background: ${({ theme }) => `rgb(${theme.fontColorSelected || '255, 255, 255'})`};
    border: 2px solid ${({ theme }) => `rgb(${theme.accent})`};
    cursor: pointer;
    border-radius: 50%;
  }
`;

const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  factor = 1,
  title,
  defaultValue = 1,
  clientValue,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleChange = useCallback(
    (e: { target: { value: string } }) => {
      const parsedValue = parseFloat(e.target.value);
      onChange(parsedValue);
    },
    [onChange],
  );

  return (
    <Container onClick={handleContainerClick}>
      <span>
        <small>
          {title}: {defaultValue}
        </small>
        <small>{clientValue}</small>
      </span>
      <div>
        <small>{min}</small>
        <input
          type="range"
          ref={inputRef}
          value={defaultValue}
          min={min}
          max={max}
          step={factor}
          onChange={handleChange}
        />
        <small>{max}</small>
      </div>
    </Container>
  );
};

export default RangeInput;
