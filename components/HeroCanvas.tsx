"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Signature du site : une piste d'approche en particules. Des rangées de
 * feux convergent vers l'horizon, une onde lumineuse les parcourt comme
 * une rampe d'approche séquencée, et la caméra suit la souris.
 * Three.js est chargé dynamiquement ici, jamais dans le bundle initial.
 */
export default function HeroCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let dispose = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled) return;
      const reduced = prefersReducedMotion();
      const isLight = () => document.documentElement.getAttribute("data-theme") === "light";

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(el.clientWidth, el.clientHeight);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 400);
      camera.position.set(0, 2.2, 14);

      // Grille de feux : 14 rangées de large, 120 de profondeur, plus un balisage latéral.
      const cols = 14, rows = 120, spacing = 1.4;
      const count = cols * rows;
      const pos = new Float32Array(count * 3);
      const seed = new Float32Array(count);
      const edge = new Float32Array(count);
      let i = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        pos[i * 3] = (c - (cols - 1) / 2) * spacing;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = -r * spacing * 1.6;
        seed[i] = Math.random();
        edge[i] = c === 0 || c === cols - 1 ? 1 : 0;
        i++;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
      geo.setAttribute("edge", new THREE.BufferAttribute(edge, 1));

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColor: { value: new THREE.Color("#ffa028") },
          uWhite: { value: new THREE.Color("#ece8e1") },
          uDpr: { value: renderer.getPixelRatio() },
          uDark: { value: isLight() ? 0.0 : 1.0 },
        },
        vertexShader: /* glsl */`
          attribute float seed; attribute float edge;
          uniform float uTime; uniform vec2 uMouse; uniform float uDpr;
          varying float vAlpha; varying float vEdge;
          void main() {
            vec3 p = position;
            // Ondulation douce du "sol" + onde d'approche séquencée qui remonte vers la caméra
            p.y += sin(p.z * 0.15 + uTime * 0.6) * 0.25 + sin(p.x * 0.5 + uTime) * 0.08;
            p.x += uMouse.x * 1.2 * (1.0 - smoothstep(0.0, -120.0, p.z));
            float wave = fract(uTime * 0.35 + p.z * 0.012);
            float pulse = smoothstep(0.0, 0.08, wave) * (1.0 - smoothstep(0.08, 0.22, wave));
            float depth = clamp(1.0 + p.z / 140.0, 0.0, 1.0);
            vAlpha = (0.18 + pulse * 0.9 + edge * 0.35) * depth * (0.6 + 0.4 * seed);
            vEdge = edge;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.0 + pulse * 6.0 + edge * 2.5) * uDpr * (18.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */`
          uniform vec3 uColor; uniform vec3 uWhite; uniform float uDark;
          varying float vAlpha; varying float vEdge;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.1, d) * vAlpha;
            vec3 col = mix(uColor, uWhite, vEdge * 0.5);
            // En light mode on sature et on assombrit : additive sur fond clair ne se voit pas.
            col = mix(col * 0.75, col, uDark);
            gl_FragColor = vec4(col, a * mix(1.6, 1.0, uDark));
          }`,
      });
      const points = new THREE.Points(geo, mat);
      points.rotation.x = 0.02;
      scene.add(points);

      // Horizon : ligne d'axe de piste, en pointillés via un LineDashedMaterial.
      const axisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.02, 5), new THREE.Vector3(0, 0.02, -200)]);
      const axis = new THREE.Line(axisGeo, new THREE.LineDashedMaterial({ color: 0xffa028, dashSize: 1.5, gapSize: 2, transparent: true, opacity: 0.5 }));
      axis.computeLineDistances();
      scene.add(axis);

      const mouse = new THREE.Vector2();
      const target = new THREE.Vector2();
      const onMove = (e: PointerEvent) => {
        target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);

      const themeObs = new MutationObserver(() => { mat.uniforms.uDark.value = isLight() ? 0 : 1; });
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
      io.observe(el);

      const clock = new THREE.Clock();
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        mouse.lerp(target, 0.05);
        mat.uniforms.uTime.value = clock.getElapsedTime();
        mat.uniforms.uMouse.value.copy(mouse);
        camera.position.x = mouse.x * 1.5;
        camera.position.y = 2.2 + mouse.y * 0.6;
        camera.lookAt(0, 0.5, -40);
        renderer.render(scene, camera);
      };
      if (reduced) { renderer.render(scene, camera); } else { frame(); }

      dispose = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        themeObs.disconnect(); io.disconnect();
        geo.dispose(); mat.dispose(); axisGeo.dispose(); renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    })();

    return () => { cancelled = true; dispose(); };
  }, []);

  return <div ref={host} className="absolute inset-0" aria-hidden />;
}
