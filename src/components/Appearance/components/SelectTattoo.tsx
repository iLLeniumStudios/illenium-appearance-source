import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNuiState } from '../../../hooks/nuiState';
import { FaCheck, FaTrash } from 'react-icons/fa';
import Button from './Button';
import { Tattoo, TattoosSettings, AppearanceSettings } from '../interfaces';
import RangeInput from './RangeInput';
import ImageSelector from './ImageSelector';

interface SelectTattooProps {
  items: Tattoo[];
  tattoosApplied: Tattoo[] | null;
  handleApplyTattoo: (value: Tattoo, opacity: number) => void;
  handlePreviewTattoo: (value: Tattoo, opacity: number) => void;
  handleDeleteTattoo: (value: Tattoo) => void;
  settings: TattoosSettings;
  fullSettings: AppearanceSettings;
}

const Container = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 15px;

  > section {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
  }
`;

const ActionButton = styled.button<{ variant?: 'apply' | 'delete' }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  background: ${({ theme, variant }) =>
    variant === 'apply'
      ? `rgb(${theme.accent || '10, 213, 140'})`
      : '#ff4d4d'
  };
  color: white;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 6px 20px ${({ theme, variant }) =>
    variant === 'apply'
      ? `rgba(${theme.accent || '10, 213, 140'}, 0.4)`
      : 'rgba(255, 77, 77, 0.4)'
  };
  }

  &:active {
    transform: translateY(0);
  }
`;

const SelectTattoo = ({
  items,
  tattoosApplied,
  handleApplyTattoo,
  handlePreviewTattoo,
  handleDeleteTattoo,
  settings,
  fullSettings
}: SelectTattooProps) => {
  const defaultOpacity = 0.1;
  const [currentTattoo, setCurrentTattoo] = useState<Tattoo>(items[0]);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const { locales } = useNuiState();

  const clientOpacity = useCallback(() => {
    if (!tattoosApplied) return defaultOpacity;
    const { name } = currentTattoo;
    for (let i = 0; i < tattoosApplied.length; i++) {
      const { name: nameApplied } = tattoosApplied[i];
      if (nameApplied === name) {
        return tattoosApplied[i].opacity ?? defaultOpacity;
      }
    }
    return defaultOpacity;
  }, [currentTattoo, tattoosApplied])();

  useEffect(() => {
    setOpacity(clientOpacity);
  }, [clientOpacity]);

  const handleChange = (id: string): void => {
    const selectedTattoo = items.find(item => item.name === id);
    if (selectedTattoo) {
      handlePreviewTattoo(selectedTattoo, opacity);
      setCurrentTattoo(selectedTattoo);
    }
  };

  const handleChangeOpacity = useCallback((value: number) => {
    setOpacity(value);
    handlePreviewTattoo(currentTattoo, value);
  }, [currentTattoo, handlePreviewTattoo]);

  const isTattooApplied = useCallback(() => {
    if (!tattoosApplied) return false;
    const { name } = currentTattoo;
    for (let i = 0; i < tattoosApplied.length; i++) {
      const { name: nameApplied } = tattoosApplied[i];
      if (nameApplied === name) return true;
    }
    return false;
  }, [tattoosApplied, currentTattoo])();

  if (!locales) {
    return null;
  }

  // Map tattoos to ImageSelector items
  const selectorItems = items.map(item => {
    const imageLocal = fullSettings.imageLocal;
    const imageUrl = fullSettings.imageUrl;
    const isLocal = imageLocal === 'pasta';
    const baseUrl = isLocal ? 'peds/tattoos/' : imageUrl;
    const tattoosFolder = fullSettings.imageSources?.tattoos || 'peds/tattoos/';

    const image = isLocal
      ? `${baseUrl}${item.name}.png`
      : `${baseUrl}${tattoosFolder}${item.name}.webp`;

    return {
      id: item.name,
      label: item.label,
      image: image
    };
  });

  return (
    <Container>
      <ImageSelector
        items={selectorItems}
        selectedValue={currentTattoo.name}
        onSelect={handleChange}
        onAdd={() => { }}
      />
      <RangeInput
        title={locales.tattoos.opacity}
        min={settings.opacity.min}
        max={settings.opacity.max}
        factor={settings.opacity.factor}
        defaultValue={opacity}
        clientValue={clientOpacity}
        onChange={value => handleChangeOpacity(value)} />
      <section>
        {isTattooApplied ? (
          <ActionButton variant="delete" onClick={() => handleDeleteTattoo(currentTattoo)}>
            <FaTrash size={14} /> {locales.tattoos.delete}
          </ActionButton>
        ) : (
          <ActionButton variant="apply" onClick={() => handleApplyTattoo(currentTattoo, opacity)}>
            <FaCheck size={14} /> {locales.tattoos.apply}
          </ActionButton>
        )}
      </section>
    </Container>
  );
};

export default SelectTattoo;
