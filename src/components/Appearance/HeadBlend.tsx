import { useNuiState } from '../../hooks/nuiState';

import Section from './components/Section';
import Item from './components/Item';
import RangeInput from './components/RangeInput';

import { PedHeadBlend, AppearanceSettings } from './interfaces';
import ImageSelector from './components/ImageSelector';

interface HeadBlendProps {
  settings: AppearanceSettings;
  storedData: PedHeadBlend;
  data: PedHeadBlend;
  handleHeadBlendChange: (key: keyof PedHeadBlend, value: number) => void;
  forcedOpen?: boolean;
}

const HeadBlend = ({ settings, storedData, data, handleHeadBlendChange, forcedOpen }: HeadBlendProps) => {
  const { locales } = useNuiState();

  if (!locales) {
    return null;
  }

  const isLocal = settings.imageLocal === 'pasta';
  const host = isLocal ? '' : settings.imageUrl;
  const categoryPath = settings.imageSources.heritage;
  const finalBaseUrl = host
    ? `${host.replace(/\/+$/, '')}/${categoryPath.replace(/^\/+|\/+$/g, '')}/`
    : `${categoryPath.replace(/\/+$/, '')}/`;

  const getItems = (min: number, max: number) => {
    const items = [];
    const heritageFolder = settings.imageSources?.heritage || 'peds/';
    for (let i = min; i <= max; i++) {
      const image = isLocal
        ? `${finalBaseUrl}${i}.png`
        : `${host}${heritageFolder}${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const shapeFirstItems = getItems(settings.headBlend.shapeFirst.min, settings.headBlend.shapeFirst.max);
  const shapeSecondItems = getItems(settings.headBlend.shapeSecond.min, settings.headBlend.shapeSecond.max);
  const shapeThirdItems = getItems(settings.headBlend.shapeThird.min, settings.headBlend.shapeThird.max);
  const skinFirstItems = getItems(settings.headBlend.skinFirst.min, settings.headBlend.skinFirst.max);
  const skinSecondItems = getItems(settings.headBlend.skinSecond.min, settings.headBlend.skinSecond.max);
  const skinThirdItems = getItems(settings.headBlend.skinThird.min, settings.headBlend.skinThird.max);

  return (
    <Section title={locales.headBlend.title} forcedOpen={forcedOpen}>
      <Item title={locales.headBlend.shape.title}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <ImageSelector
            label={locales.headBlend.shape.firstOption}
            items={shapeFirstItems}
            selectedValue={data.shapeFirst.toString()}
            onSelect={(id: string) => handleHeadBlendChange('shapeFirst', parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.headBlend.shape.secondOption}
            items={shapeSecondItems}
            selectedValue={data.shapeSecond.toString()}
            onSelect={(id: string) => handleHeadBlendChange('shapeSecond', parseInt(id))}
            onAdd={() => { }}
          />
        </div>
        <RangeInput
          title={locales.headBlend.shape.mix}
          min={settings.headBlend.shapeMix.min}
          max={settings.headBlend.shapeMix.max}
          factor={settings.headBlend.shapeMix.factor}
          defaultValue={data.shapeMix}
          clientValue={storedData.shapeMix}
          onChange={(value: number) => handleHeadBlendChange('shapeMix', value)}
        />
      </Item>
      <Item title={locales.headBlend.skin.title}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <ImageSelector
            label={locales.headBlend.skin.firstOption}
            items={skinFirstItems}
            selectedValue={data.skinFirst.toString()}
            onSelect={(id: string) => handleHeadBlendChange('skinFirst', parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.headBlend.skin.secondOption}
            items={skinSecondItems}
            selectedValue={data.skinSecond.toString()}
            onSelect={(id: string) => handleHeadBlendChange('skinSecond', parseInt(id))}
            onAdd={() => { }}
          />
        </div>
        <RangeInput
          title={locales.headBlend.skin.mix}
          min={settings.headBlend.skinMix.min}
          max={settings.headBlend.skinMix.max}
          factor={settings.headBlend.skinMix.factor}
          defaultValue={data.skinMix}
          clientValue={storedData.skinMix}
          onChange={(value: number) => handleHeadBlendChange('skinMix', value)}
        />
      </Item>
      <Item title={locales.headBlend.race.title}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <ImageSelector
            label={locales.headBlend.race.shape}
            items={shapeThirdItems}
            selectedValue={data.shapeThird.toString()}
            onSelect={(id: string) => handleHeadBlendChange('shapeThird', parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.headBlend.race.skin}
            items={skinThirdItems}
            selectedValue={data.skinThird.toString()}
            onSelect={(id: string) => handleHeadBlendChange('skinThird', parseInt(id))}
            onAdd={() => { }}
          />
        </div>
        <RangeInput
          title={locales.headBlend.race.mix}
          min={settings.headBlend.thirdMix.min}
          max={settings.headBlend.thirdMix.max}
          factor={settings.headBlend.thirdMix.factor}
          defaultValue={data.thirdMix}
          clientValue={storedData.thirdMix}
          onChange={(value: number) => handleHeadBlendChange('thirdMix', value)}
        />
      </Item>
    </Section>
  );
};

export default HeadBlend;
