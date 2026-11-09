import * as THREE from "three";

export const TARGET_LENGTH = 4;
const cache = new WeakMap();

// Car.jsx jaisa hi scale/offset nikalta hai, aur 4 wheels ki jagah (world units mein).
// Ye pehli baar model attach hone se pehle chalta hai, phir cache se aata hai.
export function getLayout(scene) {
  if (cache.has(scene)) return cache.get(scene);

  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = TARGET_LENGTH / Math.max(size.x, size.y, size.z);
  const off = new THREE.Vector3(-center.x * s, -box.min.y * s, -center.z * s);

  const rims = [];
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    if (m.name !== "930_rim") return;
    if ((o.geometry.index?.count ?? 0) / 3 < 1000) return;
    const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
    rims.push(c.multiplyScalar(s).add(off));
  });

  // agar rims na milen to andaaze wali values
  let layout = { wheelY: 0.3, trackX: 0.8, rearZ: -1.0, frontZ: 1.1, found: false };

  if (rims.length >= 4) {
    rims.sort((a, b) => a.z - b.z); // peeche (-z) se aage (+z)
    const rear = rims.slice(0, 2);
    const front = rims.slice(-2);
    const avg = (arr, f) => arr.reduce((t, v) => t + f(v), 0) / arr.length;
    layout = {
      wheelY: avg(rims, (v) => v.y),
      trackX: avg(rims, (v) => Math.abs(v.x)),
      rearZ: avg(rear, (v) => v.z),
      frontZ: avg(front, (v) => v.z),
      found: true,
    };
  }

  console.log("Car layout:", layout);
  cache.set(scene, layout);
  return layout;
}