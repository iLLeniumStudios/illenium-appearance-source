import { useNuiState } from '../../hooks/nuiState';
import Section from './components/Section';
import Item from './components/Item';
import { Container, FlexWrapper } from './styles';
import SelectTattoo from './components/SelectTattoo';

import { TattoosSettings, TattooList, Tattoo, AppearanceSettings } from './interfaces';
import Button from './components/Button';

interface TattoosProps {
  settings: TattoosSettings;
  fullSettings: AppearanceSettings;
  data: TattooList;
  storedData: TattooList;
  handleApplyTattoo: (value: Tattoo, opacity: number) => void;
  handlePreviewTattoo: (value: Tattoo, opacity: number) => void;
  handleDeleteTattoo: (value: Tattoo) => void;
  handleClearTattoos: () => void;
  forcedOpen?: boolean;
}

const Tattoos = ({ settings, fullSettings, data, storedData, handleApplyTattoo, handlePreviewTattoo, handleDeleteTattoo, handleClearTattoos, forcedOpen }: TattoosProps) => {
  const { locales } = useNuiState();

  const { items } = settings;
  const keys = Object.keys(items);

  if (!locales) {
    return null;
  }

  return (
    <Section title={locales.tattoos.title} forcedOpen={forcedOpen}>
      {keys.map(key => (
        key !== 'ZONE_HAIR'
        &&
        <Item key={key} title={locales.tattoos.items[key]}>
          <FlexWrapper>
            <SelectTattoo
              handlePreviewTattoo={handlePreviewTattoo}
              handleApplyTattoo={handleApplyTattoo}
              handleDeleteTattoo={handleDeleteTattoo}
              items={items[key]}
              tattoosApplied={data[key] ?? null}
              settings={settings}
              fullSettings={fullSettings}
            />
          </FlexWrapper>
        </Item>
      ))}
      <Item>
        <FlexWrapper>
          <Button onClick={() => handleClearTattoos()} width="100%">{locales.tattoos.deleteAll}</Button>
        </FlexWrapper>
      </Item>
    </Section>
  );
};

export default Tattoos;
