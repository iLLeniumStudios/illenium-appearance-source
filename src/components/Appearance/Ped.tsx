import { useNuiState } from '../../hooks/nuiState';

import Section from './components/Section';
import Item from './components/Item';
import { FaMale, FaFemale, FaUser } from 'react-icons/fa';
import ImageSelector from './components/ImageSelector';

import { AppearanceSettings } from './interfaces';

interface PedProps {
  settings: AppearanceSettings;
  storedData: string;
  data: string;
  handleModelChange: (value: string) => void;
  forcedOpen?: boolean;
}

const Ped = ({ settings, storedData, data, handleModelChange, forcedOpen }: PedProps) => {
  const { locales } = useNuiState();

  if (!locales) {
    return null;
  }

  const modelItems = settings.ped.model.items.map((model: string) => {
    let icon = <FaUser />;
    if (model.includes('_m_') || model.toLowerCase().includes('male')) {
      icon = <FaMale />;
    } else if (model.includes('_f_') || model.toLowerCase().includes('female')) {
      icon = <FaFemale />;
    }

    const imageLocal = settings.imageLocal;
    const imageUrl = settings.imageUrl;
    const isLocal = imageLocal === 'pasta';
    const baseUrl = isLocal ? 'peds/' : imageUrl;
    const pedsFolder = settings.imageSources?.peds || 'peds/';

    const image = isLocal
      ? `${baseUrl}${model}.png`
      : `${baseUrl}${pedsFolder}${model}.webp`;

    return {
      id: model,
      icon: icon,
      image: image
    };
  });

  return (
    <Section title={locales.ped.title} forcedOpen={forcedOpen}>
      <Item title={locales.ped.model} style={{ minHeight: '600px' }}>
        <ImageSelector
          items={modelItems}
          selectedValue={data}
          onSelect={handleModelChange}
          onAdd={() => console.log('Add custom model')}
        />
      </Item>
    </Section>
  );
};

export default Ped;
