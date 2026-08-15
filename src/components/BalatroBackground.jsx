import React, { useEffect, useRef } from 'react';

// Biome Color Palettes (Normalized RGB for GLSL)
const BIOME_PALETTES = {
  BIOME_NORTHERN_LIGHTS: [ // 🌌 Kuzey Işıkları & Gece Karanlığı (Ana Menü & Splash Screen)
    [0.05, 0.04, 0.22], // Deep Night Void
    [0.05, 0.75, 0.52], // Northern Lights Emerald
    [0.58, 0.18, 0.88], // Celestial Violet
    [0.96, 0.75, 0.18]  // Starlight Gold Ember
  ],
  BIOME_FROZEN: [ // ❄️ Buzul Krallığı (Deep Ice Navy, Glacier Blue, Electric Cyan, Frost White)
    [0.02, 0.08, 0.18],
    [0.03, 0.35, 0.58],
    [0.08, 0.72, 0.95],
    [0.85, 0.95, 1.00]
  ],
  BIOME_FOREST: [ // 🌲 Zümrüt Ormanı (Vivid Emerald Green, Forest Jade, Lime Glow, Golden Leaf)
    [0.01, 0.16, 0.09], // Deep Jungle Green
    [0.04, 0.65, 0.35], // Vivid Emerald
    [0.18, 0.88, 0.55], // Bright Jade Lime
    [0.95, 0.75, 0.18]  // Starlight Golden Leaf
  ],
  BIOME_VOLCANO: [ // 🌋 Alevli Vadi (Obsidian Lava, Crimson Flame, Magma Orange, Gold Ember)
    [0.15, 0.03, 0.03],
    [0.62, 0.08, 0.08],
    [0.95, 0.38, 0.05],
    [0.98, 0.82, 0.15]
  ],
  BIOME_SHADOW: [ // 🎭 Mor Gölge Bölgesi (Deep Void, Royal Purple, Neon Violet, Phantom Pink)
    [0.08, 0.02, 0.18],
    [0.35, 0.08, 0.55],
    [0.68, 0.22, 0.95],
    [0.95, 0.45, 0.75]
  ],
  BIOME_COSMIC: [ // 🌟 Kozmik Zirve (Deep Space, Royal Violet, Starlight Gold, Celestial Amber)
    [0.08, 0.05, 0.22],
    [0.42, 0.12, 0.68],
    [0.85, 0.48, 0.08],
    [0.98, 0.82, 0.18]
  ],
  BIOME_FINAL: [ // 👑 Kadim Mahzen (Obsidian Red Void, Crimson Flame, Gold Ember, Ruby Flare)
    [0.08, 0.02, 0.02],
    [0.68, 0.08, 0.08],
    [0.88, 0.65, 0.08],
    [0.98, 0.15, 0.15]
  ]
};

const STAGE_BIOMES = ['BIOME_FROZEN', 'BIOME_FOREST', 'BIOME_VOLCANO', 'BIOME_SHADOW', 'BIOME_COSMIC', 'BIOME_FINAL'];

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform int u_biome_type; // 0: Northern Lights, 1: Frozen, 2: Forest, 3: Volcano, 4: Shadow, 5: Cosmic
  varying vec2 v_uv;

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.15;
    
    vec2 pos = st * 3.2;
    float waveVal = 0.0;

    if (u_biome_type == 0) {
      // 🌌 NORTHERN LIGHTS (Ana Menü & Splash Screen - Kuzey Işıkları)
      vec2 npos = vec2(st.x * 0.8 + st.y * 0.5, st.y * 0.8 - st.x * 0.5);
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        npos.x += 0.4 / fi * sin(fi * npos.y * 2.2 + t + fi * 0.8);
        npos.y += 0.4 / fi * cos(fi * npos.x * 2.2 + t * 0.8 + fi * 0.8);
      }
      waveVal = (sin(npos.x * 2.0 + npos.y * 1.5 + t) + cos(npos.y * 2.5 - npos.x * 1.2 + t * 0.7) + 2.0) * 0.25;
    }
    else if (u_biome_type == 1) {
      // ❄️ FROZEN: Crystalline diagonal frost drifts
      vec2 fpos = vec2(st.x + st.y * 0.6, st.y - st.x * 0.6) * 3.5;
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        fpos += vec2(0.5 / fi * sin(fi * fpos.y * 2.4 + t + fi), 0.5 / fi * cos(fi * fpos.x * 2.4 + t * 0.8));
      }
      waveVal = (sin(fpos.x * 2.0 + t) + cos(fpos.y * 2.0 - t) + 2.0) * 0.25;
    } 
    else if (u_biome_type == 2) {
      // 🌲 FOREST: Organic flowing vine canopy & foliage waves
      vec2 fpos = pos;
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        fpos += vec2(0.6 / fi * sin(fi * fpos.y * 1.8 + t * 1.2 + fi * 0.5), 0.6 / fi * cos(fi * fpos.x * 1.8 + t * 0.9));
      }
      waveVal = (sin(fpos.x * 1.5 + fpos.y * 1.5 + t) + 1.0) * 0.5;
    } 
    else if (u_biome_type == 3) {
      // 🌋 VOLCANO: Rising heat haze & swirling magma surges
      vec2 vpos = vec2(st.x * 3.0, (st.y - t * 0.4) * 3.0);
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        vpos += vec2(0.5 / fi * sin(fi * vpos.y + t * 1.5), 0.5 / fi * cos(fi * vpos.x + t * 1.2));
      }
      waveVal = (sin(vpos.x * 2.2 + vpos.y * 2.2) + 1.0) * 0.5;
    } 
    else if (u_biome_type == 4) {
      // 🎭 SHADOW: Mirrored phantom mist & swirling void veil
      float dist = length(st);
      float angle = atan(st.y, st.x);
      float swirl = angle + dist * 3.0 - t * 0.5;
      vec2 spos = vec2(cos(swirl), sin(swirl)) * dist * 4.0;
      waveVal = (sin(spos.x * 2.0 + t) * cos(spos.y * 2.0 - t) + 1.0) * 0.5;
    } 
    else if (u_biome_type == 5) {
      // 🌟 COSMIC: Orbiting starlight nebula pulses
      vec2 cpos = st * 3.5;
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        cpos += vec2(0.4 / fi * sin(fi * cpos.y + t + fi * 0.8), 0.4 / fi * cos(fi * cpos.x + t * 0.8));
      }
      waveVal = (sin(cpos.x * 2.0 + cpos.y * 1.5 + t) + 1.0) * 0.5;
    }
    else {
      // 👑 FINAL BOSS: Obsidian heat haze & pulse surge
      vec2 p = st * 3.5;
      for(int i = 1; i < 4; i++) {
        float fi = float(i);
        p += vec2(0.5 / fi * sin(fi * p.y * 2.8 + t * 1.5), 0.5 / fi * cos(fi * p.x * 2.8 + t * 1.2));
      }
      waveVal = (sin(p.x * 2.5 + p.y * 2.5 + t * 1.5) + cos(p.x * 3.0 - t) + 2.0) * 0.25;
    }

    waveVal = clamp(waveVal, 0.0, 1.0);

    // Multi-color palette interpolation
    vec3 col;
    if (waveVal < 0.33) {
      col = mix(u_c1, u_c2, smoothstep(0.0, 0.33, waveVal));
    } else if (waveVal < 0.66) {
      col = mix(u_c2, u_c3, smoothstep(0.33, 0.66, waveVal));
    } else {
      col = mix(u_c3, u_c4, smoothstep(0.66, 1.0, waveVal));
    }

    // Vignette
    float dist = length(st);
    col *= smoothstep(1.8, 0.35, dist);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function BalatroBackground({ activeBiome, stage = 1, showCrtOverlay = true }) {
  const canvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Determine Biome Key
  let biomeKey = 'BIOME_NORTHERN_LIGHTS';
  if (activeBiome?.id && BIOME_PALETTES[activeBiome.id]) {
    biomeKey = activeBiome.id;
  } else if (stage) {
    const idx = Math.min(STAGE_BIOMES.length - 1, Math.max(0, (stage || 1) - 1));
    biomeKey = STAGE_BIOMES[idx];
  }

  // 1. WebGL Shader Render Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { preserveDrawingBuffer: false, alpha: false });
    let animationFrameId;
    let isFallback2D = false;

    if (!gl) isFallback2D = true;

    const pal = BIOME_PALETTES[biomeKey] || BIOME_PALETTES.BIOME_NORTHERN_LIGHTS;
    const biomeTypeIndex = Object.keys(BIOME_PALETTES).indexOf(biomeKey);

    let program, positionBuffer;
    let uResolutionLoc, uTimeLoc, uC1Loc, uC2Loc, uC3Loc, uC4Loc, uBiomeTypeLoc;
    let startTime = performance.now();

    if (!isFallback2D) {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, VERTEX_SHADER_SRC);
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) isFallback2D = true;

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, FRAGMENT_SHADER_SRC);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) isFallback2D = true;

      if (!isFallback2D) {
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          isFallback2D = true;
        } else {
          gl.useProgram(program);
          const aPosition = gl.getAttribLocation(program, 'a_position');
          uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
          uTimeLoc = gl.getUniformLocation(program, 'u_time');
          uC1Loc = gl.getUniformLocation(program, 'u_c1');
          uC2Loc = gl.getUniformLocation(program, 'u_c2');
          uC3Loc = gl.getUniformLocation(program, 'u_c3');
          uC4Loc = gl.getUniformLocation(program, 'u_c4');
          uBiomeTypeLoc = gl.getUniformLocation(program, 'u_biome_type');

          positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  1, -1, -1,  1,
            -1,  1,  1, -1,  1,  1,
          ]), gl.STATIC_DRAW);

          gl.enableVertexAttribArray(aPosition);
          gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        }
      }
    }

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (gl && !isFallback2D) gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (now) => {
      const timeSec = (now - startTime) * 0.001;

      if (!isFallback2D && gl && program) {
        gl.useProgram(program);
        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
        gl.uniform1f(uTimeLoc, timeSec);

        gl.uniform3fv(uC1Loc, pal[0]);
        gl.uniform3fv(uC2Loc, pal[1]);
        gl.uniform3fv(uC3Loc, pal[2]);
        gl.uniform3fv(uC4Loc, pal[3]);
        gl.uniform1i(uBiomeTypeLoc, biomeTypeIndex >= 0 ? biomeTypeIndex : 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#050a14';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (gl && positionBuffer) gl.deleteBuffer(positionBuffer);
    };
  }, [biomeKey]);

  // 2. Biome-Specific Particle Overlay
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particleAnimationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const numParticles = 35;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 1.5 + Math.random() * 3.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: biomeKey === 'BIOME_VOLCANO' ? -(0.5 + Math.random() * 1.2) : (0.4 + Math.random() * 1.0),
        alpha: 0.2 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03
      });
    }
    particlesRef.current = particles;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x > w + 10) p.x = -10;
        if (p.x < -10) p.x = w + 10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (biomeKey === 'BIOME_FROZEN') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (biomeKey === 'BIOME_FOREST') {
          ctx.fillStyle = '#6ee7b7';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.7, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        } else if (biomeKey === 'BIOME_VOLCANO') {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (biomeKey === 'BIOME_SHADOW') {
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (biomeKey === 'BIOME_FINAL') {
          // 👑 Final Boss Fiery Crimson Embers
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 🌌 Northern Lights / Cosmic Twinkling Stardust
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.4, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.4, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      particleAnimationId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(particleAnimationId);
    };
  }, [biomeKey]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
      {showCrtOverlay && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 2px'
          }}
        />
      )}
    </div>
  );
}
