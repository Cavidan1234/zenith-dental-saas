export const HERO_STICKER_STYLES = `
  /* Smooth entrance animations */
  @keyframes heroFadeUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes hero-marker-write {
    0% {
      stroke-dashoffset: var(--len, 2800px);
      opacity: 0.1;
    }
    10% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
  @keyframes sticker-slap-drop {
    0% {
      opacity: 0;
      transform: scale(2.2) rotate(24deg) translateY(-30%);
      filter: blur(2px);
    }
    55% {
      opacity: 1;
      transform: scale(0.92) rotate(-3deg);
      filter: none;
    }
    80% {
      transform: scale(1.05) rotate(1deg);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
  /* FLOW BUTTON: Mesmerizing animated fluid gradient shine */
  @keyframes flowGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes flowGlow {
    0%, 100% {
      box-shadow: 0 0 28px -3px rgba(147, 197, 253, 0.65), 0 12px 28px -5px rgba(15, 23, 42, 0.45);
    }
    50% {
      box-shadow: 0 0 45px 3px rgba(96, 165, 250, 0.9), 0 18px 34px -5px rgba(30, 58, 138, 0.55);
    }
  }
  /* LIQUID METAL RING: Real-time White & Electric Blue Molten Fluid Ring */
  @keyframes liquidMetalSpin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes liquidMetalGlow {
    0%, 100% {
      box-shadow: 0 0 24px -2px rgba(56, 189, 248, 0.75), 0 0 45px 2px rgba(37, 99, 235, 0.45), 0 0 14px rgba(255, 255, 255, 0.85);
    }
    50% {
      box-shadow: 0 0 38px 2px rgba(56, 189, 248, 0.95), 0 0 70px 6px rgba(37, 99, 235, 0.65), 0 0 22px rgba(255, 255, 255, 1);
    }
  }
  .liquid-metal-frame {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3.5px;
    border-radius: 9999px;
    overflow: hidden;
    animation: liquidMetalGlow 3s ease-in-out infinite;
    transform: translateZ(0);
  }
  .liquid-metal-frame::before {
    content: '';
    position: absolute;
    top: -200%;
    left: -200%;
    width: 500%;
    height: 500%;
    background: conic-gradient(
      from 0deg,
      #ffffff 0deg,
      #38bdf8 30deg,
      #ffffff 65deg,
      #1d4ed8 105deg,
      #67e8f9 145deg,
      #ffffff 180deg,
      #2563eb 215deg,
      #e0f2fe 250deg,
      #ffffff 285deg,
      #0284c7 325deg,
      #ffffff 360deg
    );
    animation: liquidMetalSpin 3.8s linear infinite;
    z-index: 1;
  }
  .liquid-metal-frame:hover::before {
    animation: liquidMetalSpin 1.8s linear infinite;
  }
  .liquid-metal-frame:hover {
    animation: liquidMetalGlow 1.5s ease-in-out infinite;
  }

  .flow-button {
    position: relative;
    z-index: 2;
    background: linear-gradient(115deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #bae6fd 75%, #ffffff 100%);
    background-size: 260% 260%;
    animation: flowGradient 4s ease infinite;
  }
  .flow-button:hover {
    animation: flowGradient 2s ease infinite;
  }

  /* UIVERSE.IO EXPANDING CIRCLE BUTTON (cssbuttons-io) - WHITE THEME */
  .learn-more {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
    width: 14.5rem;
    height: 3.375rem;
  }

  .learn-more .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 3.375rem;
    height: 3.375rem;
    background: #ffffff;
    border-radius: 1.6875rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.4);
  }

  .learn-more .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #1e3a8a;
  }

  .learn-more .circle .icon.arrow {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    left: 0.95rem;
    width: 1.125rem;
    height: 0.125rem;
    background: none;
  }

  .learn-more .circle .icon.arrow::before {
    position: absolute;
    content: "";
    top: -0.29rem;
    right: 0.0625rem;
    width: 0.625rem;
    height: 0.625rem;
    border-top: 0.125rem solid #1e3a8a;
    border-right: 0.125rem solid #1e3a8a;
    transform: rotate(45deg);
  }

  .learn-more .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 2.2rem;
    color: #ffffff;
    font-weight: 800;
    font-size: 0.95rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;
    z-index: 2;
  }

  .learn-more:hover .circle {
    width: 100%;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 255, 255, 0.6);
  }

  .learn-more:hover .circle .icon.arrow {
    background: #1e3a8a;
    transform: translate(1rem, 0);
  }

  .learn-more:hover .button-text {
    color: #1e3a8a;
  }

  /* Ambient floating corner bubbles */
  @keyframes bubbleFloat1 {
    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(-16px) rotate(5deg) scale(1.04); }
  }
  @keyframes bubbleFloat2 {
    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(14px) rotate(-6deg) scale(0.97); }
  }
  .bubble-float-1 { animation: bubbleFloat1 7.5s ease-in-out infinite; }
  .bubble-float-2 { animation: bubbleFloat2 9s ease-in-out infinite; }
  .bubble-float-3 { animation: bubbleFloat1 6.5s ease-in-out infinite 1.2s; }

  /* Hand-drawn blue pencil underline animation */
  @keyframes pencilSketch {
    0% {
      stroke-dasharray: 260;
      stroke-dashoffset: 260;
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
  .pencil-draw-1 {
    stroke-dasharray: 260;
    stroke-dashoffset: 260;
    animation: pencilSketch 1.2s cubic-bezier(0.2, 0.8, 0.25, 1) 0.3s forwards;
  }
  .pencil-draw-2 {
    stroke-dasharray: 260;
    stroke-dashoffset: 260;
    animation: pencilSketch 1.1s cubic-bezier(0.2, 0.8, 0.25, 1) 0.55s forwards;
  }

  /* Continuous non-stop falling speed streaks */
  @keyframes continuousDrop1 {
    0% {
      stroke-dashoffset: 60;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes continuousDrop2 {
    0% {
      stroke-dashoffset: 70;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes continuousDrop3 {
    0% {
      stroke-dashoffset: 50;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  .continuous-drop-1 {
    stroke-dasharray: 30 30;
    animation: continuousDrop1 0.75s linear infinite;
  }
  .continuous-drop-2 {
    stroke-dasharray: 35 35;
    animation: continuousDrop2 0.65s linear infinite;
  }
  .continuous-drop-3 {
    stroke-dasharray: 25 25;
    animation: continuousDrop3 0.85s linear infinite;
  }

  .hero-script-draw {
    stroke-dasharray: var(--len, 2800px);
    stroke-dashoffset: var(--len, 2800px);
    animation: hero-marker-write 2.2s cubic-bezier(0.5, 0.1, 0.3, 1) 0.2s forwards;
  }
  .sticker-initial-slap {
    animation: sticker-slap-drop 0.75s cubic-bezier(0.3, 1.4, 0.4, 1) both;
  }
  .sticker-sheen {
    transform: translateX(-150%);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .group:hover .sticker-sheen {
    transform: translateX(150%);
  }
  /* KINETIC BLUR-TO-FOCUS TYPOGRAPHY & ELEMENT REVEAL */
  @keyframes blurSlideIn {
    0% {
      opacity: 0;
      filter: blur(14px);
      transform: translateY(22px) scale(0.97);
    }
    100% {
      opacity: 1;
      filter: blur(0px);
      transform: translateY(0) scale(1);
    }
  }
  .hero-blur-word-1 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both; }
  .hero-blur-word-2 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both; }
  .hero-blur-word-3 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both; }
  .hero-blur-word-4 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both; }
  .hero-blur-word-5 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.40s both; }
  .hero-blur-word-6 { animation: blurSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.48s both; }
  .hero-blur-sub { animation: blurSlideIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.52s both; }
  .hero-blur-cta { animation: blurSlideIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both; }
`
