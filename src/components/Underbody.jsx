import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";
import { getLayout } from "../utils/carLayout";
import { getTimeline } from "../utils/timeline";
import { M, Part, Bar, Spring, applyExplode } from "./parts";

const MODEL_URL = "/models/car.glb";
const SIDES = [-1, 1];
const ROT = Math.PI / 2;

export default function Underbody() {
  const { scene } = useGLTF(MODEL_URL);
  const L = getLayout(scene);
  const scroll = useScroll();
  const root = useRef();

  const { wheelY: wy, trackX: tx, rearZ, frontZ } = L;
  const discR = wy * 0.72;

  useFrame(() => {
    const t = getTimeline(scroll.offset);
    if (root.current) root.current.visible = t.fade > 0.02;
    applyExplode(root.current, t.out, 0);
  });

  return (
    <group ref={root}>
      {/* brakes: 4 wheels ke andar disc + red caliper */}
      {SIDES.flatMap((s) =>
        [rearZ, frontZ].map((z) => (
          <Part
            key={`br${s}_${z}`}
            home={[s * (tx - 0.13), wy, z]}
            off={[s * 0.8, 0, z > 0 ? 0.2 : -0.2]}
          >
            <mesh rotation-z={ROT} material={M.steel}>
              <cylinderGeometry args={[discR, discR, 0.025, 36]} />
            </mesh>
            <mesh rotation-z={ROT} material={M.dark}>
              <cylinderGeometry args={[0.07, 0.07, 0.07, 16]} />
            </mesh>
            <mesh position={[0, discR - 0.02, 0]} material={M.red}>
              <boxGeometry args={[0.06, 0.1, 0.15]} />
            </mesh>
          </Part>
        ))
      )}

      {/* rear: trailing arms + coil springs */}
      {SIDES.map((s) => (
        <Part
          key={`ra${s}`}
          home={[s * (tx - 0.3), wy + 0.02, rearZ + 0.45]}
          off={[s * 0.5, 0, 0.15]}
        >
          <mesh material={M.dark}>
            <boxGeometry args={[0.07, 0.07, 0.9]} />
          </mesh>
        </Part>
      ))}
      {SIDES.map((s) => (
        <Part
          key={`rs${s}`}
          home={[s * (tx - 0.4), wy + 0.12, rearZ - 0.05]}
          off={[s * 0.35, 0.55, 0]}
        >
          <Spring R={0.05} H={0.3} material={M.red} />
          <mesh material={M.alu}>
            <cylinderGeometry args={[0.018, 0.018, 0.34, 10]} />
          </mesh>
        </Part>
      ))}

      {/* front: control arms + struts with springs */}
      {SIDES.map((s) => (
        <Part key={`fa${s}`} off={[s * 0.5, 0, 0]}>
          <Bar
            from={[s * (tx - 0.15), wy - 0.05, frontZ]}
            to={[s * 0.22, wy - 0.03, frontZ + 0.28]}
            r={0.018}
            material={M.dark}
          />
          <Bar
            from={[s * (tx - 0.15), wy - 0.05, frontZ]}
            to={[s * 0.22, wy - 0.03, frontZ - 0.25]}
            r={0.018}
            material={M.dark}
          />
        </Part>
      ))}
      {SIDES.map((s) => (
        <Part
          key={`fs${s}`}
          home={[s * (tx - 0.3), wy + 0.12, frontZ]}
          off={[s * 0.3, 0.65, 0]}
        >
          <mesh material={M.alu}>
            <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
          </mesh>
          <Spring R={0.05} H={0.22} turns={5} material={M.red} />
        </Part>
      ))}

      {/* steering rack */}
      <Part home={[0, wy + 0.04, frontZ - 0.3]} off={[0, 0, -0.4]}>
        <mesh rotation-z={ROT} material={M.steel}>
          <cylinderGeometry args={[0.03, 0.03, 2 * (tx - 0.25), 16]} />
        </mesh>
      </Part>

      {/* fuel tank (front trunk mein) */}
      <Part home={[0, wy + 0.05, frontZ + 0.2]} off={[0, 0.05, 0.9]}>
        <mesh material={M.alu}>
          <boxGeometry args={[0.5, 0.14, 0.35]} />
        </mesh>
      </Part>
    </group>
  );
}