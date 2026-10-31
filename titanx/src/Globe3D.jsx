import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { landMaskB64 } from './landMask.js'

// 360x180 1-bit land mask, LSB-first, row 0 = north pole
const mask = Uint8Array.from(atob(landMaskB64), (c) => c.charCodeAt(0))
const isLand = (lat, lon) => {
  const x = Math.min(359, Math.max(0, Math.floor(lon + 180))), y = Math.min(179, Math.max(0, Math.floor(90 - lat)))
  const i = y * 360 + x
  return (mask[i >> 3] >> (i & 7)) & 1
}

export default function Globe3D() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    cam.position.z = 10
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const dpr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(dpr)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
    el.appendChild(renderer.domElement)

    const R = 3.0
    const globe = new THREE.Group(); scene.add(globe)

    // dots laid out in latitude rings (like a dotted-earth map)
    const pos = [], land = []
    const rows = 90
    for (let r = 0; r <= rows; r++) {
      const lat = -90 + (r / rows) * 180, phi = (lat * Math.PI) / 180, ring = Math.cos(phi)
      const n = Math.max(1, Math.round(ring * 200))
      for (let k = 0; k < n; k++) {
        const lon = (k / n) * 360 - 180, th = (lon * Math.PI) / 180
        pos.push(Math.sin(th) * ring * R, Math.sin(phi) * R, Math.cos(th) * ring * R)
        land.push(isLand(lat, lon))
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aLand', new THREE.Float32BufferAttribute(land, 1))
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uPx: { value: dpr } },
      vertexShader: `
        attribute float aLand; uniform float uPx; varying float vA; varying vec3 vC;
        void main(){
          vec3 n = normalize(normalMatrix * position);
          float rim = pow(1.0 - abs(n.z), 2.2);
          float front = step(0.0, n.z);
          vec3 ocean = vec3(0.05,0.17,0.42), ground = vec3(0.13,0.42,0.95), edge = vec3(0.13,0.83,0.93);
          vec3 base = mix(ocean, ground, aLand);
          vC = mix(base, edge, rim);
          float a = mix(0.07, 0.30, aLand);
          a = a * (0.5 + 0.5 * n.z) + rim * mix(0.35, 0.95, aLand);
          vA = a * mix(0.28, 1.0, front);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = uPx * (mix(1.1, 1.9, aLand) + rim * 1.6) * (11.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vA; varying vec3 vC;
        void main(){ float d = length(gl_PointCoord - 0.5); if(d > 0.5) discard; gl_FragColor = vec4(vC, vA * smoothstep(0.5, 0.15, d)); }`,
    })
    globe.add(new THREE.Points(geo, mat))

    // soft dark core + atmosphere glow
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 48), new THREE.MeshBasicMaterial({ color: 0x050e2a })))
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 64, 64), new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 n; void main(){ float i = pow(0.62 - dot(n, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(0.13,0.75,0.95,1.0) * i * 0.9; }',
    })))
    globe.rotation.z = 0.2; globe.rotation.x = 0.35; globe.rotation.y = -1.9

    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(el)
    const mouse = { x: 0, y: 0 }
    const move = (e) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5 }
    window.addEventListener('pointermove', move)
    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      globe.rotation.y += 0.0022
      scene.rotation.y += (mouse.x * 0.5 - scene.rotation.y) * 0.04
      scene.rotation.x += (mouse.y * 0.3 - scene.rotation.x) * 0.04
      renderer.render(scene, cam)
    }
    loop()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', move); renderer.dispose(); el.removeChild(renderer.domElement) }
  }, [])
  return <div ref={ref} className="h-full w-full" aria-hidden="true" />
}
