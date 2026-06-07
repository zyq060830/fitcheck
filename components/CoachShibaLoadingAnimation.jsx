import React from "react";

/**
 * Coach Shiba loading animation for FitCheck home/loading screens.
 *
 * Timeline:
 * - 0s-1s: Coach Shiba lifts the magnifier.
 * - 1s-2s: Coach Shiba looks left and right while scanning.
 * - 2s-3s: Loading copy appears.
 */
export default function CoachShibaLoadingAnimation({
  className = "",
  message = "正在分析最适合你的训练方案...",
  style,
  title = "柴教练正在分析训练方案",
  width = 360,
}) {
  const classes = ["coach-shiba-loading", className].filter(Boolean).join(" ");
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={classes}
      aria-label={title}
      role="img"
      style={{ display: "inline-flex", width: `min(100%, ${resolvedWidth})`, ...style }}
    >
      <svg
        width={width}
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <style>{`
          .coach-shiba-loading svg {
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
          }

          .csl-shadow {
            animation: csl-shadow 3s ease-in-out infinite;
            transform-origin: 180px 270px;
          }

          .csl-shiba {
            animation: csl-body-bob 3s ease-in-out infinite;
            transform-origin: 180px 188px;
          }

          .csl-head {
            animation: csl-look-around 3s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center bottom;
          }

          .csl-brow {
            animation: csl-brow-check 3s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }

          .csl-magnifier-arm {
            animation: csl-lift-magnifier 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
            transform-box: fill-box;
            transform-origin: 126px 212px;
          }

          .csl-magnifier {
            animation: csl-scan-wiggle 3s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: 80px 132px;
          }

          .csl-scan-ring,
          .csl-scan-line {
            animation: csl-scan-visible 3s ease-in-out infinite;
          }

          .csl-scan-ring {
            stroke-dasharray: 18 10;
            animation-name: csl-scan-visible, csl-scan-dash;
            animation-duration: 3s, 0.9s;
            animation-timing-function: ease-in-out, linear;
            animation-iteration-count: infinite, infinite;
          }

          .csl-sparkle {
            animation: csl-sparkle 3s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }

          .csl-message,
          .csl-message-pill {
            animation: csl-message-in 3s ease-in-out infinite;
          }

          .csl-dot {
            animation: csl-dot-pulse 3s ease-in-out infinite;
          }

          .csl-dot:nth-of-type(2) {
            animation-delay: 0.12s;
          }

          .csl-dot:nth-of-type(3) {
            animation-delay: 0.24s;
          }

          @keyframes csl-body-bob {
            0%, 100% { transform: translateY(0); }
            18% { transform: translateY(-5px); }
            34%, 66% { transform: translateY(-2px); }
            82% { transform: translateY(-3px); }
          }

          @keyframes csl-shadow {
            0%, 100% { transform: scaleX(1); opacity: 0.48; }
            18% { transform: scaleX(0.88); opacity: 0.34; }
            34%, 66% { transform: scaleX(0.95); opacity: 0.4; }
          }

          @keyframes csl-lift-magnifier {
            0%, 7% {
              transform: translate(28px, 46px) rotate(-34deg) scale(0.94);
              opacity: 0.9;
            }
            27%, 72% {
              transform: translate(0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(28px, 46px) rotate(-34deg) scale(0.94);
              opacity: 0.9;
            }
          }

          @keyframes csl-scan-wiggle {
            0%, 33%, 66%, 100% { transform: translateX(0) rotate(0deg); }
            42% { transform: translateX(-9px) rotate(-5deg); }
            54% { transform: translateX(10px) rotate(5deg); }
            62% { transform: translateX(-3px) rotate(-2deg); }
          }

          @keyframes csl-look-around {
            0%, 33%, 66%, 100% { transform: translateX(0) rotate(0deg); }
            42% { transform: translateX(-5px) rotate(-2.5deg); }
            54% { transform: translateX(6px) rotate(2.5deg); }
            62% { transform: translateX(-2px) rotate(-1deg); }
          }

          @keyframes csl-brow-check {
            0%, 34%, 66%, 100% { transform: translateY(0); }
            42%, 54% { transform: translateY(-2px); }
          }

          @keyframes csl-scan-visible {
            0%, 30%, 68%, 100% { opacity: 0; }
            36%, 63% { opacity: 1; }
          }

          @keyframes csl-scan-dash {
            to { stroke-dashoffset: -56; }
          }

          @keyframes csl-message-in {
            0%, 64%, 100% {
              opacity: 0;
              transform: translateY(10px);
            }
            72%, 94% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes csl-dot-pulse {
            0%, 64%, 100% { opacity: 0.25; transform: translateY(0); }
            74%, 92% { opacity: 1; transform: translateY(-2px); }
          }

          @keyframes csl-sparkle {
            0%, 18%, 36%, 64%, 100% {
              opacity: 0;
              transform: scale(0.6) rotate(0deg);
            }
            24%, 48%, 76% {
              opacity: 1;
              transform: scale(1) rotate(12deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .coach-shiba-loading * {
              animation-duration: 1ms !important;
              animation-iteration-count: 1 !important;
            }

            .csl-message,
            .csl-message-pill {
              opacity: 1;
              transform: none;
            }
          }
        `}</style>

        <rect width="360" height="360" rx="42" fill="#FFF8EF" />
        <circle cx="282" cy="68" r="34" fill="#F4A623" opacity="0.1" />
        <circle cx="79" cy="102" r="28" fill="#4EAD9D" opacity="0.08" />
        <ellipse className="csl-shadow" cx="179" cy="271" rx="92" ry="15" fill="#E9D9BD" />

        <g className="csl-sparkle">
          <path d="M72 83L77 94L88 99L77 104L72 115L67 104L56 99L67 94Z" fill="#F0A21A" />
          <path d="M287 113L291 121L299 125L291 129L287 137L283 129L275 125L283 121Z" fill="#F0A21A" />
          <path d="M267 217L271 225L279 229L271 233L267 241L263 233L255 229L263 225Z" fill="#4EAD9D" />
        </g>

        <g className="csl-shiba">
          <g>
            <path
              d="M133 207C115 220 106 240 108 264"
              stroke="#F4A623"
              strokeWidth="25"
              strokeLinecap="round"
            />
            <path
              d="M226 207C244 220 253 240 251 264"
              stroke="#F4A623"
              strokeWidth="25"
              strokeLinecap="round"
            />
            <path
              d="M140 211C125 224 119 242 120 260"
              stroke="#FFF3DE"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M219 211C234 224 240 242 239 260"
              stroke="#FFF3DE"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <rect x="129" y="199" width="101" height="74" rx="38" fill="#F4A623" />
            <ellipse cx="180" cy="225" rx="38" ry="49" fill="#FFF3DE" />
            <path d="M158 248L153 281" stroke="#F4A623" strokeWidth="21" strokeLinecap="round" />
            <path d="M202 248L207 281" stroke="#F4A623" strokeWidth="21" strokeLinecap="round" />
            <path d="M160 250L156 281" stroke="#FFF3DE" strokeWidth="9" strokeLinecap="round" />
            <path d="M200 250L204 281" stroke="#FFF3DE" strokeWidth="9" strokeLinecap="round" />
            <path d="M140 282H169" stroke="#2F2A25" strokeWidth="8" strokeLinecap="round" />
            <path d="M191 282H220" stroke="#2F2A25" strokeWidth="8" strokeLinecap="round" />
          </g>

          <g className="csl-head">
            <path d="M122 135L94 72L151 106L122 135Z" fill="#F4A623" />
            <path d="M238 135L266 72L209 106L238 135Z" fill="#F4A623" />
            <path d="M129 124L112 87L145 106L129 124Z" fill="#FFE7C0" />
            <path d="M231 124L248 87L215 106L231 124Z" fill="#FFE7C0" />
            <circle cx="180" cy="152" r="77" fill="#F4A623" />
            <ellipse cx="180" cy="180" rx="61" ry="55" fill="#FFF3DE" />
            <rect x="103" y="108" width="154" height="28" rx="14" fill="#4EAD9D" />
            <path
              d="M165 119L176 128L194 110"
              stroke="#FFFDF8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="csl-brow"
              d="M132 141C141 134 152 132 164 135"
              stroke="#2F2A25"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="csl-brow"
              d="M197 135C209 132 220 134 229 141"
              stroke="#2F2A25"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path d="M139 155C146 159 154 159 161 155" stroke="#2F2A25" strokeWidth="6" strokeLinecap="round" />
            <path d="M199 155C206 159 214 159 221 155" stroke="#2F2A25" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="180" cy="176" rx="13" ry="9" fill="#2F2A25" />
            <path d="M168 194C175 202 185 202 192 194" stroke="#2F2A25" strokeWidth="6" strokeLinecap="round" />
            <circle cx="145" cy="188" r="8" fill="#F7D8B4" opacity="0.8" />
            <circle cx="215" cy="188" r="8" fill="#F7D8B4" opacity="0.8" />
          </g>

          <g className="csl-magnifier-arm">
            <path
              d="M132 209C112 197 101 179 98 156"
              stroke="#F4A623"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M126 205C112 194 105 179 104 159"
              stroke="#FFF3DE"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <g className="csl-magnifier">
              <circle cx="98" cy="139" r="30" fill="#FFF8EF" stroke="#2F2A25" strokeWidth="9" />
              <circle cx="98" cy="139" r="19" fill="#FFFFFF" opacity="0.58" />
              <path d="M119 161L145 188" stroke="#2F2A25" strokeWidth="12" strokeLinecap="round" />
              <path d="M119 161L145 188" stroke="#4EAD9D" strokeWidth="5" strokeLinecap="round" />
              <path d="M85 129C91 122 101 120 109 123" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.82" />
              <circle className="csl-scan-ring" cx="98" cy="139" r="39" stroke="#4EAD9D" strokeWidth="4" />
              <path
                className="csl-scan-line"
                d="M69 139H127"
                stroke="#4EAD9D"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.72"
              />
            </g>
          </g>
        </g>

        <g className="csl-message-pill">
          <rect x="42" y="302" width="276" height="38" rx="19" fill="#FFFFFF" opacity="0.92" />
          <rect x="42" y="302" width="276" height="38" rx="19" stroke="#EAD9BD" />
        </g>
        <text
          className="csl-message"
          x="169"
          y="326"
          textAnchor="middle"
          fontFamily='"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
          fontSize="15"
          fontWeight="800"
          fill="#2F2A25"
        >
          {message}
        </text>
        <g transform="translate(291 321)" fill="#4EAD9D">
          <circle className="csl-dot" cx="0" cy="0" r="2.7" />
          <circle className="csl-dot" cx="8" cy="0" r="2.7" />
          <circle className="csl-dot" cx="16" cy="0" r="2.7" />
        </g>
      </svg>
    </div>
  );
}
