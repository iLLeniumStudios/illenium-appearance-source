export const Delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

export const isPedFreemodeModel = (ped: number): boolean => {
  const entityModel = GetEntityModel(ped);

  const freemodeMale = GetHashKey('mp_m_freemode_01');
  const freemodeFemale = GetHashKey('mp_f_freemode_01');

  return entityModel === freemodeMale || entityModel === freemodeFemale;
};

export const isPedMale = (ped: number): boolean => {
  const entityModel = GetEntityModel(ped);
  const freemodeMale = GetHashKey('mp_m_freemode_01');

  return entityModel === freemodeMale;
};

export function arrayToVector3(coords: number[]): Vector3 {
  return {
    x: coords[0],
    y: coords[1],
    z: coords[2],
  };
}

export const getPedStats = (): Array<number> => {
  const playerPed = PlayerPedId();
  const health = GetEntityHealth(playerPed);
  const armor = GetPedArmour(playerPed);
  const maxHealth = GetEntityMaxHealth(playerPed);

  return [maxHealth, health, armor];
};

export const setPedStats = async (
  maxHealth: number,
  health: number,
  armor: number,
): Promise<void> => {
  const playerPed = PlayerPedId();
  SetPedMaxHealth(playerPed, maxHealth);
  await Delay(1000);
  SetEntityHealth(playerPed, health);
  SetPedArmour(playerPed, armor);
};
