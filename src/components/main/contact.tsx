'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formFocus, setFormFocus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Floating orbs data
  const orbsRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    speedX: number;
    speedY: number;
    speedZ: number;
    color: string;
    opacity: number;
    pulse: number;
  }>>([]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D floating orbs animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();

    // Initialize orbs
    const initOrbs = () => {
      orbsRef.current = [];
      const colors = [
        'rgba(59, 130, 246, 0.6)',   // blue
        'rgba(147, 51, 234, 0.6)',   // purple
        'rgba(236, 72, 153, 0.6)',   // pink
        'rgba(16, 185, 129, 0.6)',   // emerald
        'rgba(245, 158, 11, 0.6)',   // amber
      ];

      for (let i = 0; i < 25; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 100,
          size: Math.random() * 40 + 20,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          speedZ: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.7 + 0.3,
          pulse: Math.random() * Math.PI * 2
        });
      }
    };

    const animateOrbs = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbsRef.current.forEach((orb, index) => {
        // Update position
        orb.x += orb.speedX;
        orb.y += orb.speedY;
        orb.z += orb.speedZ;
        orb.pulse += 0.02;

        // Wrap around edges
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size;
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size;
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size;
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size;
        if (orb.z > 100) orb.z = 0;
        if (orb.z < 0) orb.z = 100;

        // Calculate 3D perspective with additional safeguards
        let perspective = 100 / (100 - orb.z);
        if (!isFinite(perspective) || perspective <= 0 || perspective > 10) perspective = 1;
        
        // Ensure size is always positive and finite
        let size = orb.size * perspective * (0.5 + Math.sin(orb.pulse) * 0.2);
        if (!isFinite(size) || size <= 0 || size > 1000) size = orb.size;
        
        // Ensure opacity is between 0 and 1
        let opacity = orb.opacity * perspective * 0.8;
        if (!isFinite(opacity) || opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        // Create gradient safely with additional checks
        if (
          isFinite(orb.x) && isFinite(orb.y) &&
          isFinite(size) && size > 0 && size < 1000 &&
          orb.x >= -size && orb.x <= canvas.width + size &&
          orb.y >= -size && orb.y <= canvas.height + size
        ) {
          try {
            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, size);
            gradient.addColorStop(0, orb.color.replace('0.6', `${opacity}`));
            gradient.addColorStop(0.7, orb.color.replace('0.6', `${opacity * 0.3}`));
            gradient.addColorStop(1, orb.color.replace('0.6', '0'));

            // Draw orb
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          } catch (error) {
            console.warn('Failed to create gradient:', error);
          }
        }

        // Add connections between nearby orbs
        orbsRef.current.slice(index + 1).forEach(otherOrb => {
          const dx = orb.x - otherOrb.x;
          const dy = orb.y - otherOrb.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(orb.x, orb.y);
            ctx.lineTo(otherOrb.x, otherOrb.y);
            const connectionOpacity = (1 - distance / 150) * 0.3;
            ctx.strokeStyle = `rgba(147, 51, 234, ${connectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animateOrbs);
    };

    initOrbs();
    animateOrbs();

    const handleResize = () => {
      resizeCanvas();
      initOrbs();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/movdzgqd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message
        alert('Message sent successfully! I will get back to you soon.');
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      // Show error message
      alert('Failed to send message. Please try again later.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Aditya7594', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Linkedin, href: 'https://linkedin.com/in/aditya-nayak-5a549b341/', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: MessageCircle, href: '#', label: 'Discord', color: 'hover:text-indigo-400' }
  ];

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      {/* 3D Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Dynamic mouse-following elements */}
        <div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.8}%`,
            top: `${mousePosition.y * 0.8}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-purple-500/15 rounded-full blur-2xl transition-all duration-700 ease-out"
          style={{
            left: `${100 - mousePosition.x * 0.6}%`,
            top: `${100 - mousePosition.y * 0.6}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-2 bg-purple-500/10 rounded-xl mb-6 backdrop-blur-sm border border-purple-500/20">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Let's Create Something
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Ready to bring your ideas to life? I'm here to help you build innovative solutions 
            that make a real impact. Let's start the conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Send className="w-6 h-6 text-purple-400" />
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6" action="https://formspree.io/f/movdzgqd" method="POST">
                <div className="relative">
                  <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFormFocus('name')}
                    onBlur={() => setFormFocus('')}
                    className={`w-full px-4 py-3 bg-slate-800/80 border rounded-xl focus:outline-none text-white transition-all duration-300 ${
                      formFocus === 'name' 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-slate-800' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    placeholder="Aditya"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFormFocus('email')}
                    onBlur={() => setFormFocus('')}
                    className={`w-full px-4 py-3 bg-slate-800/80 border rounded-xl focus:outline-none text-white transition-all duration-300 ${
                      formFocus === 'email' 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-slate-800' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    placeholder="my gmail"
                    required
                  />
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFormFocus('message')}
                    onBlur={() => setFormFocus('')}
                    rows={5}
                    className={`w-full px-4 py-3 bg-slate-800/80 border rounded-xl focus:outline-none text-white resize-none transition-all duration-300 ${
                      formFocus === 'message' 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-slate-800' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    placeholder="Tell me about your project or just say hello!"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white font-medium break-all">Adityanayak7594@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white font-medium">+91 XXX XXX XXXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Location</p>
                      <p className="text-white font-medium">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
                <p className="text-gray-400 mb-6">Follow me on social media for updates and insights</p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 ${social.color} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                      <social.icon className="w-6 h-6" />
                      <span className="font-medium">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Available for Work</h3>
                <p className="text-gray-400">Currently accepting new projects and collaborations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;