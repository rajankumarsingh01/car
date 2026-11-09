import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  ContactShadows,
  PerformanceMonitor,
  Stats,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  SMAA,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import Car from "./components/Car";
import Lights from "./components/Lights";
import CameraRig from "./components/CameraRig";
import Engine from "./components/Engine";
import Underbody from "./components/Underbody";
import Floor from "./components/Floor";
import Overlay from "./components/Overlay";
import OverlaySync from "./components/OverlaySync";
import Loader from "./components/Loader";
import { QUALITY } from "./config/quality";
import { TOTAL_PAGES } from "./config/stages";

// Atakne par resolution kam, achha chalne par badhata hai.
// useState yahan nahi, kyunki App dobara render hua to ScrollControls tut jata hai.
function AutoQuality() {
  const setDpr = useThree((s) => s.setDpr);
  return (
    <PerformanceMonitor
      bounds={() => [28, 50]}
      onChange={({ factor }) => setDpr(1 + factor * (QUALITY.maxDpr - 1))}
      onFallback={() => setDpr(1)}
    />
  );
}

export default function App() {
  return (
    <>
      <Canvas
        dpr={[1, QUALITY.maxDpr]}
        flat={QUALITY.bloom}
        camera={{ position: [4.5, 1.3, 4.2], fov: 35 }}
        gl={{
          antialias: !QUALITY.bloom,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.25;
        }}
      >
        <color attach="background" args={["#0a0d13"]} />
        <fog attach="fog" args={["#0a0d13", 12, 30]} />
        <AutoQuality />
        <Lights />
        <Floor />

        <Suspense fallback={null}>
          <ScrollControls pages={TOTAL_PAGES} damping={0.25}>
            <CameraRig />
            <OverlaySync />
            <Car />
            <Engine />
            <Underbody />
          </ScrollControls>
          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={0.7}
            blur={2.5}
            far={4}
            frames={1}
          />
        </Suspense>

        {QUALITY.bloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={1}
              luminanceSmoothing={0.2}
              mipmapBlur
              radius={0.7}
            />
            <ToneMapping mode={ToneMappingMode.NEUTRAL} />
            <SMAA />
          </EffectComposer>
        )}

        {QUALITY.showStats && <Stats />}
      </Canvas>

      {/* kinare halke kaale (vignette) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <Overlay />
      <Loader />
    </>
  );
}