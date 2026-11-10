import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { FADE_MATERIALS, EXPLODE, OVERRIDES } from "../config/stages";
import { getTimeline } from "../utils/timeline";
import { config } from "../utils/configStore";

const MODEL_URL = "/models/car.glb";
const TARGET_LENGTH = 4; // car ki lambai (scene units)
const HIDE_COAT_LAYER = true;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const tmpColor = new THREE.Color();

export default function Car() {
  const { scene } = useGLTF(MODEL_URL);
  const scroll = useScroll();

  // model ko size 4 mein fit karo, center karo, zameen pe rakho
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = TARGET_LENGTH / Math.max(size.x, size.y, size.z);
    return {
      scale: s,
      offset: [-center.x * s, -box.min.y * s, -center.z * s],
    };
  }, [scene]);

  // har mesh ka explode target aur fade hone wale materials taiyar karo
  const { parts, fades, edges, paintMats, rimMats } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const sceneBox = new THREE.Box3().setFromObject(scene);
    const size = sceneBox.getSize(new THREE.Vector3());
    const L = Math.max(size.x, size.y, size.z);
    const carCenter = sceneBox.getCenter(new THREE.Vector3());
    const groundY = sceneBox.min.y;

    const info = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      const box = new THREE.Box3().setFromObject(o);
      info.push({
        o,
        m,
        mat: m.name,
        box,
        c: box.getCenter(new THREE.Vector3()),
        tris: Math.round((o.geometry.index?.count ?? 0) / 3),
      });
      if (HIDE_COAT_LAYER && m.name === "coat") o.visible = false;
    });

    // wheels: har tire/rim ko sabse paas wale bade rim se jodo
    const bigRims = info.filter((i) => i.mat === "930_rim" && i.tris > 1000);
    const wheelOf = new Map();
    if (bigRims.length) {
      info
        .filter((i) => i.mat === "930_tire" || i.mat === "930_rim")
        .forEach((i) => {
          let best = bigRims[0];
          bigRims.forEach((r) => {
            if (r.c.distanceTo(i.c) < best.c.distanceTo(i.c)) best = r;
          });
          wheelOf.set(i.o, best.c);
        });
    }

    const parts = info.map((i) => {
      const d = i.c.clone().sub(carCenter);
      const dir = new THREE.Vector3();
      let dist;
      const ov = OVERRIDES[i.o.name];

      if (ov) {
        dir.set(...ov.dir).normalize();
        dist = ov.dist;
      } else if (i.mat === "paint" || i.mat === "coat") {
        dir.set(0, 1, 0);
        dist = EXPLODE.body;
      } else if (i.mat === "glass") {
        dir.set(d.x * 0.3, 1, d.z * 0.3).normalize();
        dist = EXPLODE.glass;
      } else if (wheelOf.has(i.o)) {
        const wc = wheelOf.get(i.o);
        dir
          .set(
            Math.sign(wc.x - carCenter.x) || 1,
            0,
            Math.sign(wc.z - carCenter.z) * 0.25
          )
          .normalize();
        dist = EXPLODE.wheel;
      } else if (i.tris > 20000) {
        dir.set(0, 1, 0);
        dist = EXPLODE.bigInner;
      } else {
        dir.set(d.x * 1.3, d.y * 1.2, d.z * 0.9);
        if (dir.length() < 0.05 * L) dir.set(0, 1, 0);
        dir.normalize();
        dist = EXPLODE.part * (0.6 + clamp01(d.length() / (L * 0.5)) * 0.8);
      }

      // world offset, zameen ke neeche nahi jana
      const off = dir.multiplyScalar(dist * L);
      off.y = Math.max(off.y, groundY - i.box.min.y);

      // world offset ko mesh ke parent ke local offset mein badlo
      const parent = i.o.parent;
      const a = parent.worldToLocal(i.c.clone());
      const b = parent.worldToLocal(i.c.clone().add(off));
      const home = i.o.position.clone();
      const target = home.clone().add(b.sub(a));
      return { o: i.o, home, target };
    });

    // transparent hone wale materials
    const seen = new Set();
    const fades = [];
    info.forEach((i) => {
      if (seen.has(i.m)) return;
      seen.add(i.m);
      const target = FADE_MATERIALS[i.m.name];
      if (target !== undefined) {
        i.m.transparent = true;
        fades.push({
          m: i.m,
          base: i.m.opacity,
          target,
          cc: "clearcoat" in i.m ? i.m.clearcoat : 0,
          glass: i.m.name === "glass", // shishe interior chapter mein bhi saaf hote hain
        });
      }
    });

    // body ki neeli outline lines (hologram look)
    const edges = [];
    info.forEach((i) => {
      if (i.mat === "paint" && i.tris > 20000) {
        const lines = new THREE.LineSegments(
          new THREE.EdgesGeometry(i.o.geometry, 35),
          new THREE.LineBasicMaterial({
            color: new THREE.Color(0.5, 1.3, 2.4),
            transparent: true,
            opacity: 0,
            depthWrite: false,
          })
        );
        i.o.add(lines);
        edges.push(lines.material);
      }
    });

    // configurator: paint aur rim ke materials (original rang yaad rakho, stock par wapas aane ke liye)
    const seenColor = new Set();
    const paintMats = [];
    const rimMats = [];
    info.forEach((i) => {
      if (seenColor.has(i.m) || !i.m.color) return;
      seenColor.add(i.m);
      if (i.mat === "paint") paintMats.push({ m: i.m, orig: i.m.color.clone() });
      if (i.mat === "930_rim") rimMats.push({ m: i.m, orig: i.m.color.clone() });
    });

    console.log("Explode parts:", parts.length, "| fade materials:", fades.length, "| edges:", edges.length);
    return { parts, fades, edges, paintMats, rimMats };
  }, [scene]);

  useFrame(() => {
    const t = getTimeline(scroll.offset);

    parts.forEach((p) => p.o.position.lerpVectors(p.home, p.target, t.out));
    edges.forEach((m) => (m.opacity = t.fade * 0.6));

    // configurator ka rang dheere-dheere badalta hai (null = stock)
    const tint = (list, hex) =>
      list.forEach(({ m, orig }) => m.color.lerp(hex ? tmpColor.set(hex) : orig, 0.12));
    tint(paintMats, config.paint);
    tint(rimMats, config.rim);

    fades.forEach((f) => {
      const level = f.glass ? t.glass : t.fade;
      f.m.opacity = THREE.MathUtils.lerp(f.base, f.target, level);
      if ("clearcoat" in f.m) f.m.clearcoat = f.cc * (1 - level);
      f.m.depthWrite = level < 0.05;
    });
  });

  return (
    <group scale={scale} position={offset}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);