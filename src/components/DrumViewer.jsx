import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Minus, Plus, RotateCcw } from 'lucide-react';

const COPY = {
  pt: {
    visual: 'MODELO 3D INTERATIVO',
    detail: 'Toque em uma parte para ver os detalhes',
    drag: 'Arraste para girar · role para aproximar',
    selected: 'PARTE SELECIONADA',
    parts: {
      body: ['Corpo industrial', 'Polietileno de alta densidade com reforços moldados para uso operacional.'],
      lid: ['Tampa articulada', 'Tampa superior com abertura para inspeção e acesso ao interior.'],
      handle: ['Alças laterais', 'Pegas integradas para manuseio do recipiente.'],
      contents: ['Conteúdo', 'Nível visual demonstrativo, ajustável pelo controle abaixo.'],
      label: ['Identificação', 'Área destinada à identificação e rastreabilidade do recipiente.'],
    },
    fill: 'NÍVEL DE PREENCHIMENTO',
    lidOpen: 'Fechar tampa',
    lidClose: 'Abrir tampa',
    reset: 'Restaurar visualização inicial',
    zoomIn: 'Aproximar',
    zoomOut: 'Afastar',
    webglFallback: 'Visualização 3D indisponível. Exibindo imagem alternativa.',
  },
  en: {
    visual: 'INTERACTIVE 3D MODEL',
    detail: 'Select a part to see details',
    drag: 'Drag to rotate · scroll to zoom',
    selected: 'SELECTED PART',
    parts: {
      body: ['Industrial body', 'High-density polyethylene with molded reinforcement for operational use.'],
      lid: ['Hinged lid', 'Top lid opens to inspect and access the interior.'],
      handle: ['Side handles', 'Integrated grips for handling the container.'],
      contents: ['Contents', 'Demonstration fill level, adjustable with the control below.'],
      label: ['Identification', 'Area reserved for container identification and traceability.'],
    },
    fill: 'FILL LEVEL',
    lidOpen: 'Close lid',
    lidClose: 'Open lid',
    reset: 'Restore initial view',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    webglFallback: '3D view unavailable. Showing the alternative image.',
  },
  es: {
    visual: 'MODELO 3D INTERACTIVO',
    detail: 'Selecciona una parte para ver detalles',
    drag: 'Arrastra para girar · desplaza para acercar',
    selected: 'PARTE SELECCIONADA',
    parts: {
      body: ['Cuerpo industrial', 'Polietileno de alta densidad con refuerzos moldeados para uso operativo.'],
      lid: ['Tapa articulada', 'La tapa superior se abre para inspeccionar y acceder al interior.'],
      handle: ['Asas laterales', 'Agarres integrados para manipular el recipiente.'],
      contents: ['Contenido', 'Nivel demostrativo ajustable con el control inferior.'],
      label: ['Identificación', 'Área destinada a la identificación y trazabilidad del recipiente.'],
    },
    fill: 'NIVEL DE LLENADO',
    lidOpen: 'Cerrar tapa',
    lidClose: 'Abrir tapa',
    reset: 'Restaurar vista inicial',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    webglFallback: 'Vista 3D no disponible. Se muestra la imagen alternativa.',
  },
};

const INITIAL_FILL = 68;
const INITIAL_CAMERA = new THREE.Vector3(3.35, 2.55, 4.7);
const INITIAL_TARGET = new THREE.Vector3(0, 1.25, 0);

function makeLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#f2f7f1';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#b7d2c1';
  context.lineWidth = 12;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.fillStyle = '#17613f';
  context.font = '800 47px sans-serif';
  context.fillText('BIOCIRCULAR', 28, 100);
  context.font = '600 22px sans-serif';
  context.fillStyle = '#395c4b';
  context.fillText('RECIPIENTE INDUSTRIAL', 30, 148);
  context.font = '500 17px monospace';
  context.fillText('RASTREABILIDADE · OGR', 30, 190);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBarrel(onPart) {
  const root = new THREE.Group();
  const targets = [];
  const green = new THREE.MeshPhysicalMaterial({
    color: '#247650',
    roughness: 0.3,
    metalness: 0.02,
    clearcoat: 0.42,
    clearcoatRoughness: 0.24,
  });
  const deepGreen = new THREE.MeshPhysicalMaterial({
    color: '#175a3d',
    roughness: 0.35,
    clearcoat: 0.28,
  });
  const white = new THREE.MeshStandardMaterial({ color: '#e7eee8', roughness: 0.38 });
  const darkInterior = new THREE.MeshStandardMaterial({
    color: '#102d22',
    side: THREE.DoubleSide,
    roughness: 0.58,
  });

  function addMesh(geometry, material, position, part, castShadow = true) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    if (part) {
      mesh.userData.part = part;
      targets.push(mesh);
    }
    root.add(mesh);
    return mesh;
  }

  const profile = [
    new THREE.Vector2(0.76, 0.08),
    new THREE.Vector2(0.86, 0.12),
    new THREE.Vector2(0.94, 0.22),
    new THREE.Vector2(0.98, 0.42),
    new THREE.Vector2(1.0, 0.68),
    new THREE.Vector2(1.0, 1.78),
    new THREE.Vector2(0.97, 1.98),
    new THREE.Vector2(0.91, 2.12),
    new THREE.Vector2(0.83, 2.2),
    new THREE.Vector2(0.82, 2.34),
    new THREE.Vector2(0.91, 2.35),
    new THREE.Vector2(0.92, 2.42),
    new THREE.Vector2(0.87, 2.47),
  ];
  const body = addMesh(
    new THREE.LatheGeometry(profile, 72),
    green,
    [0, 0, 0],
    'body'
  );
  body.name = 'barrel-body';

  const base = addMesh(
    new THREE.CylinderGeometry(0.78, 0.82, 0.12, 64),
    deepGreen,
    [0, 0.06, 0],
    'body'
  );
  base.name = 'barrel-base';

  const interior = addMesh(
    new THREE.CylinderGeometry(0.79, 0.79, 2.19, 56, 1, true),
    darkInterior,
    [0, 1.25, 0],
    'body',
    false
  );
  interior.material.side = THREE.BackSide;

  for (const [height, radius, width] of [
    [0.38, 0.98, 0.035],
    [0.66, 1.005, 0.026],
    [0.94, 1.005, 0.026],
    [1.23, 1.005, 0.026],
    [1.52, 1.005, 0.026],
    [1.8, 0.995, 0.03],
  ]) {
    const rib = addMesh(
      new THREE.TorusGeometry(radius, width, 10, 72),
      deepGreen,
      [0, height, 0],
      'body'
    );
    rib.rotation.x = Math.PI / 2;
  }

  for (let index = 0; index < 14; index += 1) {
    const angle = (index / 14) * Math.PI * 2;
    const radius = 0.985;
    const rib = addMesh(
      new THREE.BoxGeometry(0.045, 1.08, 0.04),
      deepGreen,
      [Math.sin(angle) * radius, 1.27, Math.cos(angle) * radius],
      'body'
    );
    rib.rotation.y = angle;
  }

  for (const side of [-1, 1]) {
    const handle = addMesh(
      new THREE.TorusGeometry(0.2, 0.055, 12, 32),
      deepGreen,
      [side * 0.89, 2.25, 0],
      'handle'
    );
    handle.scale.set(0.85, 1.05, 0.7);
  }

  const labelMaterial = new THREE.MeshStandardMaterial({
    map: makeLabelTexture(),
    roughness: 0.48,
    side: THREE.DoubleSide,
  });
  const label = addMesh(
    new THREE.PlaneGeometry(0.82, 0.41),
    labelMaterial,
    [0, 1.3, 1.008],
    'label'
  );
  label.name = 'barrel-label';

  const capPivot = new THREE.Group();
  capPivot.position.set(0, 2.43, -0.72);
  root.add(capPivot);

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.91, 0.91, 0.14, 72),
    white
  );
  lid.position.set(0, 0.07, 0.72);
  lid.castShadow = true;
  lid.receiveShadow = true;
  lid.userData.part = 'lid';
  targets.push(lid);
  capPivot.add(lid);

  const lidRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.035, 10, 72),
    deepGreen
  );
  lidRim.rotation.x = Math.PI / 2;
  lidRim.position.set(0, 0.145, 0.72);
  lidRim.userData.part = 'lid';
  targets.push(lidRim);
  capPivot.add(lidRim);

  const lidGrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.075, 0.14),
    deepGreen
  );
  lidGrip.position.set(0, 0.17, 1.38);
  lidGrip.castShadow = true;
  lidGrip.userData.part = 'lid';
  targets.push(lidGrip);
  capPivot.add(lidGrip);

  const fillGroup = new THREE.Group();
  root.add(fillGroup);
  const fillMaterial = new THREE.MeshPhysicalMaterial({
    color: '#72bf8e',
    roughness: 0.16,
    metalness: 0.03,
    transparent: true,
    opacity: 0.86,
    clearcoat: 0.8,
  });
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.735, 0.735, 1, 56),
    fillMaterial
  );
  liquid.castShadow = false;
  liquid.userData.part = 'contents';
  targets.push(liquid);
  fillGroup.add(liquid);

  const liquidSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.735, 56),
    new THREE.MeshPhysicalMaterial({
      color: '#9bd9ad',
      roughness: 0.12,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.9,
      side: THREE.DoubleSide,
    })
  );
  liquidSurface.rotation.x = -Math.PI / 2;
  liquidSurface.userData.part = 'contents';
  targets.push(liquidSurface);
  fillGroup.add(liquidSurface);

  function setFill(percent) {
    const height = Math.max(0.012, 1.92 * (percent / 100));
    liquid.visible = percent > 0;
    liquidSurface.visible = percent > 0;
    liquid.scale.y = height;
    liquid.position.y = 0.16 + height / 2;
    liquidSurface.position.y = 0.16 + height;
  }

  return {
    root,
    targets,
    capPivot,
    setFill,
    dispose() {
      root.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.map?.dispose();
            material.dispose();
          });
        } else {
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
    },
  };
}

export default function DrumViewer({ fallbackImage, language = 'pt', imageAlt }) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const barrelRef = useRef(null);
  const lidTargetRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [tampaAberta, setTampaAberta] = useState(false);
  const [preenchimento, setPreenchimento] = useState(INITIAL_FILL);
  const [parteSelecionada, setParteSelecionada] = useState(null);
  const copy = COPY[language] || COPY.pt;
  const selectedCopy = parteSelecionada ? copy.parts[parteSelecionada] : null;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let controls;
    let barrel;
    let animationFrame;
    let resizeObserver;
    let pointerStart = null;
    let mounted = true;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#10251f');
      scene.fog = new THREE.Fog('#10251f', 8, 17);

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.copy(INITIAL_CAMERA);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.className = 'absolute inset-0 h-full w-full touch-none outline-none';
      renderer.domElement.setAttribute('aria-label', copy.drag);
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.tabIndex = 0;
      host.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      scene.add(new THREE.HemisphereLight('#f4fff6', '#172b22', 2.0));

      const keyLight = new THREE.DirectionalLight('#fff5d9', 3.8);
      keyLight.position.set(-3.5, 6, 4);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 5;
      keyLight.shadow.camera.bottom = -3;
      keyLight.shadow.bias = -0.00035;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight('#9eddb3', 2.1);
      rimLight.position.set(4, 3.5, -3);
      scene.add(rimLight);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(5.5, 64),
        new THREE.MeshStandardMaterial({ color: '#20382e', roughness: 0.82 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.015;
      floor.receiveShadow = true;
      scene.add(floor);

      barrel = makeBarrel();
      barrel.root.traverse((object) => {
        if (object.isMesh) object.castShadow = true;
      });
      barrel.setFill(preenchimento);
      scene.add(barrel.root);
      barrelRef.current = barrel;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.copy(INITIAL_TARGET);
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.minDistance = 3.0;
      controls.maxDistance = 8.5;
      controls.minPolarAngle = 0.25;
      controls.maxPolarAngle = Math.PI * 0.48;
      controls.enablePan = false;
      controls.saveState();
      controlsRef.current = controls;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      function pointerDown(event) {
        pointerStart = { x: event.clientX, y: event.clientY };
      }
      function pointerUp(event) {
        if (!pointerStart) return;
        const distance = Math.hypot(
          event.clientX - pointerStart.x,
          event.clientY - pointerStart.y
        );
        pointerStart = null;
        if (distance > 7) return;

        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(barrel.targets, false)[0];
        if (hit?.object.userData.part) setParteSelecionada(hit.object.userData.part);
      }
      renderer.domElement.addEventListener('pointerdown', pointerDown);
      renderer.domElement.addEventListener('pointerup', pointerUp);

      function resizeScene() {
        if (!host.clientWidth || !host.clientHeight) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight, false);
      }

      resizeObserver = new ResizeObserver(resizeScene);
      resizeObserver.observe(host);
      window.addEventListener('resize', resizeScene);

      function animate() {
        if (!mounted) return;
        animationFrame = window.requestAnimationFrame(animate);
        barrel.capPivot.rotation.x += (lidTargetRef.current - barrel.capPivot.rotation.x) * 0.09;
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
      setReady(true);

      return () => {
        mounted = false;
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        window.removeEventListener('resize', resizeScene);
        renderer.domElement.removeEventListener('pointerdown', pointerDown);
        renderer.domElement.removeEventListener('pointerup', pointerUp);
        controls.dispose();
        barrel.dispose();
        floor.geometry.dispose();
        floor.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        rendererRef.current = null;
        controlsRef.current = null;
        barrelRef.current = null;
      };
    } catch (error) {
      console.error('Não foi possível iniciar a visualização 3D:', error);
      barrel?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
      setReady(false);
      return undefined;
    }
  }, []);

  useEffect(() => {
    barrelRef.current?.setFill(preenchimento);
  }, [preenchimento]);

  function alternarTampa() {
    const aberta = !tampaAberta;
    setTampaAberta(aberta);
    lidTargetRef.current = aberta ? -1.48 : 0;
  }

  function zoom(fator) {
    const controls = controlsRef.current;
    if (!controls) return;
    if (fator < 1) controls.dollyOut(1 / fator);
    else controls.dollyIn(fator);
    controls.update();
  }

  function restaurar() {
    controlsRef.current?.reset();
    lidTargetRef.current = 0;
    setTampaAberta(false);
    setPreenchimento(INITIAL_FILL);
    setParteSelecionada(null);
  }

  return (
    <div className="relative isolate aspect-[5/4] w-full overflow-hidden rounded-2xl bg-[#10251f] sm:aspect-[6/5] lg:aspect-[5/4]">
      <img
        src={fallbackImage}
        alt={imageAlt}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? 'opacity-0' : 'opacity-100'}`}
      />
      <div ref={hostRef} className="absolute inset-0" aria-hidden={!ready} />

      {!ready && (
        <p className="absolute bottom-3 left-3 right-3 rounded-lg bg-[#0B1726]/80 px-3 py-2 text-center text-xs text-white">
          {copy.webglFallback}
        </p>
      )}

      {ready && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
            <span className="rounded-full border border-white/15 bg-[#0B1726]/70 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#d4ebd9] backdrop-blur-sm sm:text-[10px]">
              {copy.visual}
            </span>
            <div className="max-w-[52%] rounded-xl border border-white/15 bg-[#0B1726]/75 p-3 text-right text-white shadow-lg backdrop-blur-md sm:max-w-[48%] sm:p-4">
              <p className="text-[9px] font-bold tracking-[0.1em] text-[#a6d7b3] sm:text-[10px]">
                {copy.selected}
              </p>
              <p className="mt-1 text-xs font-bold sm:text-sm">
                {selectedCopy?.[0] || copy.detail}
              </p>
              {selectedCopy && (
                <p className="mt-1 hidden text-left text-[11px] leading-4 text-slate-200 sm:block">
                  {selectedCopy[1]}
                </p>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07140f]/95 via-[#0b1b14]/88 to-transparent px-3 pb-3 pt-12 sm:px-5 sm:pb-5 sm:pt-16">
            {selectedCopy && (
              <p className="mb-2 text-[11px] leading-4 text-slate-200 sm:hidden">
                {selectedCopy[1]}
              </p>
            )}
            <div className="mb-3 flex items-center justify-between gap-3">
              <label htmlFor="drum-fill" className="text-[9px] font-bold tracking-[0.1em] text-[#d4ebd9] sm:text-[10px]">
                {copy.fill}
              </label>
              <span className="min-w-10 text-right text-xs font-bold tabular-nums text-white">
                {preenchimento}%
              </span>
            </div>
            <input
              id="drum-fill"
              type="range"
              min="0"
              max="100"
              step="1"
              value={preenchimento}
              onChange={(event) => setPreenchimento(Number(event.target.value))}
              aria-label={copy.fill}
              className="mb-3 block h-1.5 w-full cursor-pointer accent-[#8ac69a]"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="hidden text-[10px] text-slate-300 sm:block">{copy.drag}</p>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => zoom(0.84)}
                  aria-label={copy.zoomIn}
                  title={copy.zoomIn}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6d7b3]"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => zoom(1.19)}
                  aria-label={copy.zoomOut}
                  title={copy.zoomOut}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6d7b3]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={alternarTampa}
                  aria-pressed={tampaAberta}
                  className="min-h-9 rounded-lg bg-[#b9dfc2] px-3 text-[10px] font-bold text-[#103523] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4 sm:text-xs"
                >
                  {tampaAberta ? copy.lidOpen : copy.lidClose}
                </button>
                <button
                  type="button"
                  onClick={restaurar}
                  aria-label={copy.reset}
                  title={copy.reset}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6d7b3]"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}