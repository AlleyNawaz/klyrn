"use client";

/**
 * Lightweight CSS-only vault visual.
 * Replaces heavy Three.js/R3F scene that caused lag.
 * Uses CSS transforms, gradients, and keyframe animations only — zero JS per frame.
 */
export default function VaultScene() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: "800px" }}>
      {/* Central vault cube */}
      <div
        className="relative w-44 h-44"
        style={{
          animation: "vaultSpin 20s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(0,214,164,0.12), rgba(99,102,241,0.08))",
            border: "1px solid rgba(0,214,164,0.15)",
            backdropFilter: "blur(8px)",
            transform: "translateZ(88px)",
            boxShadow: "0 0 60px rgba(0,214,164,0.06), inset 0 0 40px rgba(0,214,164,0.03)",
          }}
        />
        {/* Back face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(0,214,164,0.04))",
            border: "1px solid rgba(255,255,255,0.05)",
            transform: "translateZ(-88px) rotateY(180deg)",
          }}
        />
        {/* Left face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(180deg, rgba(0,214,164,0.08), rgba(14,26,34,0.4))",
            border: "1px solid rgba(255,255,255,0.04)",
            transform: "rotateY(-90deg) translateZ(88px)",
            width: "176px",
          }}
        />
        {/* Right face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(180deg, rgba(99,102,241,0.06), rgba(14,26,34,0.4))",
            border: "1px solid rgba(255,255,255,0.04)",
            transform: "rotateY(90deg) translateZ(88px)",
            width: "176px",
          }}
        />
        {/* Top face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(0,214,164,0.15), rgba(99,102,241,0.08))",
            border: "1px solid rgba(0,214,164,0.12)",
            transform: "rotateX(90deg) translateZ(88px)",
            height: "176px",
          }}
        />
        {/* Bottom face */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "rgba(14,26,34,0.5)",
            border: "1px solid rgba(255,255,255,0.03)",
            transform: "rotateX(-90deg) translateZ(88px)",
            height: "176px",
          }}
        />
      </div>

      {/* Orbiting sphere 1 — mint */}
      <div
        className="absolute w-6 h-6 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #5BFFD0, #00D6A4)",
          boxShadow: "0 0 20px rgba(0,214,164,0.4)",
          animation: "orbit1 8s linear infinite",
          top: "50%",
          left: "50%",
        }}
      />

      {/* Orbiting sphere 2 — indigo */}
      <div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #818CF8, #6366F1)",
          boxShadow: "0 0 16px rgba(99,102,241,0.4)",
          animation: "orbit2 12s linear infinite",
          top: "50%",
          left: "50%",
        }}
      />

      {/* Orbiting sphere 3 — small mint */}
      <div
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #5BFFD0, #00D6A4)",
          boxShadow: "0 0 12px rgba(91,255,208,0.3)",
          animation: "orbit3 15s linear infinite reverse",
          top: "50%",
          left: "50%",
        }}
      />

      {/* Orbital ring 1 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "280px",
          height: "280px",
          border: "1px solid rgba(0,214,164,0.12)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotateX(60deg) rotateZ(20deg)",
          animation: "ringRotate 30s linear infinite",
        }}
      />

      {/* Orbital ring 2 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "320px",
          height: "320px",
          border: "1px solid rgba(99,102,241,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotateX(40deg) rotateZ(-30deg)",
          animation: "ringRotate 40s linear infinite reverse",
        }}
      />

      <style jsx>{`
        @keyframes vaultSpin {
          from { transform: rotateY(0deg) rotateX(-8deg); }
          to   { transform: rotateY(360deg) rotateX(-8deg); }
        }
        @keyframes orbit1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(140px) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: translate(-50%, -50%) rotate(120deg) translateX(170px) rotate(-120deg); }
          to   { transform: translate(-50%, -50%) rotate(480deg) translateX(170px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: translate(-50%, -50%) rotate(240deg) translateX(120px) rotate(-240deg); }
          to   { transform: translate(-50%, -50%) rotate(600deg) translateX(120px) rotate(-600deg); }
        }
        @keyframes ringRotate {
          from { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(0deg); }
          to   { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}
