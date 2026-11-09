// Configurator ki current choice. null = car ka original (stock) rang.
// Car.jsx har frame ise padhta hai, isliye React state ki zaroorat nahi.
export const config = { paint: null, rim: null };

export function setConfig(patch) {
  Object.assign(config, patch);
}