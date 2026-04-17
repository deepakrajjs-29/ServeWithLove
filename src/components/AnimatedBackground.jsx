import { useEffect, useRef } from 'react';

export default function AnimatedBackground({ variant = 'default' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 400 + 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    // 3D rotating geometric shapes
    const shapes = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 0.008,
      vRotY: (Math.random() - 0.5) * 0.008,
      vRotZ: (Math.random() - 0.5) * 0.008,
      size: Math.random() * 40 + 20,
      type: ['cube', 'triangle', 'diamond'][i % 3],
      alpha: Math.random() * 0.08 + 0.03,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let time = 0;

    const project3D = (x, y, z) => {
      const fov = 500;
      const scale = fov / (fov + z);
      return {
        px: x * scale + width / 2,
        py: y * scale + height / 2,
        scale,
      };
    };

    const drawCube = (ctx, shape) => {
      const s = shape.size;
      const verts = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
      ];

      const cosX = Math.cos(shape.rotX), sinX = Math.sin(shape.rotX);
      const cosY = Math.cos(shape.rotY), sinY = Math.sin(shape.rotY);
      const cosZ = Math.cos(shape.rotZ), sinZ = Math.sin(shape.rotZ);

      const rotated = verts.map(([x, y, z]) => {
        let nx = x * cosZ - y * sinZ;
        let ny = x * sinZ + y * cosZ;
        let nz = z;
        let tx = nx * cosY + nz * sinY;
        nz = -nx * sinY + nz * cosY;
        nx = tx;
        let ty = ny * cosX - nz * sinX;
        nz = ny * sinX + nz * cosX;
        ny = ty;
        return [nx + (shape.x - width / 2), ny + (shape.y - height / 2), nz + 300];
      });

      const projected = rotated.map(([x, y, z]) => project3D(x, y, z));

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7],
      ];

      ctx.strokeStyle = `rgba(229, 57, 53, ${shape.alpha})`;
      ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].px, projected[a].py);
        ctx.lineTo(projected[b].px, projected[b].py);
        ctx.stroke();
      });
    };

    const drawDiamond = (ctx, shape) => {
      const s = shape.size;
      const cosZ = Math.cos(shape.rotZ), sinZ = Math.sin(shape.rotZ);

      const pts = [
        [0, -s * 1.5],
        [s, 0],
        [0, s * 1.5],
        [-s, 0],
      ].map(([x, y]) => {
        return [
          x * cosZ - y * sinZ + shape.x,
          x * sinZ + y * cosZ + shape.y,
        ];
      });

      ctx.strokeStyle = `rgba(229, 57, 53, ${shape.alpha * 1.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    };

    const drawTriangle = (ctx, shape) => {
      const s = shape.size * 1.2;
      const cosZ = Math.cos(shape.rotZ), sinZ = Math.sin(shape.rotZ);

      const pts = [
        [0, -s],
        [s * 0.866, s * 0.5],
        [-s * 0.866, s * 0.5],
      ].map(([x, y]) => {
        return [
          x * cosZ - y * sinZ + shape.x,
          x * sinZ + y * cosZ + shape.y,
        ];
      });

      ctx.strokeStyle = `rgba(229, 57, 53, ${shape.alpha * 1.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      // Animated gradient background blobs
      const blobs = [
        { x: width * 0.2 + Math.sin(time * 0.4) * 80, y: height * 0.3 + Math.cos(time * 0.3) * 60, r: 350, color: 'rgba(229,57,53,0.06)' },
        { x: width * 0.8 + Math.cos(time * 0.5) * 100, y: height * 0.7 + Math.sin(time * 0.4) * 80, r: 300, color: 'rgba(255,111,96,0.05)' },
        { x: width * 0.5 + Math.sin(time * 0.3) * 60, y: height * 0.5 + Math.cos(time * 0.6) * 50, r: 200, color: 'rgba(171,0,13,0.04)' },
      ];

      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      });

      // Draw 3D shapes
      shapes.forEach(shape => {
        shape.rotX += shape.vRotX;
        shape.rotY += shape.vRotY;
        shape.rotZ += shape.vRotZ;
        shape.x += shape.vx;
        shape.y += shape.vy;
        if (shape.x < 0 || shape.x > width) shape.vx *= -1;
        if (shape.y < 0 || shape.y > height) shape.vy *= -1;

        if (shape.type === 'cube') drawCube(ctx, shape);
        else if (shape.type === 'diamond') drawDiamond(ctx, shape);
        else drawTriangle(ctx, shape);
      });

      // Draw floating particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < 50) p.z = 500;
        if (p.z > 500) p.z = 50;

        const proj = project3D(p.x - width / 2, p.y - height / 2, p.z);
        const size = p.size * proj.scale;

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 57, 53, ${p.alpha * proj.scale})`;
        ctx.fill();
      });

      // Connector lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = project3D(particles[i].x - width / 2, particles[i].y - height / 2, particles[i].z);
          const pj = project3D(particles[j].x - width / 2, particles[j].y - height / 2, particles[j].z);
          const dist = Math.hypot(pi.px - pj.px, pi.py - pj.py);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(229, 57, 53, ${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pi.px, pi.py);
            ctx.lineTo(pj.px, pj.py);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
