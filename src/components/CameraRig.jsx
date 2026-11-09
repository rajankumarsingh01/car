import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { CAMERA_KEYS } from "../config/stages";

const lerp = THREE.MathUtils.lerp;
const smooth = (t) => t * t * (3 - 2 * t);
const lookTarget = new THREE.Vector3();

const norm = (k) => ({
  angle: k.angle,
  radius: k.radius,
  height: k.height,
  targetY: k.targetY,
  tx: k.tx ?? 0,
  tz: k.tz ?? 0,
});

function sampleCamera(offset) {
  const keys = CAMERA_KEYS;
  if (offset <= keys[0].at) return norm(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = norm(keys[i]);
    const b = norm(keys[i + 1]);
    if (offset <= keys[i + 1].at) {
      const t = smooth((offset - keys[i].at) / (keys[i + 1].at - keys[i].at));
      return {
        angle: lerp(a.angle, b.angle, t),
        radius: lerp(a.radius, b.radius, t),
        height: lerp(a.height, b.height, t),
        targetY: lerp(a.targetY, b.targetY, t),
        tx: lerp(a.tx, b.tx, t),
        tz: lerp(a.tz, b.tz, t),
      };
    }
  }
  return norm(keys[keys.length - 1]);
}

export default function CameraRig() {
  const scroll = useScroll();

  useFrame((state) => {
    const c = sampleCamera(scroll.offset);

    // portrait (9:16) screen par camera door, taaki car frame mein poori aaye
    const aspect = state.size.width / state.size.height;
    const k = aspect < 1 ? 1 + (1 - aspect) * 1.1 : 1;
    const r = c.radius * k;

    state.camera.position.set(
      c.tx + Math.cos(c.angle) * r,
      c.height,
      c.tz + Math.sin(c.angle) * r
    );
    lookTarget.set(c.tx, c.targetY, c.tz);
    state.camera.lookAt(lookTarget);
  });

  return null;
}