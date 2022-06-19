import { Delay, isPedFreemodeModel } from './utils';

import {
  FACE_FEATURES,
  HEAD_OVERLAYS,
  HAIR_DECORATIONS,
  PED_COMPONENTS_IDS,
  PED_PROPS_IDS,
  EYE_COLORS,
} from './constants';

import Customization, { getPedTattoos, setPedTattoos } from './modules/customization';

const exp = (global as any).exports;

const GET_PED_HEAD_BLEND_DATA = '0x2746bd9d88c5c5d0';

let playerJob = '';
let playerGang = '';

on('updateJob', (job: string) => {
  playerJob = job;
});

on('updateGang', (gang: string) => {
  playerGang = gang;
});

export function getPlayerJob(): string {
  return playerJob;
}

export function getPlayerGang(): string {
  return playerGang;
}

export const totalTattoos: TattooList = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'tattoos.json'),
);

export const pedModels: string[] = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'peds.json'),
);

export const clothingBlacklistSettings: ClothingBlacklistSettings = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'blacklist.json'),
);

export const themeConfiguration: any = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'theme.json'),
);

export const locales = JSON.parse(
  LoadResourceFile(
    GetCurrentResourceName(),
    `locales/${GetConvar('fivem-appearance:locale', 'en')}.json`,
  ),
);

const pedModelsByHash = pedModels.reduce((object, model) => {
  return { ...object, [GetHashKey(model)]: model };
}, {});

function getPedModel(ped: number): string {
  return pedModelsByHash[GetEntityModel(ped)];
}

function getPedComponents(ped: number): PedComponent[] {
  const components = [];

  PED_COMPONENTS_IDS.forEach(componentId => {
    components.push({
      component_id: componentId,
      drawable: GetPedDrawableVariation(ped, componentId),
      texture: GetPedTextureVariation(ped, componentId),
    });
  });

  return components;
}

function getPedProps(ped: number): PedProp[] {
  const props = [];

  PED_PROPS_IDS.forEach(propId => {
    props.push({
      prop_id: propId,
      drawable: GetPedPropIndex(ped, propId),
      texture: GetPedPropTextureIndex(ped, propId),
    });
  });

  return props;
}

function getPedHeadBlend(ped: number): PedHeadBlend {
  // int, int, int, int, int, int, float, float, float, bool
  const buffer = new ArrayBuffer(80);

  global.Citizen.invokeNative(GET_PED_HEAD_BLEND_DATA, ped, new Uint32Array(buffer));

  /*   
    0: shapeFirst,
    2: shapeSecond,
    4: shapeThird,
    6: skinFirst,
    8: skinSecond,
    10: skinThird,
    18: isParent,
  */
  const {
    0: shapeFirst,
    2: shapeSecond,
    4: shapeThird,
    6: skinFirst,
    8: skinSecond,
    10: skinThird,
  } = new Uint32Array(buffer);

  // 0: shapeMix, 2: skinMix, 4: thirdMix
  const { 0: shapeMix, 2: skinMix, 4: thirdMix } = new Float32Array(buffer, 48);

  const normalizedShapeMix = parseFloat(shapeMix.toFixed(1));
  const normalizedSkinMix = parseFloat(skinMix.toFixed(1));
  let normalizedThirdMix = parseFloat(thirdMix.toFixed(1));
  if (Number.isNaN(normalizedThirdMix)) {
    normalizedThirdMix = 0;
  }

  return {
    shapeFirst,
    shapeSecond,
    shapeThird,
    skinFirst,
    skinSecond,
    skinThird,
    shapeMix: normalizedShapeMix,
    skinMix: normalizedSkinMix,
    thirdMix: normalizedThirdMix,
  };
}

function getPedFaceFeatures(ped: number): PedFaceFeatures {
  const faceFeatures = FACE_FEATURES.reduce((object, feature, index) => {
    const normalizedValue = parseFloat(GetPedFaceFeature(ped, index).toFixed(1));

    return { ...object, [feature]: normalizedValue };
  }, {} as PedFaceFeatures);

  return faceFeatures;
}

function getPedHeadOverlays(ped: number): PedHeadOverlays {
  const headOverlays = HEAD_OVERLAYS.reduce((object, overlay, index) => {
    // success, value, colorType, firstColor, secondColor, opacity
    const [, value, , firstColor, secondColor, opacity] = GetPedHeadOverlayData(ped, index);

    const hasOverlay = value !== 255;

    const safeValue = hasOverlay ? value : 0;
    const normalizedOpacity = hasOverlay ? parseFloat(opacity.toFixed(1)) : 0;
    let overlayData;

    if (overlay === 'makeUp') {
      overlayData = {
        style: safeValue,
        opacity: normalizedOpacity,
        color: firstColor,
        secondColor: secondColor,
      };
    } else {
      overlayData = { style: safeValue, opacity: normalizedOpacity, color: firstColor };
    }

    return {
      ...object,
      [overlay]: overlayData,
    };
  }, {} as PedHeadOverlays);

  return headOverlays;
}

function getPedHair(ped: number): PedHair {
  return {
    style: GetPedDrawableVariation(ped, 2),
    color: GetPedHairColor(ped),
    highlight: GetPedHairHighlightColor(ped),
    texture: GetPedTextureVariation(ped, 2),
  };
}

/* function getPedHairDecorationType(ped: number): 'male' | 'female' {
  const pedModel = GetEntityModel(ped);

  let hairDecorationType: 'male' | 'female';

  if (pedModel === GetHashKey('mp_m_freemode_01')) {
    hairDecorationType = 'male';
  } else if (pedModel === GetHashKey('mp_f_freemode_01')) {
    hairDecorationType = 'female';
  }

  return hairDecorationType;
} */

/* function getPedHairDecoration(ped: number, hairStyle: number): HairDecoration {
  const hairDecorationType = getPedHairDecorationType(ped);

  if (!hairDecorationType) return;

  const hairDecoration = HAIR_DECORATIONS[hairDecorationType].find(
    decoration => decoration.id === hairStyle,
  );

  return hairDecoration;
} */

export function getPedAppearance(ped: number): PedAppearance {
  const eyeColor = GetPedEyeColor(ped);

  return {
    model: getPedModel(ped) || 'mp_m_freemode_01',
    headBlend: getPedHeadBlend(ped),
    faceFeatures: getPedFaceFeatures(ped),
    headOverlays: getPedHeadOverlays(ped),
    components: getPedComponents(ped),
    props: getPedProps(ped),
    hair: getPedHair(ped),
    eyeColor: eyeColor < EYE_COLORS.length ? eyeColor : 0,
    tattoos: getPedTattoos(),
  };
}

export async function setPlayerModel(model: string): Promise<void> {
  if (!model) return;

  if (!IsModelInCdimage(model)) return;

  RequestModel(model);

  while (!HasModelLoaded(model)) {
    await Delay(0);
  }

  //const [maxHealth, currentHealth, currentArmour] = getPedStats();

  SetPlayerModel(PlayerId(), model);
  SetModelAsNoLongerNeeded(model);

  const playerPed = PlayerPedId();

  if (isPedFreemodeModel(playerPed)) {
    SetPedDefaultComponentVariation(playerPed);
    SetPedHeadBlendData(playerPed, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
  }

  //await setPedStats(maxHealth, currentHealth, currentArmour);
}

export function setPedHeadBlend(ped: number, headBlend: PedHeadBlend): void {
  if (!headBlend) return;

  const {
    shapeFirst,
    shapeSecond,
    shapeThird,
    shapeMix,
    skinFirst,
    skinSecond,
    skinThird,
    skinMix,
    thirdMix,
  } = headBlend;

  if (isPedFreemodeModel(ped)) {
    SetPedHeadBlendData(
      ped,
      shapeFirst,
      shapeSecond,
      shapeThird,
      skinFirst,
      skinSecond,
      skinThird,
      shapeMix,
      skinMix,
      thirdMix,
      false,
    );
  }
}

export function setPedFaceFeatures(ped: number, faceFeatures: PedFaceFeatures): void {
  if (!faceFeatures) return;

  FACE_FEATURES.forEach((key, index) => {
    const faceFeature = faceFeatures[key];

    SetPedFaceFeature(ped, index, faceFeature);
  });
}

export function setPedHeadOverlays(ped: number, headOverlays: PedHeadOverlays): void {
  if (!headOverlays) return;

  HEAD_OVERLAYS.forEach((key, index) => {
    const headOverlay: PedHeadOverlayValue = headOverlays[key];

    SetPedHeadOverlay(ped, index, headOverlay.style, headOverlay.opacity);

    if (headOverlay.color || headOverlay.color === 0) {
      let colorType = 1;
      var secondColor = headOverlay.color;

      const isMakeupColor = {
        blush: true,
        lipstick: true,
        makeUp: true,
      };

      if (isMakeupColor[key]) {
        colorType = 2;
      }

      if (key === 'makeUp') {
        secondColor = headOverlay.secondColor;
      }

      SetPedHeadOverlayColor(ped, index, colorType, headOverlay.color, secondColor);
    }
  });
}

export function setPedHair(ped: number, hair: PedHair): void {
  if (!hair) return;

  const { style, color, highlight, texture } = hair;

  SetPedComponentVariation(ped, 2, style, texture, 2);

  SetPedHairColor(ped, color, highlight);

  /* const hairDecoration = getPedHairDecoration(ped, style);

  ClearPedDecorations(ped);

  if (hairDecoration) {
    const { collection, overlay } = hairDecoration;

    AddPedDecorationFromHashes(ped, GetHashKey(collection), GetHashKey(overlay));
  } */
}

export function setPedEyeColor(ped: number, eyeColor: number): void {
  if (!eyeColor) return;

  SetPedEyeColor(ped, eyeColor);
}

export function setPedComponent(ped: number, component: PedComponent): void {
  if (!component) return;

  const { component_id, drawable, texture } = component;

  const excludedFromFreemodeModels = {
    0: true,
    2: true,
  };

  if (excludedFromFreemodeModels[component_id] && isPedFreemodeModel(ped)) {
    return;
  }

  SetPedComponentVariation(ped, component_id, drawable, texture, 0);
}

export function setPedComponents(ped: number, components: PedComponent[]): void {
  if (!components) return;

  components.forEach(component => setPedComponent(ped, component));
}

export function setPedProp(ped: number, prop: PedProp): void {
  if (!prop) return;

  const { prop_id, drawable, texture } = prop;

  if (drawable === -1) {
    ClearPedProp(ped, prop_id);
  } else {
    SetPedPropIndex(ped, prop_id, drawable, texture, false);
  }
}

export function setPedProps(ped: number, props: PedProp[]): void {
  if (!props) return;

  props.forEach(prop => setPedProp(ped, prop));
}

export async function setPlayerAppearance(appearance: PedAppearance): Promise<void> {
  if (!appearance) return;

  const {
    model,
    components,
    props,
    headBlend,
    faceFeatures,
    headOverlays,
    hair,
    eyeColor,
    tattoos,
  } = appearance;

  await setPlayerModel(model);

  const playerPed = PlayerPedId();

  setPedComponents(playerPed, components);

  setPedProps(playerPed, props);

  if (headBlend) {
    setPedHeadBlend(playerPed, headBlend);
  }

  if (faceFeatures) {
    setPedFaceFeatures(playerPed, faceFeatures);
  }

  if (headOverlays) {
    setPedHeadOverlays(playerPed, headOverlays);
  }

  if (hair) {
    setPedHair(playerPed, hair);
  }

  if (eyeColor) {
    setPedEyeColor(playerPed, eyeColor);
  }

  if (tattoos) {
    setPedTattoos(playerPed, tattoos);
  }
}

function setPedAppearance(ped: number, appearance: Omit<PedAppearance, 'model'>): void {
  if (!appearance) return;

  const { components, props, headBlend, faceFeatures, headOverlays, hair, eyeColor, tattoos } =
    appearance;

  setPedComponents(ped, components);

  setPedProps(ped, props);

  if (headBlend) {
    setPedHeadBlend(ped, headBlend);
  }

  if (faceFeatures) {
    setPedFaceFeatures(ped, faceFeatures);
  }

  if (headOverlays) {
    setPedHeadOverlays(ped, headOverlays);
  }

  if (hair) {
    setPedHair(ped, hair);
  }

  if (eyeColor) {
    setPedEyeColor(ped, eyeColor);
  }

  if (tattoos) {
    setPedTattoos(ped, tattoos);
  }
}

function init(): void {
  Customization.loadModule();

  exp('getPedModel', getPedModel);
  exp('getPedComponents', getPedComponents);
  exp('getPedProps', getPedProps);
  exp('getPedHeadBlend', getPedHeadBlend);
  exp('getPedFaceFeatures', getPedFaceFeatures);
  exp('getPedHeadOverlays', getPedHeadOverlays);
  exp('getPedHair', getPedHair);
  exp('getPedTattoos', getPedTattoos);
  exp('getPedAppearance', getPedAppearance);

  exp('setPlayerModel', setPlayerModel);
  exp('setPedHeadBlend', setPedHeadBlend);
  exp('setPedFaceFeatures', setPedFaceFeatures);
  exp('setPedHeadOverlays', setPedHeadOverlays);
  exp('setPedHair', setPedHair);
  exp('setPedEyeColor', setPedEyeColor);
  exp('setPedComponent', setPedComponent);
  exp('setPedComponents', setPedComponents);
  exp('setPedProp', setPedProp);
  exp('setPedProps', setPedProps);
  exp('setPedTattoos', setPedTattoos);
  exp('setPlayerAppearance', setPlayerAppearance);
  exp('setPedAppearance', setPedAppearance);
}

init();
