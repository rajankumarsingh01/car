import { Fragment, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";
import { getLayout } from "../utils/carLayout";
import { getTimeline } from "../utils/timeline";
import { M, Part, Pipe, applyExplode } from "./parts";

const MODEL_URL = "/models/car.glb";
const ROT = Math.PI / 2;
const AXLE_LOCAL_Z = 0.62; // engine ke origin se rear axle kitna aage hai
const SC = 0.8; // poore engine ko chhota karne ka scale
const ZS = [-0.17, 0, 0.17]; // 3 cylinders ki jagah (z)
const SIDES = [-1, 1];

export default function Engine() {
  const { scene } = useGLTF(MODEL_URL);
  const L = getLayout(scene);
  const scroll = useScroll();

  const root = useRef();
  const crank = useRef();
  const fan = useRef();
  const pistons = useRef([]);
  const rods = useRef([]);
  const ang = useRef(0);

  const engineY = L.wheelY + 0.1 * SC;
  const engineZ = L.rearZ - AXLE_LOCAL_Z * SC;
  const shaftLen = Math.max(0.3, (L.trackX - 0.15) / SC - 0.28);

  useFrame((_, dt) => {
    const t = getTimeline(scroll.offset);
    // focus ke time engine thoda aur khulta hai
    if (root.current) root.current.visible = t.fade > 0.02;
    applyExplode(root.current, t.out * (1 + 0.5 * t.focus), engineY, SC);

    ang.current += dt * (1.5 + t.focus * 7);
    const a = ang.current;
    if (crank.current) crank.current.rotation.z = a;
    if (fan.current) fan.current.rotation.y = -a * 1.6;

    pistons.current.forEach((p) => {
      if (p) p.position.x = p.userData.s * (0.27 + 0.045 * Math.sin(a + p.userData.phase));
    });
    rods.current.forEach((r) => {
      if (!r) return;
      const px = 0.27 + 0.045 * Math.sin(a + r.userData.phase);
      r.scale.y = px;
      r.position.x = r.userData.s * px * 0.5;
    });

    M.hot.emissiveIntensity = 0.05 + t.focus * 1.4;
  });

  return (
    <group ref={root} position={[0, engineY, engineZ]} scale={SC}>
      {/* crankcase ke do hisse */}
      {SIDES.map((s) => (
        <Part key={`case${s}`} home={[s * 0.1, 0, 0]} off={[s * 0.3, 0, 0]}>
          <mesh material={M.case}>
            <boxGeometry args={[0.2, 0.3, 0.52]} />
          </mesh>
        </Part>
      ))}

      {/* crankshaft (ghoomta hai) */}
      <Part>
        <group ref={crank}>
          <mesh rotation-x={ROT} material={M.steel}>
            <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
          </mesh>
          {ZS.map((z, i) => (
            <mesh key={i} position={[0, 0.035, z]} rotation-x={ROT} material={M.steel}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 20]} />
            </mesh>
          ))}
        </group>
      </Part>

      {/* 6 cylinders: barrel (fins ke saath), head, piston + rod */}
      {SIDES.flatMap((s, bi) =>
        ZS.map((z0, i) => {
          const z = z0 + (s > 0 ? 0.035 : -0.035);
          const idx = bi * 3 + i;
          const phase = i * 2.09 + (s > 0 ? 1.05 : 0);
          return (
            <Fragment key={`cyl${idx}`}>
              <Part home={[0, 0, z]} off={[s * 0.22, 0, 0]}>
                <mesh position={[s * 0.31, 0, 0]} rotation-z={ROT} material={M.case}>
                  <cylinderGeometry args={[0.075, 0.075, 0.22, 24]} />
                </mesh>
                {[0, 1, 2, 3, 4].map((k) => (
                  <mesh
                    key={k}
                    position={[s * (0.22 + k * 0.045), 0, 0]}
                    rotation-z={ROT}
                    material={M.alu}
                  >
                    <cylinderGeometry args={[0.095, 0.095, 0.012, 28]} />
                  </mesh>
                ))}
              </Part>

              <Part home={[0, 0, z]} off={[s * 0.42, 0.04, 0]}>
                <mesh position={[s * 0.47, 0, 0]} material={M.alu}>
                  <boxGeometry args={[0.1, 0.2, 0.2]} />
                </mesh>
                <mesh position={[s * 0.56, 0, 0]} material={M.copper}>
                  <boxGeometry args={[0.07, 0.15, 0.19]} />
                </mesh>
                <mesh position={[s * 0.47, 0.13, 0]} material={M.white}>
                  <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
                </mesh>
              </Part>

              <Part home={[0, 0, z]} off={[s * 0.1, 0, 0]}>
                <group
                  ref={(el) => {
                    pistons.current[idx] = el;
                  }}
                  userData={{ s, phase }}
                >
                  <mesh rotation-z={ROT} material={M.alu}>
                    <cylinderGeometry args={[0.06, 0.06, 0.07, 20]} />
                  </mesh>
                  <mesh rotation-z={ROT} material={M.dark}>
                    <cylinderGeometry args={[0.063, 0.063, 0.012, 20]} />
                  </mesh>
                </group>
                <mesh
                  ref={(el) => {
                    rods.current[idx] = el;
                  }}
                  rotation-z={ROT}
                  userData={{ s, phase }}
                  material={M.steel}
                >
                  <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
                </mesh>
              </Part>
            </Fragment>
          );
        })
      )}

      {/* cooling fan (911 ki pehchaan) */}
      <Part home={[0, 0.27, 0.02]} off={[0, 0.55, 0]}>
        <mesh material={M.shroud}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 32, 1, true]} />
        </mesh>
        <group ref={fan}>
          <mesh material={M.steel}>
            <cylinderGeometry args={[0.04, 0.04, 0.07, 16]} />
          </mesh>
          {Array.from({ length: 9 }).map((_, k) => (
            <group key={k} rotation-y={(k * Math.PI * 2) / 9}>
              <mesh position={[0.12, 0, 0]} rotation-x={0.5} material={M.dark}>
                <boxGeometry args={[0.15, 0.008, 0.05]} />
              </mesh>
            </group>
          ))}
        </group>
      </Part>

      {/* turbo */}
      <Part home={[-0.1, 0.06, -0.33]} off={[-0.35, 0.3, -0.3]}>
        <mesh rotation-z={ROT} material={M.hot}>
          <cylinderGeometry args={[0.075, 0.075, 0.14, 20]} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation-z={ROT} material={M.alu}>
          <cylinderGeometry args={[0.065, 0.065, 0.1, 20]} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation-z={ROT} material={M.steel}>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
        </mesh>
        <mesh position={[0.28, 0, 0]} rotation-z={ROT} material={M.blue}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
        </mesh>
        <mesh position={[-0.02, -0.1, 0]} material={M.hot}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />
        </mesh>
      </Part>

      {/* exhaust pipes (garam glow) */}
      {SIDES.map((s) => (
        <Part key={`ex${s}`} off={[s * 0.3, -0.05, -0.15]}>
          <Pipe
            material={M.hot}
            r={0.03}
            points={[
              [s * 0.5, 0.0, 0.2],
              [s * 0.53, -0.1, 0.02],
              [s * 0.46, -0.2, -0.2],
              [s * 0.22, -0.24, -0.24],
              [s * 0.06, -0.23, -0.08],
            ]}
          />
        </Part>
      ))}

      {/* muffler + tailpipe */}
      <Part home={[0, -0.22, 0.02]} off={[0, -0.05, -0.3]}>
        <mesh material={M.steel}>
          <boxGeometry args={[0.45, 0.13, 0.4]} />
        </mesh>
        <mesh position={[0, 0, -0.25]} rotation-x={ROT} material={M.alu}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 16]} />
        </mesh>
      </Part>

      {/* bell housing + gearbox + differential */}
      <Part home={[0, -0.02, 0.4]} off={[0, -0.05, 0.45]}>
        <mesh rotation-x={ROT} material={M.case}>
          <cylinderGeometry args={[0.13, 0.13, 0.14, 28]} />
        </mesh>
        <mesh position={[0, 0, 0.24]} material={M.alu}>
          <boxGeometry args={[0.5, 0.26, 0.32]} />
        </mesh>
        <mesh position={[0, -0.08, 0.22]} rotation-z={ROT} material={M.steel}>
          <cylinderGeometry args={[0.09, 0.09, 0.54, 24]} />
        </mesh>
      </Part>

      {/* axle shafts (gearbox se wheels tak) */}
      {SIDES.map((s) => (
        <Part
          key={`ax${s}`}
          home={[s * (0.28 + shaftLen / 2), -0.1, AXLE_LOCAL_Z]}
          off={[s * 0.5, 0, 0.1]}
        >
          <mesh rotation-z={ROT} material={M.steel}>
            <cylinderGeometry args={[0.022, 0.022, shaftLen, 12]} />
          </mesh>
          {[-1, 1].map((e) => (
            <mesh key={e} position={[(e * shaftLen) / 2, 0, 0]} material={M.dark}>
              <sphereGeometry args={[0.04, 12, 12]} />
            </mesh>
          ))}
        </Part>
      ))}
    </group>
  );
}