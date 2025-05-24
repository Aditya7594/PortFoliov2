import React, { useState, useEffect } from 'react';

const skills = [
  { name: 'Leadership & Fast Learning', level: 90, color: 'from-blue-500 to-cyan-500' },
  { name: 'Coding', level: 85, color: 'from-green-500 to-emerald-500' },
  { name: 'Music', level: 80, color: 'from-purple-500 to-pink-500' },
  { name: 'Node.js', level: 75, color: 'from-yellow-500 to-orange-500' },
  { name: 'Database', level: 85, color: 'from-red-500 to-rose-500' },
  { name: 'UI/UX', level: 70, color: 'from-indigo-500 to-purple-500' }
];

const achievements = [
  { number: '3+', label: 'Projects Completed', icon: '🚀' },
  { number: '10', label: 'GitHub Repositories', icon: '📦' },
  { number: '1', label: 'Profile Badge: Quickdraw', icon: '🏅' },
  { number: '100%', label: 'Dedication', icon: '💪' }
];

const interests = [
  { name: 'Mobile Development', icon: '📱', description: 'Creating intuitive mobile experiences' },
  { name: 'Artificial Intelligence', icon: '🤖', description: 'Exploring AI and machine learning' },
  { name: 'Web Technologies', icon: '🌐', description: 'Building modern web applications' },
  { name: 'Open Source', icon: '💻', description: 'Contributing to the community' }
];

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [profileHovered, setProfileHovered] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<Record<number, number>>({});

  useEffect(() => {
    achievements.forEach((achievement, index) => {
      const finalNumber = parseInt(achievement.number);
      if (!isNaN(finalNumber)) {
        let current = 0;
        const increment = finalNumber / 60; // 60 frames for 1 second
        const timer = setInterval(() => {
          current += increment;
          if (current >= finalNumber) {
            current = finalNumber;
            clearInterval(timer);
          }
          setAnimatedNumbers(prev => ({
            ...prev,
            [index]: Math.floor(current)
          }));
        }, 16); // 60fps
      }
    });
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👨‍💻' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'interests', label: 'Interests', icon: '💡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Passionate developer crafting digital experiences with code and creativity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setProfileHovered(true)}
              onMouseLeave={() => setProfileHovered(false)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 rounded-3xl p-8 text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-500 ${profileHovered ? 'scale-110 rotate-12' : 'scale-100'}`}></div>
                  <img 
                    src="/profile.jpg"
                    alt="Aditya Nayak"
                    className={`relative z-10 w-44 h-44 rounded-full object-cover mx-auto mt-2 transition-transform duration-500 ${profileHovered ? 'scale-105' : 'scale-100'}`}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-800 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Aditya Nayak</h3>
                <p className="text-purple-400 mb-4">Full Stack Developer</p>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span>Available for opportunities</span>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index: number) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-purple-500/50 transition-colors duration-300">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {typeof animatedNumbers[index] !== 'undefined' ? animatedNumbers[index] : achievement.number}
                    {achievement.number.includes('+') && '+'}
                    {achievement.number.includes('%') && '%'}
                  </div>
                  <div className="text-gray-400 text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>🎯</span> My Journey
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      I'm a passionate BCA student with a deep love for technology and innovation. 
                      My journey in software development started with curiosity and has evolved into 
                      a commitment to creating meaningful digital experiences.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      I believe in the power of clean code, user-centered design, and continuous learning. 
                      Every project I work on is an opportunity to push boundaries and solve real-world problems 
                      through technology.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>💡</span> Philosophy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Quality First</h4>
                          <p className="text-gray-400 text-sm">Writing clean, maintainable code that stands the test of time</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">User-Centric</h4>
                          <p className="text-gray-400 text-sm">Designing experiences that delight and solve real problems</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Innovation</h4>
                          <p className="text-gray-400 text-sm">Embracing new technologies and creative solutions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="text-white font-semibold mb-1">Growth</h4>
                          <p className="text-gray-400 text-sm">Continuous learning and improvement in every aspect</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>🛠️</span> Technical Skills
                    </h3>
                    <div className="space-y-6">
                      {skills.map((skill, index: number) => (
                        <div 
                          key={skill.name}
                          className="group cursor-pointer"
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{skill.name}</span>
                            <span className="text-gray-400 text-sm">
                              {hoveredSkill === skill.name ? `${skill.level}%` : skill.level + '%'}
                            </span>
                          </div>
                          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out ${
                                hoveredSkill === skill.name ? 'scale-105 shadow-lg' : ''
                              }`}
                              style={{ 
                                width: `${skill.level}%`,
                                animationDelay: `${index * 0.1}s`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interests.map((interest, index: number) => (
                      <div 
                        key={interest.name}
                        className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {interest.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{interest.name}</h4>
                        <p className="text-gray-400">{interest.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default About;