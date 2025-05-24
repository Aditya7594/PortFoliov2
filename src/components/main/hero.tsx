import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [currentRole, setCurrentRole] = useState(0);
  // --- Card top-spin animation state ---
  const [isSpinning, setIsSpinning] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  type Particle = {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  };
  const particlesRef = useRef<Particle[]>([]);

  const roles = [
    'Full Stack Developer',
    'Mobile App Developer', 
    'AI/ML Enthusiast',
    'Problem Solver',
    'Tech Innovator'
  ];

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect (improved, non-blocking, smooth)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const role = roles[currentRole];
    let isDeleting = false;
    let localIndex = 0;
    function type() {
      if (!isDeleting && localIndex < role.length) {
        setTypedText(role.substring(0, localIndex + 1));
        localIndex++;
        timeoutId = setTimeout(type, 60); // Faster typing
      } else if (!isDeleting && localIndex === role.length) {
        isDeleting = true;
        timeoutId = setTimeout(type, 1200); // Shorter pause before deleting
      } else if (isDeleting && localIndex > 0) {
        setTypedText(role.substring(0, localIndex - 1));
        localIndex--;
        timeoutId = setTimeout(type, 30); // Faster deleting
      } else if (isDeleting && localIndex === 0) {
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    }
    type();
    return () => clearTimeout(timeoutId);
  }, [currentRole]);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Always set canvas size to window size before using
    function setCanvasSize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 100; i++) {
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

    const animateParticles = () => {
      // Defensive: check canvas size is valid
      if (!isFinite(canvas.width) || !isFinite(canvas.height) || canvas.width === 0 || canvas.height === 0) {
        setCanvasSize();
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle: Particle, index: number) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
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

      requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // After spinning animation completes, flip the card and stop spinning
    setTimeout(() => {
      setShowBack(!showBack);
      setIsSpinning(false);
    }, 1500); // 1.5s spin duration
  };

  const glowText = (text: string) => (
    <span className="inline-block">
      {text.split('').map((char: string, i: number) => (
        <span
          key={i}
          className="glow-text"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

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

      <div className="relative z-10 container mx-auto px-8 h-screen flex items-center">
        <div className="flex flex-col lg:flex-row gap-16 items-center w-full">
          {/* Left Column - Text Content */}
          <div className="flex-1 space-y-8 w-full lg:w-1/2">
            <div className="space-y-6">
              <div className="text-cyan-400 text-lg font-medium tracking-wider uppercase">
                Welcome to my digital world
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <div className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                  {glowText("Hi, I'm")}
                </div>
                <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {glowText("Aditya Nayak")}
                </div>
              </h1>

              <div className="text-2xl md:text-3xl font-semibold text-gray-300 h-12 flex items-center">
                <span className="text-purple-400">I'm a </span>
                <span className="ml-2 text-white border-r-2 border-purple-400 pr-1 animate-pulse">
                  {typedText}
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                Passionate about creating innovative digital solutions that make a difference. 
                I transform ideas into reality through clean code, thoughtful design, and cutting-edge technology.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                onClick={() => {
                  const el = document.querySelector('#projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
                onClick={() => {
                  window.location.href = '#contact';
                }}
              >
                Contact Me
              </button>
            </div>

            <div className="flex gap-8 text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">3+</div>
                <div className="text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10</div>
                <div className="text-sm">GitHub Repos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm">Badge</div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Card */}
          <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-1/2">
            <div className="relative group">
              {/* Spinning Top Card */}
              <div
                className="relative w-80 h-96 perspective-1000 cursor-pointer"
                onClick={handleCardClick}
              >
                <div
                  className={`relative w-full h-full preserve-3d transition-transform duration-500${
                    isSpinning ? ' top-spin' : ''
                  }${showBack ? ' flipped' : ''}`}
                  style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: showBack ? 'rotateY(180deg)' : 'none' }}
                >
                  {/* Front of Card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6 flex items-center justify-center">
                          <img 
                            src="/profile.jpg"
                            alt="Aditya Nayak"
                            className="w-28 h-28 rounded-full object-cover"
                            style={{ boxShadow: '0 4px 24px 0 rgba(80, 70, 229, 0.25)' }}
                          />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">Aditya Nayak</h3>
                        <p className="text-purple-400 mb-4">BCA Student</p>
                        
                        <div className="space-y-3 w-full">
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
                        
                        <div className="mt-6 flex gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm">Available for work</span>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500 opacity-60">
                          Click to flip
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col justify-center items-center text-center">
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur opacity-30"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-6">Contact Details</h3>
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Age</span>
                            <span className="text-white">19</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">DOB</span>
                            <span className="text-white">23-07-2004</span>
                          </div>
                          <div className="flex flex-col items-center text-sm mb-3">
                            <span className="text-gray-400 mb-1">Email</span>
                            <span className="text-white text-xs">Adityanayak7594@gmail.com</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">GitHub</span>
                            <a href="https://github.com/Aditya7594" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                              @Aditya7594
                            </a>
                          </div>
                          <div className="flex flex-col items-center text-sm">
                            <span className="text-gray-400 mb-1">LinkedIn</span>
                            <a 
                              href="https://linkedin.com/in/aditya-nayak-5a549b341/" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 transition-colors text-xs"
                            >
                              aditya-nayak-5a549b341
                            </a>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-xs text-gray-500 opacity-60">
                          Click to flip back
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;