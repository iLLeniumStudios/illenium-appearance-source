import { useNuiState } from '../../hooks/nuiState';

import Section from './components/Section';
import Item from './components/Item';
import { FlexWrapper } from './styles';
import Input from './components/Input';

import { PropSettings, PedProp, PropConfig, AppearanceSettings } from './interfaces';
import ImageSelector from './components/ImageSelector';

interface PropsProps {
  settings: AppearanceSettings;
  data: PedProp[];
  storedData: PedProp[];
  handlePropDrawableChange: (prop_id: number, drawable: number) => void;
  handlePropTextureChange: (prop_id: number, texture: number) => void;
  propConfig: PropConfig;
  isPedMale: boolean | undefined;
  forcedOpen?: boolean;
}

interface DataById<T> {
  [key: number]: T;
}

const Props = ({ settings, data, storedData, handlePropDrawableChange, handlePropTextureChange, propConfig, isPedMale, forcedOpen }: PropsProps) => {
  const { locales } = useNuiState();

  const imageLocal = settings.imageLocal;
  const imageUrl = settings.imageUrl;
  const imageSources = settings.imageSources;
  const isLocal = imageLocal === 'pasta';
  const baseUrl = isLocal ? 'peds/' : imageUrl;
  const accessoriesFolder = imageSources?.accessories || 'clothing/';
  const genderPrefix = isPedMale ? 'male' : 'female';

  const getItems = (min: number, max: number, propId: number) => {
    const items = [];
    for (let i = Math.max(0, min); i <= max; i++) {
      const image = isLocal
        ? `${baseUrl}props/${propId}/${i}.png`
        : `${baseUrl}${accessoriesFolder}${genderPrefix}_prop_${propId}_${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const getTextureItems = (min: number, max: number, propId: number, drawableId: number) => {
    const items = [];
    for (let i = Math.max(0, min); i <= max; i++) {
      const image = isLocal
        ? `${baseUrl}props/${propId}/${drawableId}/${i}.png`
        : `${baseUrl}${accessoriesFolder}${genderPrefix}_prop_${propId}_${drawableId}_${i}.webp`;
      items.push({
        id: i.toString(),
        image: image,
      });
    }
    return items;
  };

  const settingsById = settings.props.reduce((object, { prop_id, drawable, texture, blacklist }) => {
    return { ...object, [prop_id]: { drawable, texture, blacklist } };
  }, {} as DataById<Omit<PropSettings, 'prop_id'>>);

  const propsById: any = data.reduce((object, { prop_id, drawable, texture }) => {
    return { ...object, [prop_id]: { drawable, texture } };
  }, {} as DataById<Omit<PedProp, 'prop_id'>>);

  const storedPropsById: any = storedData.reduce((object, { prop_id, drawable, texture }) => {
    return { ...object, [prop_id]: { drawable, texture } };
  }, {} as DataById<Omit<PedProp, 'prop_id'>>);

  if (!locales) {
    return null;
  }

  return (
    <Section title={locales.props.title} forcedOpen={forcedOpen}>
      {propConfig.hats && <Item title={locales.props.hats}>
        <FlexWrapper>
          <ImageSelector
            label={locales.props.drawable}
            items={getItems(settingsById[0].drawable.min, settingsById[0].drawable.max, 0)}
            selectedValue={propsById[0].drawable.toString()}
            onSelect={id => handlePropDrawableChange(0, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.props.texture}
            items={getTextureItems(settingsById[0].texture.min, settingsById[0].texture.max, 0, propsById[0].drawable)}
            selectedValue={propsById[0].texture.toString()}
            onSelect={id => handlePropTextureChange(0, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {propConfig.glasses && <Item title={locales.props.glasses}>
        <FlexWrapper>
          <ImageSelector
            label={locales.props.drawable}
            items={getItems(settingsById[1].drawable.min, settingsById[1].drawable.max, 1)}
            selectedValue={propsById[1].drawable.toString()}
            onSelect={id => handlePropDrawableChange(1, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.props.texture}
            items={getTextureItems(settingsById[1].texture.min, settingsById[1].texture.max, 1, propsById[1].drawable)}
            selectedValue={propsById[1].texture.toString()}
            onSelect={id => handlePropTextureChange(1, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {propConfig.ear && <Item title={locales.props.ear}>
        <FlexWrapper>
          <ImageSelector
            label={locales.props.drawable}
            items={getItems(settingsById[2].drawable.min, settingsById[2].drawable.max, 2)}
            selectedValue={propsById[2].drawable.toString()}
            onSelect={id => handlePropDrawableChange(2, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.props.texture}
            items={getTextureItems(settingsById[2].texture.min, settingsById[2].texture.max, 2, propsById[2].drawable)}
            selectedValue={propsById[2].texture.toString()}
            onSelect={id => handlePropTextureChange(2, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {propConfig.watches && <Item title={locales.props.watches}>
        <FlexWrapper>
          <ImageSelector
            label={locales.props.drawable}
            items={getItems(settingsById[6].drawable.min, settingsById[6].drawable.max, 6)}
            selectedValue={propsById[6].drawable.toString()}
            onSelect={id => handlePropDrawableChange(6, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.props.texture}
            items={getTextureItems(settingsById[6].texture.min, settingsById[6].texture.max, 6, propsById[6].drawable)}
            selectedValue={propsById[6].texture.toString()}
            onSelect={id => handlePropTextureChange(6, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
      {propConfig.bracelets && <Item title={locales.props.bracelets}>
        <FlexWrapper>
          <ImageSelector
            label={locales.props.drawable}
            items={getItems(settingsById[7].drawable.min, settingsById[7].drawable.max, 7)}
            selectedValue={propsById[7].drawable.toString()}
            onSelect={id => handlePropDrawableChange(7, parseInt(id))}
            onAdd={() => { }}
          />
          <ImageSelector
            label={locales.props.texture}
            items={getTextureItems(settingsById[7].texture.min, settingsById[7].texture.max, 7, propsById[7].drawable)}
            selectedValue={propsById[7].texture.toString()}
            onSelect={id => handlePropTextureChange(7, parseInt(id))}
            onAdd={() => { }}
          />
        </FlexWrapper>
      </Item>}
    </Section>
  );
};

export default Props;
