'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const skills = [
  { name: 'Leadership & Fast Learning', level: 90, color: 'from-blue-500 to-cyan-500' },
  { name: 'Coding', level: 85, color: 'from-green-500 to-emerald-500' },
  { name: 'Music', level: 80, color: 'from-purple-500 to-pink-500' },
  { name: 'Node.js', level: 75, color: 'from-yellow-500 to-orange-500' },
  { name: 'Database', level: 85, color: 'from-red-500 to-rose-500' },
  { name: 'UI/UX', level: 70, color: 'from-indigo-500 to-purple-500' }
];

const INITIAL_ACHIEVEMENTS = [
  { number: '10+', label: 'Projects Completed', icon: '🚀' },
  { number: '0', label: 'GitHub Repositories', icon: '📦' },
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

  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [githubStats, setGithubStats] = useState({ stars: 0, forks: 0, languages: [] as { name: string, count: number, percentage: number }[] });

  useEffect(() => {
    // Fetch live GitHub stats
    const fetchGitHubData = async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/Aditya7594'),
          fetch('https://api.github.com/users/Aditya7594/repos?per_page=100')
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setAchievements(prev => {
            const newAchievements = [...prev];
            newAchievements[1] = { ...newAchievements[1], number: profileData.public_repos?.toString() || '0' };
            return newAchievements;
          });
        }

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          let totalStars = 0;
          let totalForks = 0;
          const langCounts: Record<string, number> = {};

          reposData.forEach((repo: any) => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
            }
          });

          // Calculate top languages
          const totalReposWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0);
          const topLanguages = Object.entries(langCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count]) => ({
              name,
              count,
              percentage: Math.round((count / totalReposWithLang) * 100)
            }));

          setGithubStats({ stars: totalStars, forks: totalForks, languages: topLanguages });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      }
    };

    fetchGitHubData();
  }, []);

  useEffect(() => {
    achievements.forEach((achievement, index) => {
      const finalNumber = parseInt(achievement.number);
      if (!isNaN(finalNumber) && finalNumber > 0) {
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
        return () => clearInterval(timer);
      } else {
        setAnimatedNumbers(prev => ({
          ...prev,
          [index]: finalNumber || 0
        }));
      }
    });
  }, [achievements]);

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

      <div className="relative z-10 container mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-300 text-base sm:text-xl max-w-3xl mx-auto">
            Passionate developer crafting digital experiences with code and creativity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 max-w-7xl mx-auto">

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
                  <Image
                    src="/PortFoliov2/profile.jpg"
                    alt="Aditya Nayak"
                    width={176}
                    height={176}
                    className={`relative z-10 w-44 h-44 rounded-full object-cover mx-auto mt-2 transition-transform duration-500 ${profileHovered ? 'scale-105' : 'scale-100'}`}
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-800 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Aditya Nayak</h3>
                <p className="text-purple-400 mb-4">Full Stack Developer</p>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Available for opportunities</span>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {achievements.map((achievement, i) => (
                <div key={achievement.label} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/10 hover:border-purple-500/50 transition-colors duration-300">
                  <div className="text-2xl sm:text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {typeof animatedNumbers[i] !== 'undefined' ? animatedNumbers[i] : achievement.number}
                    {achievement.number.includes('+') && '+'}
                    {achievement.number.includes('%') && '%'}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>

            {/* GitHub Badges / Stats (Native) */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-colors duration-300">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                  GitHub Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{githubStats.stars}</div>
                    <div className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-500" /> Stars
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">{githubStats.forks}</div>
                    <div className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      Forks
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-colors duration-300">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Top Languages
                </h4>
                <div className="space-y-4">
                  {githubStats.languages.map((lang, idx) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{lang.name}</span>
                        <span className="text-gray-400">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {githubStats.languages.length === 0 && (
                    <div className="text-gray-500 text-sm italic text-center py-2">Loading languages...</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabbed Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-6 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${activeTab === tab.id
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
                      I&apos;m a passionate BCA student with a deep love for technology and innovation.
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
                              className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out ${hoveredSkill === skill.name ? 'scale-105 shadow-lg' : ''
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
                    {interests.map((interest) => (
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