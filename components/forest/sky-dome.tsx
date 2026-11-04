'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BackSide, Color, Group, ShaderMaterial, Vector3 } from 'three'
import { atmosphere } from '@/lib/atmosphere-state'

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uNight;
  varying vec3 vDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = clamp(d.y, 0.0, 1.0);
    vec3 col = mix(uBottom, uTop, pow(h, 0.55));

    float s = max(dot(d, normalize(uSunDir)), 0.0);
    float glow = pow(s, 6.0) * 0.35 + pow(s, 48.0) * 0.9;
    col += uSunColor * glow * (1.0 - uNight);

    vec3 cell = d * 110.0;
    vec3 id = floor(cell);
    vec3 f = fract(cell) - 0.5;
    float star = step(0.992, hash(id)) * smoothstep(0.18, 0.0, length(f)) * smoothstep(0.05, 0.4, d.y);
    col += vec3(0.85, 0.9, 1.0) * star * uNight * 1.6;

    gl_FragColor = vec4(col, 1.0);
  }
`

export function SkyDome() {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new Color() },
          uBottom: { value: new Color() },
          uSunDir: { value: new Vector3() },
          uSunColor: { value: new Color() },
          uNight: { value: 0 },
        },
      }),
    [],
  )

  useFrame(() => {
    group.current?.position.copy(camera.position)
    const u = material.uniforms
    u.uTop.value.copy(atmosphere.top)
    u.uBottom.value.copy(atmosphere.fog)
    u.uSunDir.value.copy(atmosphere.sunDir)
    u.uSunColor.value.copy(atmosphere.sunColor)
    u.uNight.value = atmosphere.night
  })

  return (
    <group ref={group}>
      <mesh renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[200, 32, 16]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
