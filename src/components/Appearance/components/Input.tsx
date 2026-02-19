import { useCallback } from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MriButton, MriInput } from '@mriqbox/ui-kit';

interface InputProps {
  title?: string;
  min?: number;
  max?: number;
  blacklisted?: number[];
  defaultValue: number;
  clientValue: number;
  onChange: (value: number) => void;
}

const Container = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: ${({ title }) => (title ? '5px' : '0')};

  > span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-weight: 200;
    margin-bottom: 5px;
  }

  > div {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const Input: React.FC<InputProps> = ({ title, min = 0, max = 255, blacklisted = [], defaultValue, clientValue, onChange }) => {
  const isBlacklisted = function (_value: number, blacklisted: number[]) {
    for (var i = 0; i < blacklisted.length; i++) {
      if (blacklisted[i] == _value) {
        return true
      }
    }
    return false
  }

  const normalize = function (_value: number) {
    if (_value < min) {
      _value = max;
    } else if (_value > max) {
      _value = min;
    }

    return _value;
  }

  const checkBlacklisted = function (_value: number, blacklisted: number[], factor: number) {
    if (factor === 0) {
      if (!isBlacklisted(_value, blacklisted)) {
        return normalize(_value);
      }
      factor = _value > defaultValue ? 1 : -1;
    }

    do {
      _value = normalize(_value + factor);
    } while (isBlacklisted(_value, blacklisted))
    return _value;
  };

  const getSafeValue = useCallback(
    (_value: number, factor: number) => {
      let safeValue = _value;

      return checkBlacklisted(safeValue, blacklisted, factor);
    },
    [min, max, blacklisted],
  );

  const handleChange = useCallback(
    (_value: any, factor: number) => {
      let parsedValue;

      if (!_value && _value !== 0) return;

      if (Number.isNaN(_value)) return;

      if (typeof _value === 'string') {
        parsedValue = parseInt(_value);
      } else {
        parsedValue = _value;
      }

      const safeValue = getSafeValue(parsedValue, factor);

      onChange(safeValue);
    },
    [getSafeValue, onChange],
  );

  return (
    <Container>
      <span>
        <small>{title}</small>
        <small>{clientValue} / {max}</small>
      </span>
      <div>
        <MriButton size="icon" variant="secondary" onClick={() => handleChange(defaultValue, -1)}>
          <FiChevronLeft />
        </MriButton>
        <div style={{ flex: 1 }}>
          <MriInput
            type="number"
            value={defaultValue}
            onChange={e => handleChange(e.target.value, 0)}
            className="text-center"
          />
        </div>
        <MriButton size="icon" variant="secondary" onClick={() => handleChange(defaultValue, 1)}>
          <FiChevronRight />
        </MriButton>
      </div>
    </Container>
  );
};

export default Input;
