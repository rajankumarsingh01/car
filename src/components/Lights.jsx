import { Environment, Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      {/* custom studio: lambi strip lights se paint par showroom jaisi reflections */}
      <Environment resolution={256} frames={1} environmentIntensity={1.15}>
        <color attach="background" args={["#05070b"]} />
        <Lightformer form="rect" intensity={2.5} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={5} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[14, 1.6, 1]} color="#ffd9b8" />
        <Lightformer form="rect" intensity={5} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[14, 1.6, 1]} color="#b8dcff" />
        <Lightformer form="rect" intensity={4} position={[0, 1.5, -9]} scale={[14, 1.6, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 1.5, 9]} rotation-y={Math.PI} scale={[10, 1.2, 1]} />
      </Environment>

      {/* upar se floor pe roshni ka gola */}
      <spotLight position={[0, 9, 0]} angle={0.5} penumbra={1} intensity={30} color="#ffffff" />

      {/* garam aur thandi rim lights (pehle se halki, taaki hood par dhabba na bane) */}
      <pointLight position={[-5, 2, -4]} intensity={30} color="#e8925a" />
      <pointLight position={[5, 3, -4]} intensity={45} color="#7cc4ff" />
    </>
  );
}