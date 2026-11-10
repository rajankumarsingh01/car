/* eslint-disable react-refresh/only-export-components, react-hooks/use-memo, react-hooks/exhaustive-deps */


import { useMemo } from "react";
import * as THREE from "three";

const mat = (o) => new THREE.MeshStandardMaterial(o);

export const M = {
  steel: mat({ color: "#8a94a3", metalness: 1, roughness: 0.35 }),
  alu: mat({ color: "#c9d1db", metalness: 1, roughness: 0.28 }),
  dark: mat({ color: "#1b2028", metalness: 0.8, roughness: 0.5 }),
  case: mat({ color: "#4a5463", metalness: 0.9, roughness: 0.45 }),
  copper: mat({ color: "#e8925a", metalness: 0.9, roughness: 0.3 }),
  hot: mat({
    color: "#7a3a1c",
    metalness: 0.9,
    roughness: 0.4,
    emissive: "#ff5a1f",
    emissiveIntensity: 0.05,
  }),
  red: mat({ color: "#c2392b", metalness: 0.5, roughness: 0.4 }),
  blue: mat({ color: "#2d6bd6", metalness: 0.2, roughness: 0.6 }),
  white: mat({ color: "#e8e8e8", metalness: 0.1, roughness: 0.5 }),
  shroud: mat({
    color: "#262c36",
    metalness: 0.8,
    roughness: 0.5,
    side: THREE.DoubleSide,
  }),
};

// Ek explode hone wala hissa: home = shuru ki jagah, off = poori tarah khulne par kitna hilega
export function Part({ home = [0, 0, 0], off = [0, 0, 0], children }) {
  return (
    <group position={home} userData={{ home, off }}>
      {children}
    </group>
  );
}

// root ke har Part ko amount (0 se 1+) ke hisaab se hilata hai, zameen ke neeche nahi jaata
export function applyExplode(root, amount, baseY = 0, scale = 1) {
  if (!root) return;
  const minY = (0.03 - baseY) / scale;
  root.children.forEach((ch) => {
    const u = ch.userData;
    if (!u.home) return;
    ch.position.set(
      u.home[0] + u.off[0] * amount,
      Math.max(u.home[1] + u.off[1] * amount, minY),
      u.home[2] + u.off[2] * amount
    );
  });
}

// do points ke beech ek patli rod
export function Bar({ from, to, r = 0.02, material = M.steel }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const d = b.clone().sub(a);
    const len = d.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      d.normalize()
    );
    return { pos: a.clone().add(b).multiplyScalar(0.5), quat, len };
  }, [from.join(), to.join()]);

  return (
    <mesh position={pos} quaternion={quat} material={material}>
      <cylinderGeometry args={[r, r, len, 12]} />
    </mesh>
  );
}

// points se guzarti hui mudi hui pipe (exhaust)
export function Pipe({ points, r = 0.03, material = M.steel }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 40, r, 10, false);
  }, [points.join(), r]);
  return <mesh geometry={geo} material={material} />;
}

// coil spring (khade helix), center origin pe
export function Spring({ R = 0.05, H = 0.3, turns = 6, r = 0.009, material = M.red }) {
  const geo = useMemo(() => {
    const pts = [];
    const N = turns * 16;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * R, (t - 0.5) * H, Math.sin(a) * R));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, r, 6, false);
  }, [R, H, turns, r]);
  return <mesh geometry={geo} material={material} />;
}