import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./IntroductionBg.module.css";

type Props = { isPlaying?: boolean };

export default function IntroductionBg({ isPlaying = false }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);


  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);


  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x00000a, 1);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 80;

    // ── Shaders ──────────────────────────────────────────────────────────────
    const vertShader = `
      attribute float size;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color; vAlpha = alpha;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }`;
    const fragShader = `
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float a = smoothstep(0.5, 0.05, d) * vAlpha;
        gl_FragColor = vec4(vColor, a);
      }`;
    const makePointsMat = () => new THREE.ShaderMaterial({
      vertexShader: vertShader, fragmentShader: fragShader,
      vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });

    // ── Background star field ─────────────────────────────────────────────────
    const N   = 1200;
    const bgPos   = new Float32Array(N * 3);
    const bgVel   = new Float32Array(N * 3);
    const bgCol   = new Float32Array(N * 3);
    const bgSz    = new Float32Array(N);
    const bgPh    = new Float32Array(N);
    const bgAlpha = new Float32Array(N);
    const pal: [number,number,number][] = [
      [1.0,1.0,1.0],[0.9,0.95,1.0],[0.85,0.92,1.0],
      [1.0,0.98,0.92],[0.75,0.88,1.0],[0.95,0.95,1.0],[0.7,0.82,1.0],
    ];
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(),0.4)*90;
      const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      bgPos[i*3]   = r*Math.sin(ph)*Math.cos(th);
      bgPos[i*3+1] = r*Math.sin(ph)*Math.sin(th)*0.55;
      bgPos[i*3+2] = r*Math.cos(ph)*0.4;
      const spd=0.002+Math.random()*0.004, a=Math.random()*Math.PI*2, b=Math.random()*Math.PI*2;
      bgVel[i*3]=spd*Math.cos(a)*Math.sin(b); bgVel[i*3+1]=spd*Math.sin(a)*Math.sin(b)*0.5; bgVel[i*3+2]=spd*Math.cos(b)*0.3;
      const c=pal[Math.floor(Math.random()*pal.length)], br=0.6+Math.random()*0.4;
      bgCol[i*3]=c[0]*br; bgCol[i*3+1]=c[1]*br; bgCol[i*3+2]=c[2]*br;
      bgSz[i]=1.5+Math.random()*4.5; bgPh[i]=Math.random()*Math.PI*2; bgAlpha[i]=1.0;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos,  3));
    bgGeo.setAttribute("color",    new THREE.BufferAttribute(bgCol,  3));
    bgGeo.setAttribute("size",     new THREE.BufferAttribute(bgSz,   1));
    bgGeo.setAttribute("alpha",    new THREE.BufferAttribute(bgAlpha,1));
    const bgParticles = new THREE.Points(bgGeo, makePointsMat());
    scene.add(bgParticles);

    // ── Scroll ────────────────────────────────────────────────────────────────
    const scroll = { progress:0, target:0 };
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.target = max>0 ? window.scrollY/max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive:true });

    const CAM_Z_START = 80, CAM_Z_END = -20;

    // ── Mouse ─────────────────────────────────────────────────────────────────
    const mouse = { x:0, y:0 };
    const onMouseMove = (e:MouseEvent) => {
      mouse.x =  (e.clientX/window.innerWidth  - 0.5)*2;
      mouse.y = -(e.clientY/window.innerHeight - 0.5)*2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation ─────────────────────────────────────────────────────────────
    let animId: number, t = 0;
    const pos3 = bgGeo.attributes.position.array as Float32Array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const speed = isPlayingRef.current ? 1.6 : 1.0;
      t += 0.002 * speed;

      scroll.progress += (scroll.target - scroll.progress) * 0.06;
      const p = scroll.progress;

      // ── Background stars ──
      for (let i=0;i<N;i++) {
        pos3[i*3]  +=(bgVel[i*3]  +Math.sin(t*0.15+bgPh[i])*0.003)*speed;
        pos3[i*3+1]+=(bgVel[i*3+1]+Math.cos(t*0.12+bgPh[i])*0.002)*speed;
        pos3[i*3+2]+=bgVel[i*3+2]*speed;
        const x=pos3[i*3],y=pos3[i*3+1],z=pos3[i*3+2];
        if (Math.sqrt(x*x+y*y+z*z)>95) {
          const s2=0.006+Math.random()*0.01, a2=Math.random()*Math.PI*2, b2=Math.random()*Math.PI*2;
          bgVel[i*3]=s2*Math.cos(a2)*Math.sin(b2); bgVel[i*3+1]=s2*Math.sin(a2)*Math.sin(b2)*0.5; bgVel[i*3+2]=s2*Math.cos(b2)*0.3;
          const nr=Math.pow(Math.random(),0.4)*90, nt=Math.random()*Math.PI*2, np=Math.acos(2*Math.random()-1);
          pos3[i*3]=nr*Math.sin(np)*Math.cos(nt); pos3[i*3+1]=nr*Math.sin(np)*Math.sin(np)*0.55; pos3[i*3+2]=nr*Math.cos(np)*0.4;
        }
      }
      bgGeo.attributes.position.needsUpdate = true;
      bgParticles.rotation.y += (0.0003+mouse.x*0.0001)*speed;
      bgParticles.rotation.x += (0.0001+mouse.y*0.0001)*speed;

      // ── Camera dive ──
      const tz = CAM_Z_START + (CAM_Z_END-CAM_Z_START)*p;
      camera.position.z += (tz-camera.position.z)*0.08;
      const ps = 1-p*0.7;
      camera.position.x += (mouse.x*3*ps-camera.position.x)*0.02;
      camera.position.y += (mouse.y*5*ps-camera.position.y)*0.03;
      camera.lookAt(0, -1.5, camera.position.z - 30);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth/mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("resize",    onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose(); bgGeo.dispose();
    };
  }, []);

  return (
    <>
      <div
      ref={mountRef}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}
    />
    <div className={styles.scrollHint}>
      <span>scroll down</span>
      <i className={styles.arrow} />
    </div>
    </>
  );
}