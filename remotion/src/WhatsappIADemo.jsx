import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const incomingBg = 'rgba(255,255,255,0.06)';
const outgoingBg = 'rgba(138, 43, 226, 0.2)';

const chatBackground = {
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at 14% 18%, rgba(138,43,226,0.33), transparent 42%), radial-gradient(circle at 82% 76%, rgba(122,31,212,0.22), transparent 40%), #080808',
};

const phoneFrame = {
  width: 620,
  height: 910,
  borderRadius: 36,
  border: '1px solid rgba(138,43,226,0.45)',
  background: 'linear-gradient(180deg, rgba(20,20,20,0.94) 0%, rgba(11,11,11,0.98) 100%)',
  boxShadow: '0 34px 95px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.08)',
  overflow: 'hidden',
  position: 'relative',
};

const topBar = {
  height: 94,
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  background: 'linear-gradient(180deg, rgba(14,14,14,0.95) 0%, rgba(10,10,10,0.95) 100%)',
};

const avatar = {
  width: 46,
  height: 46,
  borderRadius: '50%',
  background:
    'radial-gradient(circle at 30% 28%, #f6e3ff 0%, #d6a5ff 35%, #8a2be2 100%)',
  display: 'grid',
  placeItems: 'center',
  color: '#1b052f',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontWeight: 700,
  fontSize: 18,
};

const MessageBubble = ({
  frame,
  startFrame,
  align,
  text,
  subtitle,
  accent,
}) => {
  const {fps} = useVideoConfig();
  const inProgress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 220,
      stiffness: 260,
      mass: 0.7,
    },
  });

  if (frame < startFrame - 5) {
    return null;
  }

  const opacity = interpolate(inProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(inProgress, [0, 1], [26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(inProgress, [0, 1], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        marginBottom: 14,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          maxWidth: 410,
          borderRadius: 18,
          padding: '13px 16px',
          border: accent
            ? '1px solid rgba(138,43,226,0.45)'
            : '1px solid rgba(255,255,255,0.05)',
          background: align === 'right' ? outgoingBg : incomingBg,
          color: '#f7f7f7',
          boxShadow: '0 9px 24px rgba(0,0,0,0.28)',
        }}
      >
        <div
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 24,
            lineHeight: 1.36,
            letterSpacing: -0.1,
          }}
        >
          {text}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 8,
              fontSize: 18,
              color: 'rgba(245,245,245,0.7)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const TypingBubble = ({frame, startFrame, endFrame}) => {
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const dot = (offset) => {
    const cycle = (frame - startFrame + offset) % 20;
    const opacity = interpolate(cycle, [0, 10, 19], [0.28, 1, 0.28], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <span
        key={offset}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          opacity,
          display: 'inline-block',
        }}
      />
    );
  };

  return (
    <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: 14}}>
      <div
        style={{
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.08)',
          background: incomingBg,
          padding: '14px 16px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {[0, 6, 12].map((offset) => dot(offset))}
      </div>
    </div>
  );
};

const FloatingBlob = ({frame, size, x, y, phase, alpha}) => {
  const translateY = Math.sin((frame + phase) / 16) * 10;
  const translateX = Math.cos((frame + phase) / 30) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: x,
        top: y,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, rgba(176,107,232,${alpha}), rgba(138,43,226,0.03))`,
        filter: 'blur(2px)',
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    />
  );
};

export const WhatsappIADemo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterPhone = spring({
    frame,
    fps,
    config: {
      damping: 210,
      stiffness: 190,
      mass: 1,
    },
  });

  const phoneOpacity = interpolate(enterPhone, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phoneScale = interpolate(enterPhone, [0, 1], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phoneY = interpolate(enterPhone, [0, 1], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pulse = interpolate(
    Math.sin(frame / 22),
    [-1, 1],
    [0.84, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <AbsoluteFill style={{fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#fff'}}>
      <div style={chatBackground} />

      <FloatingBlob frame={frame} size={180} x={70} y={140} phase={0} alpha={0.22} />
      <FloatingBlob frame={frame} size={120} x={920} y={220} phase={50} alpha={0.2} />
      <FloatingBlob frame={frame} size={96} x={160} y={860} phase={120} alpha={0.17} />
      <FloatingBlob frame={frame} size={140} x={840} y={760} phase={180} alpha={0.19} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            ...phoneFrame,
            opacity: phoneOpacity,
            transform: `translateY(${phoneY}px) scale(${phoneScale})`,
          }}
        >
          <div style={topBar}>
            <div style={avatar}>AI</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 28,
                  color: '#ffffff',
                  letterSpacing: -0.2,
                }}
              >
                Agente IA LOGOS
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: `rgba(200,255,220,${pulse})`,
                }}
              >
                online agora
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: '94px 0 0 0',
              padding: '20px 22px',
              overflow: 'hidden',
            }}
          >
            <MessageBubble
              frame={frame}
              startFrame={26}
              align="right"
              text="Oi! Vi seu anuncio e queria saber como voces podem me ajudar a vender mais."
              subtitle="Lead entrou pelo WhatsApp"
            />

            <TypingBubble frame={frame} startFrame={84} endFrame={112} />

            <MessageBubble
              frame={frame}
              startFrame={114}
              align="left"
              text="Oii, como posso te ajudar hoje? 😊"
              subtitle="Sou a IA da LOGOS e ja posso te orientar agora."
              accent
            />

            <MessageBubble
              frame={frame}
              startFrame={166}
              align="left"
              text="Me conta: seu foco hoje e ter mais leads, mais vendas ou automatizar o atendimento?"
            />

            <MessageBubble
              frame={frame}
              startFrame={220}
              align="right"
              text="Automatizar o atendimento e qualificar melhor os leads."
            />

            <MessageBubble
              frame={frame}
              startFrame={252}
              align="left"
              text="Perfeito! Ja vou montar um fluxo para seu cenario e te conecto com o time agora."
              accent
            />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 42,
        }}
      >
        <div
          style={{
            borderRadius: 999,
            border: '1px solid rgba(138,43,226,0.45)',
            background: 'rgba(8,8,8,0.72)',
            padding: '10px 18px',
            fontSize: 20,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: 0.2,
          }}
        >
          Simulacao visual de atendimento IA no WhatsApp
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
