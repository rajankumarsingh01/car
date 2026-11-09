Project Context: 3D Car Teardown Scroll Website
Is poore document ko kisi bhi AI ko pehle message mein paste karo. Phir bolo: "Phase 0 se start karo."

1. Hum kya bana rahe hain
Ek premium, realistic 3D scroll website (frontend only, no backend, no database). Ek luxury car (BMW jaisi) screen pe dikhti hai. User scroll karta hai aur:

Car slow rotate hoti hai. Text: "Scroll to open it up."
Camera zoom in hota hai, body (paint, glass) transparent / blueprint ban jaati hai.
Saare parts (wheels, doors, seats, engine, suspension, exhaust) apne center se bahar phailte hain (exploded view).
Camera engine pe focus karta hai. Pistons/crankshaft chalte hain.
Parts wapas jud jaate hain, car poori ho jaati hai. End text: "Built by Rajan."
Maqsad:

Is site ko screen-record karke Instagram Reels, YouTube Shorts aur LinkedIn pe daalna (no face, no voice, sirf visuals, text captions aur music).
Portfolio mein "signature project" ki tarah rakhna (job/internship ke liye proof of work).
2. Non-negotiable rules (AI ke liye)
Sab kuch FREE. Koi paid tool, paid model, paid hosting, paid API nahi. Budget zero hai.
Zip file kabhi nahi. Code sirf do tarah se dena:
Full updated file (poori file copy-paste ke liye), ya
Exact Find & Replace steps (kaunsi file, kya dhoondna, uski jagah kya likhna).
Har phase ke start mein folder structure dikhao aur batao kaunsi file naya hai, kaunsi change hui.
Ek baar mein ek hi phase. Phase khatam hone pe acceptance checklist do. Main "done" bolu tabhi agla phase.
Jab kuch kaam na kare to guess mat karo. Mujhse browser console (F12) ka error ya screenshot maango.
Har command aur code Windows-friendly ho (agar mera OS alag ho to pehle pooch lo).
Language: Hinglish (Hindi in English letters) simple tareeke se. Code comments English mein.
Pehle mujhse mera laptop spec (RAM, GPU) pooch lo, taaki performance budget decide ho.
3. Tech stack (sab free / open-source)
Kaam	Tool
App	React + Vite
3D	three, @react-three/fiber, @react-three/drei
Scroll sync	drei ScrollControls + useScroll (isse GSAP/Lenis ki zaroorat nahi)
Polish	@react-three/postprocessing (Bloom, Vignette)
Text overlay animation	framer-motion (ya simple CSS)
3D models	Sketchfab (Downloadable + CC-BY/CC0, GLB/glTF)
Model optimize	@gltf-transform/cli (free, Draco + WebP compress)
Hosting	Vercel ya Netlify free tier + GitHub
Recording	OBS Studio (free)
Editing	CapCut (free)
Install (Phase 0 mein):

npm create vite@latest car-teardown -- --template react
cd car-teardown
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing framer-motion
Agar peer-dependency error aaye: react aur @react-three/fiber ke versions match karwao (React 18 ke saath fiber v8, React 19 ke saath fiber v9). Error mujhse maang ke fix karo.

3.1 Target folder structure
car-teardown/
├─ public/
│  ├─ models/
│  │  ├─ car.glb          (bahar ki premium car, optimized)
│  │  └─ engine.glb       (detailed engine, optional)
│  └─ favicon.svg
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx             (Canvas + ScrollControls + Overlay)
│  ├─ index.css
│  ├─ config/
│  │  └─ stages.js        (scroll ranges + text, ek jagah)
│  ├─ components/
│  │  ├─ Car.jsx          (model load, auto-center, explode, body fade)
│  │  ├─ Engine.jsx       (engine model + piston animation)
│  │  ├─ Lights.jsx       (environment + rim lights)
│  │  ├─ Effects.jsx      (bloom, vignette)
│  │  ├─ Overlay.jsx      (scroll ke saath badalne wale text)
│  │  └─ Loader.jsx       (loading screen)
│  └─ hooks/
│     └─ useStage.js      (scroll offset se current stage)
├─ index.html
├─ package.json
└─ vite.config.js
4. Phases
Phase 0: Initialization & setup
Node.js LTS, VS Code, Git install. GitHub account.
Vite project banao, dependencies install karo (upar wale commands).
Extra folders components, config, hooks, public/models banao.
index.css mein reset: body{margin:0;background:#0d1117}.
Done jab: npm run dev pe blank dark page khule, koi error na ho.
Phase 1: 3D model sourcing & prep
Sketchfab pe search: BMW M3 interior engine, car full interior engine, supercar cutaway, car engine V8 exploded.
Filters: Downloadable, license CC-BY ya CC0, format glTF/GLB.
Model Inspector mein check karo ki doors, wheels, seats, engine alag-alag objects hain.
Agar ek model mein car + engine dono nahi milte to do model lo (car + engine).
Credit ke liye creator ka naam aur link note karo (site ke footer aur video description mein dena hai).
Optimize (free):
npx @gltf-transform/cli optimize input.glb public/models/car.glb --compress draco --texture-compress webp
Target: har file 15 MB se kam.
Done jab: public/models/car.glb (aur optional engine.glb) maujood hain.
Phase 2: Base 3D scene
App.jsx mein Canvas, Environment, lights, ContactShadows.
Car.jsx mein useGLTF, model ko auto-scale (size ~4) aur center karo.
Console mein mesh aur material ke naam print karo.
Done jab: car screen pe sahi size mein, lighting ke saath dikhe.
Phase 3: Scroll camera
ScrollControls pages={6} lagao.
useScroll().offset se camera orbit + zoom (rotate, zoom in, pull back).
Done jab: scroll karne pe camera smooth ghoome, lag na ho.
Phase 4: Body fade + exploded view
Material naam se body/glass pehchano aur opacity kam karo (blueprint feel).
Har mesh ko model ke center se bahar ki direction mein move karo (lerp scroll ke hisaab se).
End pe wapas assemble.
Done jab: scroll se parts bahar phailte hain aur wapas jud jaate hain.
Phase 5: Engine focus
Engine reveal (car fade + engine zoom) ya engine ke andar zoom.
Pistons/crankshaft ka loop animation (agar parts alag hain to useFrame se).
Done jab: engine pe focus ke time pistons/gears chalte dikhein.
Phase 6: Premium polish
HDRI environment, rim lights, soft shadows.
Bloom + Vignette (kam intensity, warna mehnga lagega).
Edge lines/wireframe blueprint effect (optional).
Done jab: screenshot ko dekh ke "premium" lage, toy jaisa nahi.
Phase 7: UI, text overlays, loader
5 stage ke text overlays (stages.js mein config).
Loading screen (useProgress from drei).
Footer mein model creator ka credit + "Built by Rajan".
Mobile (vertical 9:16) pe layout check, kyunki reels vertical hongi.
Done jab: har stage pe sahi text aaye, loader model load hone tak chale.
Phase 8: Performance & deploy
dpr={[1,2]}, shadow map size kam, bloom optional.
GitHub pe push, Vercel ya Netlify pe free deploy.
Done jab: live link pe site 30+ fps chalti hai.
Phase 9: Record & publish reels
OBS se 1080x1920 (vertical) record, ya normal record karke CapCut mein crop.
Hook: pehle 3 sec mein explode moment ya zoom-in dikhao.
Reel ideas: (1) full teardown, (2) sirf explode moment (beat drop pe), (3) engine zoom, (4) body blueprint reveal.
Music: Instagram/YouTube ke apne in-app audio library se hi lagao (copyright safe). LinkedIn pe bina music.
Credit line (model creator) description mein likho. Bio mein portfolio link.
5. Pehle se jo ho chuka hai
Ek procedural (code se bani) car demo banaya tha (boxes/cylinders). Wo toy jaisi dikhi, isliye reject hui. Us demo ka lesson: real premium model chahiye, code se realistic car nahi banti.
Ek generic "auto explode" Car.jsx logic discuss hua: model ke har mesh ko center se bahar ki direction mein move karna, material naam regex (paint|body|glass|window) se body fade karna. Ye Phase 4 ka base hai.
6. Risks (dhyan rakhna)
Model quality sabse bada factor hai. Achha model = achha reel.
Single-piece car model se exploded view nahi banta. Parts alag hone chahiye.
Heavy model (15 MB+) se scroll lagega.
CC-BY model ka credit na dene pe license violation hoti hai.
Bahar ke songs ko editing app mein daal ke upload karne pe copyright claim aa sakta hai. In-app audio library use karo.
7. AI ke liye first instruction
"Phase 0 se start karo. Pehle mere laptop ke specs aur OS pucho. Phir Phase 0 ka poora folder structure, commands aur exact files do. Phase khatam hone pe acceptance checklist do aur mere 'done' bolne ka wait karo."