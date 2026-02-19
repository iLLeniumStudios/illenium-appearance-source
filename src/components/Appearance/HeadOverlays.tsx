import { useNuiState } from '../../hooks/nuiState';

import Section from './components/Section';
import Item from './components/Item';
import Input from './components/Input';
import ColorInput from './components/ColorInput';
import RangeInput from './components/RangeInput';

import {
  AppearanceSettings,
  PedHair,
  PedHeadOverlays,
  PedHeadOverlayValue,
  Tattoo
} from './interfaces';
import { useCallback } from 'react';
import ImageSelector from './components/ImageSelector';

import { FlexWrapper } from './styles';

interface HeadOverlaysProps {
  settings: AppearanceSettings;
  storedData: {
    hair: PedHair;
    headOverlays: PedHeadOverlays;
    eyeColor: number;
    fade: Tattoo | null;
  };
  data: {
    hair: PedHair;
    headOverlays: PedHeadOverlays;
    eyeColor: number;
    fade: Tattoo | null;
  };
  isPedFreemodeModel: boolean | undefined;
  isPedMale: boolean | undefined;
  handleHairChange: (key: keyof PedHair, value: number) => void;
  handleHeadOverlayChange: (key: keyof PedHeadOverlays, option: keyof PedHeadOverlayValue, value: number) => void;
  handleEyeColorChange: (value: number) => void;
  handleChangeFade: (value: number) => void;
  automaticFade: boolean;
  forcedOpen?: boolean;
}

const HeadOverlays = ({
  settings,
  storedData,
  data,
  isPedFreemodeModel,
  isPedMale,
  handleHairChange,
  handleHeadOverlayChange,
  handleEyeColorChange,
  handleChangeFade,
  automaticFade,
  forcedOpen
}: HeadOverlaysProps) => {
  const { locales } = useNuiState();

  if (!locales) {
    return null;
  }

  const isLocal = settings.imageLocal === 'pasta';
  const host = isLocal ? '' : settings.imageUrl;
  const categoryPath = settings.imageSources.appearance;
  const finalBaseUrl = host
    ? `${host.replace(/\/+$/, '')}/${categoryPath.replace(/^\/+|\/+$/g, '')}/`
    : `${categoryPath.replace(/\/+$/, '')}/`;

  const getItems = (min: number, max: number, category: string) => {
    const items = [];
    const genderPrefix = isPedMale ? 'male' : 'female';
    for (let i = min; i <= max; i++) {
      const image = isLocal
        ? `${finalBaseUrl}${category}/${i}.png`
        : `${host}${categoryPath}${genderPrefix}_${category}_${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const fadeValue = useCallback(() => {
    const indexFade = settings?.fade?.findIndex(tattoo => tattoo.name === data.fade?.name)

    return indexFade >= 0 ? indexFade : 0
  }, [data.fade?.name])()

  const storedFadeValue = useCallback(() => {
    const indexFade = settings?.fade?.findIndex(tattoo => tattoo.name === storedData.fade?.name)

    return indexFade >= 0 ? indexFade : 0
  }, [storedData.fade?.name])()

  return (
    <Section title={locales.headOverlays.title} deps={[settings]} forcedOpen={forcedOpen}>
      <Item title={locales.headOverlays.hair.title}>
        <FlexWrapper>
          <ImageSelector
            label={locales.headOverlays.hair.style}
            items={getItems(settings.hair.style.min, settings.hair.style.max, 'hair')}
            selectedValue={data.hair.style.toString()}
            onSelect={id => handleHairChange('style', parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.headOverlays.hair.texture}
            items={getItems(settings.hair.texture.min, settings.hair.texture.max, 'hair_texture')}
            selectedValue={data.hair.texture.toString()}
            onSelect={id => handleHairChange('texture', parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
        {isPedFreemodeModel && (
          <>
            {!automaticFade && (
              <ImageSelector
                label={locales.headOverlays.hair.fade}
                items={getItems(0, settings.fade.length - 1, 'hair_fade')}
                selectedValue={fadeValue.toString()}
                onSelect={id => handleChangeFade(parseInt(id))}
                onAdd={() => { }}
              />
            )}
            <ColorInput
              title={locales.headOverlays.hair.color}
              colors={settings.hair.color.items}
              defaultValue={data.hair.color}
              clientValue={storedData.hair.color}
              onChange={value => handleHairChange('color', value)}
            />
            <ColorInput
              title={locales.headOverlays.hair.highlight}
              colors={settings.hair.highlight.items}
              defaultValue={data.hair.highlight}
              onChange={value => handleHairChange('highlight', value)}
            />
          </>)}
      </Item>
      {isPedFreemodeModel && (
        <>
          <Item title={locales.headOverlays.eyebrows}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.eyebrows.opacity.min}
              max={settings.headOverlays.eyebrows.opacity.max}
              factor={settings.headOverlays.eyebrows.opacity.factor}
              defaultValue={data.headOverlays.eyebrows.opacity}
              clientValue={storedData.headOverlays.eyebrows.opacity}
              onChange={value => handleHeadOverlayChange('eyebrows', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.eyebrows.style.min, settings.headOverlays.eyebrows.style.max, 'eyebrows')}
              selectedValue={data.headOverlays.eyebrows.style.toString()}
              onSelect={id => handleHeadOverlayChange('eyebrows', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.eyebrows.color?.items}
              defaultValue={data.headOverlays.eyebrows.color}
              clientValue={storedData.headOverlays.eyebrows.color}
              onChange={value => handleHeadOverlayChange('eyebrows', 'color', value)}
            />
          </Item>
          <Item title={locales.headOverlays.eyeColor}>
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.eyeColor.min, settings.eyeColor.max, 'eyes')}
              selectedValue={data.eyeColor.toString()}
              onSelect={id => handleEyeColorChange(parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.makeUp}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.makeUp.opacity.min}
              max={settings.headOverlays.makeUp.opacity.max}
              factor={settings.headOverlays.makeUp.opacity.factor}
              defaultValue={data.headOverlays.makeUp.opacity}
              clientValue={storedData.headOverlays.makeUp.opacity}
              onChange={value => handleHeadOverlayChange('makeUp', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.makeUp.style.min, settings.headOverlays.makeUp.style.max, 'makeup')}
              selectedValue={data.headOverlays.makeUp.style.toString()}
              onSelect={id => handleHeadOverlayChange('makeUp', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.makeUp.color?.items}
              defaultValue={data.headOverlays.makeUp.color}
              clientValue={storedData.headOverlays.makeUp.color}
              onChange={value => handleHeadOverlayChange('makeUp', 'color', value)}
            />
            <ColorInput
              title={locales.headOverlays.secondColor}
              colors={settings.headOverlays.makeUp.color?.items}
              defaultValue={data.headOverlays.makeUp.secondColor}
              clientValue={storedData.headOverlays.makeUp.secondColor}
              onChange={value => handleHeadOverlayChange('makeUp', 'secondColor', value)}
            />
          </Item>
          <Item title={locales.headOverlays.blush}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.blush.opacity.min}
              max={settings.headOverlays.blush.opacity.max}
              factor={settings.headOverlays.blush.opacity.factor}
              defaultValue={data.headOverlays.blush.opacity}
              clientValue={storedData.headOverlays.blush.opacity}
              onChange={value => handleHeadOverlayChange('blush', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.blush.style.min, settings.headOverlays.blush.style.max, 'blush')}
              selectedValue={data.headOverlays.blush.style.toString()}
              onSelect={id => handleHeadOverlayChange('blush', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.blush.color?.items}
              defaultValue={data.headOverlays.blush.color}
              clientValue={storedData.headOverlays.blush.color}
              onChange={value => handleHeadOverlayChange('blush', 'color', value)}
            />
          </Item>
          <Item title={locales.headOverlays.lipstick}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.lipstick.opacity.min}
              max={settings.headOverlays.lipstick.opacity.max}
              factor={settings.headOverlays.lipstick.opacity.factor}
              defaultValue={data.headOverlays.lipstick.opacity}
              clientValue={storedData.headOverlays.lipstick.opacity}
              onChange={value => handleHeadOverlayChange('lipstick', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.lipstick.style.min, settings.headOverlays.lipstick.style.max, 'lipstick')}
              selectedValue={data.headOverlays.lipstick.style.toString()}
              onSelect={id => handleHeadOverlayChange('lipstick', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.lipstick.color?.items}
              defaultValue={data.headOverlays.lipstick.color}
              clientValue={storedData.headOverlays.lipstick.color}
              onChange={value => handleHeadOverlayChange('lipstick', 'color', value)}
            />
          </Item>
          <Item title={locales.headOverlays.beard}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.beard.opacity.min}
              max={settings.headOverlays.beard.opacity.max}
              factor={settings.headOverlays.beard.opacity.factor}
              defaultValue={data.headOverlays.beard.opacity}
              clientValue={storedData.headOverlays.beard.opacity}
              onChange={value => handleHeadOverlayChange('beard', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.beard.style.min, settings.headOverlays.beard.style.max, 'beard')}
              selectedValue={data.headOverlays.beard.style.toString()}
              onSelect={id => handleHeadOverlayChange('beard', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.beard.color?.items}
              defaultValue={data.headOverlays.beard.color}
              clientValue={storedData.headOverlays.beard.color}
              onChange={value => handleHeadOverlayChange('beard', 'color', value)}
            />
          </Item>
          <Item title={locales.headOverlays.blemishes}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.blemishes.opacity.min}
              max={settings.headOverlays.blemishes.opacity.max}
              factor={settings.headOverlays.blemishes.opacity.factor}
              defaultValue={data.headOverlays.blemishes.opacity}
              clientValue={storedData.headOverlays.blemishes.opacity}
              onChange={value => handleHeadOverlayChange('blemishes', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.blemishes.style.min, settings.headOverlays.blemishes.style.max, 'blemishes')}
              selectedValue={data.headOverlays.blemishes.style.toString()}
              onSelect={id => handleHeadOverlayChange('blemishes', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.ageing}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.ageing.opacity.min}
              max={settings.headOverlays.ageing.opacity.max}
              factor={settings.headOverlays.ageing.opacity.factor}
              defaultValue={data.headOverlays.ageing.opacity}
              clientValue={storedData.headOverlays.ageing.opacity}
              onChange={value => handleHeadOverlayChange('ageing', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.ageing.style.min, settings.headOverlays.ageing.style.max, 'ageing')}
              selectedValue={data.headOverlays.ageing.style.toString()}
              onSelect={id => handleHeadOverlayChange('ageing', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.complexion}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.complexion.opacity.min}
              max={settings.headOverlays.complexion.opacity.max}
              factor={settings.headOverlays.complexion.opacity.factor}
              defaultValue={data.headOverlays.complexion.opacity}
              clientValue={storedData.headOverlays.complexion.opacity}
              onChange={value => handleHeadOverlayChange('complexion', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.complexion.style.min, settings.headOverlays.complexion.style.max, 'complexion')}
              selectedValue={data.headOverlays.complexion.style.toString()}
              onSelect={id => handleHeadOverlayChange('complexion', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.sunDamage}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.sunDamage.opacity.min}
              max={settings.headOverlays.sunDamage.opacity.max}
              factor={settings.headOverlays.sunDamage.opacity.factor}
              defaultValue={data.headOverlays.sunDamage.opacity}
              clientValue={storedData.headOverlays.sunDamage.opacity}
              onChange={value => handleHeadOverlayChange('sunDamage', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.sunDamage.style.min, settings.headOverlays.sunDamage.style.max, 'sundamage')}
              selectedValue={data.headOverlays.sunDamage.style.toString()}
              onSelect={id => handleHeadOverlayChange('sunDamage', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.moleAndFreckles}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.moleAndFreckles.opacity.min}
              max={settings.headOverlays.moleAndFreckles.opacity.max}
              factor={settings.headOverlays.moleAndFreckles.opacity.factor}
              defaultValue={data.headOverlays.moleAndFreckles.opacity}
              clientValue={storedData.headOverlays.moleAndFreckles.opacity}
              onChange={value => handleHeadOverlayChange('moleAndFreckles', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.moleAndFreckles.style.min, settings.headOverlays.moleAndFreckles.style.max, 'moles')}
              selectedValue={data.headOverlays.moleAndFreckles.style.toString()}
              onSelect={id => handleHeadOverlayChange('moleAndFreckles', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
          <Item title={locales.headOverlays.chestHair}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.chestHair.opacity.min}
              max={settings.headOverlays.chestHair.opacity.max}
              factor={settings.headOverlays.chestHair.opacity.factor}
              defaultValue={data.headOverlays.chestHair.opacity}
              clientValue={storedData.headOverlays.chestHair.opacity}
              onChange={value => handleHeadOverlayChange('chestHair', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.chestHair.style.min, settings.headOverlays.chestHair.style.max, 'chesthair')}
              selectedValue={data.headOverlays.chestHair.style.toString()}
              onSelect={id => handleHeadOverlayChange('chestHair', 'style', parseInt(id))}
              onAdd={() => { }}
            />
            <ColorInput
              title={locales.headOverlays.color}
              colors={settings.headOverlays.chestHair.color?.items}
              defaultValue={data.headOverlays.chestHair.color}
              clientValue={storedData.headOverlays.chestHair.color}
              onChange={value => handleHeadOverlayChange('chestHair', 'color', value)}
            />
          </Item>
          <Item title={locales.headOverlays.bodyBlemishes}>
            <RangeInput
              title={locales.headOverlays.opacity}
              min={settings.headOverlays.bodyBlemishes.opacity.min}
              max={settings.headOverlays.bodyBlemishes.opacity.max}
              factor={settings.headOverlays.bodyBlemishes.opacity.factor}
              defaultValue={data.headOverlays.bodyBlemishes.opacity}
              clientValue={storedData.headOverlays.bodyBlemishes.opacity}
              onChange={value => handleHeadOverlayChange('bodyBlemishes', 'opacity', value)}
            />
            <ImageSelector
              label={locales.headOverlays.style}
              items={getItems(settings.headOverlays.bodyBlemishes.style.min, settings.headOverlays.bodyBlemishes.style.max, 'bodyblemishes')}
              selectedValue={data.headOverlays.bodyBlemishes.style.toString()}
              onSelect={id => handleHeadOverlayChange('bodyBlemishes', 'style', parseInt(id))}
              onAdd={() => { }}
            />
          </Item>
        </>
      )}
    </Section>
  );
};

export default HeadOverlays;
