import { useNuiState } from '../../hooks/nuiState';

import Section from './components/Section';
import Item from './components/Item';
import { FlexWrapper } from './styles';
import Input from './components/Input';

import { ComponentConfig, ComponentSettings, PedComponent, AppearanceSettings } from './interfaces';
import ImageSelector from './components/ImageSelector';

interface ComponentsProps {
  settings: AppearanceSettings;
  data: PedComponent[];
  storedData: PedComponent[];
  handleComponentDrawableChange: (component_id: number, drawable: number) => void;
  handleComponentTextureChange: (component_id: number, texture: number) => void;
  componentConfig: ComponentConfig;
  hasTracker: boolean;
  isPedFreemodeModel: boolean | undefined;
  isPedMale: boolean | undefined;
  forcedOpen?: boolean;
}

interface DataById<T> {
  [key: number]: T;
}

const Components = ({
  settings,
  data,
  storedData,
  handleComponentDrawableChange,
  handleComponentTextureChange,
  componentConfig,
  hasTracker,
  isPedFreemodeModel,
  isPedMale,
  forcedOpen
}: ComponentsProps) => {
  const { locales } = useNuiState();

  const imageLocal = settings.imageLocal;
  const imageUrl = settings.imageUrl;
  const imageSources = settings.imageSources;
  const isLocal = imageLocal === 'pasta';
  const baseUrl = isLocal ? 'peds/' : imageUrl;
  const clothesFolder = imageSources?.clothes || 'clothing/';
  const genderPrefix = isPedMale ? 'male' : 'female';

  const getItems = (min: number, max: number, componentId: number) => {
    const items = [];
    for (let i = min; i <= max; i++) {
      const image = isLocal
        ? `${baseUrl}components/${componentId}/${i}.png`
        : `${baseUrl}${clothesFolder}${genderPrefix}_${componentId}_${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const getTextureItems = (min: number, max: number, componentId: number, drawableId: number) => {
    const items = [];
    for (let i = min; i <= max; i++) {
      const image = isLocal
        ? `${baseUrl}components/${componentId}/${drawableId}/${i}.png`
        : `${baseUrl}${clothesFolder}${genderPrefix}_${componentId}_${drawableId}_${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const settingsById = settings.components.reduce((object, { component_id, drawable, texture, blacklist }) => {
    return { ...object, [component_id]: { drawable, texture, blacklist } };
  }, {} as DataById<Omit<ComponentSettings, 'component_id'>>);

  const componentsById: any = data.reduce((object, { component_id, drawable, texture }) => {
    return { ...object, [component_id]: { drawable, texture } };
  }, {} as DataById<Omit<PedComponent, 'component_id'>>);

  const storedComponentsById: any = storedData.reduce((object, { component_id, drawable, texture }) => {
    return { ...object, [component_id]: { drawable, texture } };
  }, {} as DataById<Omit<PedComponent, 'component_id'>>);

  if (!locales) {
    return null;
  }

  return (
    <Section title={locales.components.title} forcedOpen={forcedOpen}>
      {!isPedFreemodeModel && <Item title={locales.components.head}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[0].drawable.min, settingsById[0].drawable.max, 0)}
            selectedValue={componentsById[0].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(0, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[0].texture.min, settingsById[0].texture.max, 0, componentsById[0].drawable)}
            selectedValue={componentsById[0].texture.toString()}
            onSelect={id => handleComponentTextureChange(0, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.masks && <Item title={locales.components.mask}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[1].drawable.min, settingsById[1].drawable.max, 1)}
            selectedValue={componentsById[1].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(1, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[1].texture.min, settingsById[1].texture.max, 1, componentsById[1].drawable)}
            selectedValue={componentsById[1].texture.toString()}
            onSelect={id => handleComponentTextureChange(1, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.scarfAndChains && !hasTracker && <Item title={locales.components.scarfAndChains}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[7].drawable.min, settingsById[7].drawable.max, 7)}
            selectedValue={componentsById[7].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(7, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[7].texture.min, settingsById[7].texture.max, 7, componentsById[7].drawable)}
            selectedValue={componentsById[7].texture.toString()}
            onSelect={id => handleComponentTextureChange(7, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.jackets && <Item title={locales.components.jackets}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[11].drawable.min, settingsById[11].drawable.max, 11)}
            selectedValue={componentsById[11].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(11, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[11].texture.min, settingsById[11].texture.max, 11, componentsById[11].drawable)}
            selectedValue={componentsById[11].texture.toString()}
            onSelect={id => handleComponentTextureChange(11, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.shirts && <Item title={locales.components.shirt}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[8].drawable.min, settingsById[8].drawable.max, 8)}
            selectedValue={componentsById[8].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(8, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[8].texture.min, settingsById[8].texture.max, 8, componentsById[8].drawable)}
            selectedValue={componentsById[8].texture.toString()}
            onSelect={id => handleComponentTextureChange(8, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.bodyArmor && <Item title={locales.components.bodyArmor}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[9].drawable.min, settingsById[9].drawable.max, 9)}
            selectedValue={componentsById[9].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(9, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[9].texture.min, settingsById[9].texture.max, 9, componentsById[9].drawable)}
            selectedValue={componentsById[9].texture.toString()}
            onSelect={id => handleComponentTextureChange(9, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.bags && <Item title={locales.components.bags}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[5].drawable.min, settingsById[5].drawable.max, 5)}
            selectedValue={componentsById[5].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(5, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[5].texture.min, settingsById[5].texture.max, 5, componentsById[5].drawable)}
            selectedValue={componentsById[5].texture.toString()}
            onSelect={id => handleComponentTextureChange(5, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.upperBody && <Item title={locales.components.upperBody}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[3].drawable.min, settingsById[3].drawable.max, 3)}
            selectedValue={componentsById[3].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(3, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[3].texture.min, settingsById[3].texture.max, 3, componentsById[3].drawable)}
            selectedValue={componentsById[3].texture.toString()}
            onSelect={id => handleComponentTextureChange(3, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.lowerBody && <Item title={locales.components.lowerBody}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[4].drawable.min, settingsById[4].drawable.max, 4)}
            selectedValue={componentsById[4].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(4, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[4].texture.min, settingsById[4].texture.max, 4, componentsById[4].drawable)}
            selectedValue={componentsById[4].texture.toString()}
            onSelect={id => handleComponentTextureChange(4, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.shoes && <Item title={locales.components.shoes}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[6].drawable.min, settingsById[6].drawable.max, 6)}
            selectedValue={componentsById[6].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(6, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[6].texture.min, settingsById[6].texture.max, 6, componentsById[6].drawable)}
            selectedValue={componentsById[6].texture.toString()}
            onSelect={id => handleComponentTextureChange(6, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {componentConfig.decals && <Item title={locales.components.decals}>
        <FlexWrapper>
          <ImageSelector
            label={locales.components.drawable}
            items={getItems(settingsById[10].drawable.min, settingsById[10].drawable.max, 10)}
            selectedValue={componentsById[10].drawable.toString()}
            onSelect={id => handleComponentDrawableChange(10, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.components.texture}
            items={getTextureItems(settingsById[10].texture.min, settingsById[10].texture.max, 10, componentsById[10].drawable)}
            selectedValue={componentsById[10].texture.toString()}
            onSelect={id => handleComponentTextureChange(10, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
    </Section>
  );
};

export default Components;
