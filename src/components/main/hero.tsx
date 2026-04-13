'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const [currentRole, setCurrentRole] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const roles = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer',
    'AI/ML Enthusiast',
    'Problem Solver',
    'Tech Innovator'
  ], []);

  type Particle = {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  };
  const particlesRef = useRef<Particle[]>([]);

  // Typewriter effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const role = roles[currentRole];
    let isDeleting = false;
    let localIndex = 0;
    function type() {
      if (!isDeleting && localIndex < role.length) {
        setTypedText(role.substring(0, localIndex + 1));
        localIndex++;
        timeoutId = setTimeout(type, 60);
      } else if (!isDeleting && localIndex === role.length) {
        isDeleting = true;
        timeoutId = setTimeout(type, 1200);
      } else if (isDeleting && localIndex > 0) {
        setTypedText(role.substring(0, localIndex - 1));
        localIndex--;
        timeoutId = setTimeout(type, 30);
      } else if (isDeleting && localIndex === 0) {
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    }
    type();
    return () => clearTimeout(timeoutId);
  }, [currentRole, roles]);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function setCanvasSize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    let animFrameId: number;
    const animateParticles = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((particle: Particle, index: number) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();
        particlesRef.current.slice(index + 1).forEach((otherParticle: Particle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
      animFrameId = requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const handleCardClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsFlipped(prev => !prev);
      setIsAnimating(false);
    }, 300);
  };

  const glowText = (text: string) => (
    <span className="inline-block">
      {text.split('').map((char: string, i: number) => (
        <span key={i} className="glow-text" style={{ animationDelay: `${i * 0.07}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* 3D Box Loader Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="loader">
          <div className="box box0"><div></div></div>
          <div className="box box1"><div></div></div>
          <div className="box box2"><div></div></div>
          <div className="box box3"><div></div></div>
          <div className="box box4"><div></div></div>
          <div className="box box5"><div></div></div>
          <div className="box box6"><div></div></div>
          <div className="box box7"><div></div></div>
          <div className="ground"><div></div></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-8 min-h-screen flex items-center py-24 sm:py-0">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center w-full">

          {/* Left Column - Text Content */}
          <div className="flex-1 space-y-6 sm:space-y-8 w-full text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-cyan-400 text-sm sm:text-lg font-medium tracking-wider uppercase">
                Welcome to my digital world
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
                <div className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                  {glowText("Hi, I'm")}
                </div>
                <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {glowText("Aditya Nayak")}
                </div>
              </h1>

              <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-300 h-10 sm:h-12 flex items-center justify-center lg:justify-start">
                <span className="text-purple-400">I&apos;m a </span>
                <span className="ml-2 text-white border-r-2 border-purple-400 pr-1 animate-pulse">
                  {typedText}
                </span>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Passionate about creating innovative digital solutions that make a difference.
                I transform ideas into reality through clean code, thoughtful design, and cutting-edge technology.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
              <button
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                onClick={() => {
                  const el = document.querySelector('#projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-500 text-purple-400 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
                onClick={() => {
                  const el = document.querySelector('#contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Contact Me
              </button>
            </div>

            <div className="flex gap-6 sm:gap-8 text-gray-400 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">3+</div>
                <div className="text-xs sm:text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">10</div>
                <div className="text-xs sm:text-sm">GitHub Repos</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">1</div>
                <div className="text-xs sm:text-sm">Badge</div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Flip Card */}
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <div
              className="hero-card-scene cursor-pointer select-none"
              onClick={handleCardClick}
              title="Click to flip"
            >
              <div className={`hero-card-inner${isFlipped ? ' hero-card-flipped' : ''}${isAnimating ? ' hero-card-animating' : ''}`}>
                {/* Front */}
                <div className="hero-card-face hero-card-front">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6 flex items-center justify-center">
                      <Image
                        src="/PortFoliov2/profile.jpg"
                        alt="Aditya Nayak"
                        width={112}
                        height={112}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                        style={{ boxShadow: '0 4px 24px 0 rgba(80,70,229,0.25)' }}
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Aditya Nayak</h3>
                    <p className="text-purple-400 mb-4">Full Stack Developer</p>
                    <div className="space-y-3 w-full px-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Location</span>
                        <span className="text-white">India</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Experience</span>
                        <span className="text-white">2+ Years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Focus</span>
                        <span className="text-white">Full Stack</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Available for work</span>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">Click to flip</div>
                  </div>
                </div>

                {/* Back */}
                <div className="hero-card-face hero-card-back">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-30 pointer-events-none"></div>
                  <div className="relative z-10 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Contact Details</h3>
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Age</span>
                        <span className="text-white">21</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">DOB</span>
                        <span className="text-white">23-07-2004</span>
                      </div>
                      <div className="flex flex-col text-sm gap-1">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white text-xs break-all">Adityanayak7594@gmail.com</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">GitHub</span>
                        <a href="https://github.com/Aditya7594" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors" onClick={e => e.stopPropagation()}>
                          @Aditya7594
                        </a>
                      </div>
                      <div className="flex flex-col text-sm gap-1">
                        <span className="text-gray-400">LinkedIn</span>
                        <a
                          href="https://linkedin.com/in/aditya-nayak-5a549b341/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          aditya-nayak-5a549b341
                        </a>
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-gray-500">Click to flip back</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .hero-card-scene {
          width: 300px;
          height: 380px;
          perspective: 1000px;
          -webkit-perspective: 1000px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 640px) {
          .hero-card-scene {
            width: 320px;
            height: 400px;
          }
        }
        .hero-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
          will-change: transform;
        }
        .hero-card-inner.hero-card-flipped {
          transform: rotateY(180deg);
        }
        .hero-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
        }
        .hero-card-back {
          transform: rotateY(180deg) translateZ(1px);
          -webkit-transform: rotateY(180deg) translateZ(1px);
        }
      `}</style>
    </section>
  );
};

export default Hero;

