import { MeshReflectorMaterial } from "@react-three/drei";
import { QUALITY } from "../config/quality";

export default function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.002, 0]}>
      <circleGeometry args={[40, 64]} />
      {QUALITY.reflectiveFloor ? (
        <MeshReflectorMaterial
          color="#0c1118"
          metalness={0.5}
          roughness={0.9}
          resolution={512}
          blur={[300, 100]}
          mixBlur={1}
          mixStrength={14}
          mirror={0}
          depthScale={0.8}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.3}
        />
      ) : (
        <meshStandardMaterial color="#0c1118" roughness={0.8} metalness={0.3} />
      )}
    </mesh>
  );
}