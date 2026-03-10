'use client';
import React, { useEffect, useRef, useState } from 'react';

const timelineItems = [
    {
        year: "2022–2025",
        title: 'BCA Student',
        company: 'Bachelor of Computer Applications',
        description: 'Started my formal journey into computer science. Learned programming fundamentals, data structures, algorithms, and began building real-world projects.',
        color: 'from-cyan-500 to-blue-500',
        tags: ['C', 'Java', 'Python', 'HTML/CSS', 'SQL'],
        side: 'left',
    },
    {
        year: "May 2025",
        title: 'Desktop Support Engineer',
        company: 'Concentrix',
        description: 'Worked as a Desktop Support Engineer at Concentrix, providing IT support, system troubleshooting, hardware/software management, and ensuring smooth operations for enterprise clients.',
        color: 'from-purple-500 to-pink-500',
        tags: ['Windows OS', 'Networking', 'IT Support', 'Troubleshooting', 'ITIL'],
        side: 'right',
    },
    {
        year: "July 2025–Present",
        title: 'Full Stack Developer',
        company: 'Independent / Freelance',
        description: 'Levelled up to Full Stack Development, building web apps, mobile applications, and AI-integrated systems. Working with modern frameworks and delivering complete end-to-end solutions.',
        color: 'from-pink-500 to-orange-500',
        tags: ['React', 'Next.js', 'Node.js', 'Kotlin', 'Android', 'MongoDB', 'AWS'],
        side: 'left',
    },
];

const TimelineNode = ({ item, index }: { item: typeof timelineItems[0]; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const isLeft = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`relative mb-8 sm:mb-12 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Desktop: alternating left/right layout */}
            <div className="hidden lg:flex w-full items-stretch relative">
                {/* Left content */}
                <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : ''}`}>
                    {isLeft && (
                        <TimelineCard item={item} align="right" />
                    )}
                </div>

                {/* Center dot */}
                <div className="w-2/12 flex flex-col items-center justify-center relative">
                    {/* Thick glowing connecting line */}
                    {index !== timelineItems.length - 1 && (
                        <div className={`absolute w-1 bg-gradient-to-b ${item.color} opacity-60 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] z-0`} style={{ top: 'calc(50% + 16px)', bottom: 'calc(-50% - 48px)', left: '50%', transform: 'translateX(-50%)' }}></div>
                    )}

                    {/* Glowing outer ring */}
                    <div className={`w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-2 ring-slate-700/50`}>
                        {/* Inner glowing dot */}
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_12px_rgba(255,255,255,0.7)] animate-pulse`}></div>
                    </div>
                </div>

                {/* Right content */}
                <div className={`w-5/12 ${!isLeft ? 'pl-8' : ''}`}>
                    {!isLeft && (
                        <TimelineCard item={item} align="left" />
                    )}
                </div>
            </div>

            {/* Mobile: single column layout */}
            <div className="flex lg:hidden w-full items-stretch gap-5 relative">
                {/* Mobile glowing line */}
                {index !== timelineItems.length - 1 && (
                    <div className={`absolute w-1 bg-gradient-to-b ${item.color} opacity-60 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] z-0`} style={{ top: '32px', bottom: '-32px', left: '10px' }}></div>
                )}

                {/* Mobile glowing dot */}
                <div className={`w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-slate-700/50 flex-shrink-0 mt-2`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.7)] animate-pulse`}></div>
                </div>

                <div className="flex-1 pb-2">
                    <TimelineCard item={item} align="left" />
                </div>
            </div>
        </div>
    );
};

const TimelineCard = ({ item, align }: { item: typeof timelineItems[0]; align: 'left' | 'right' }) => (
    <div className={`group bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2 mb-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{item.year}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.title}</h3>
        <p className="text-purple-400 text-sm font-medium mb-3">{item.company}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description}</p>
        <div className={`flex flex-wrap gap-1.5 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            {item.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

const Timeline = () => {
    const lineRef = useRef<HTMLDivElement>(null);
    const [lineHeight, setLineHeight] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLineHeight(100);
                }
            },
            { threshold: 0.1 }
        );
        if (lineRef.current) observer.observe(lineRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden py-16 sm:py-24">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-32 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-32 left-10 w-64 h-64 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-8">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-20">
                    <div className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-3">Career Journey</div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        My Timeline
                    </h2>
                    <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto">
                        From desktop engineering to full stack development — a journey of continuous growth and innovation.
                    </p>
                </div>

                {/* Animated vertical line (desktop) */}
                <div className="hidden lg:block relative" ref={lineRef}>
                    <div
                        className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 -translate-x-1/2 transition-all duration-[2000ms] ease-out origin-top"
                        style={{ height: `${lineHeight}%`, maxHeight: '100%' }}
                    ></div>
                </div>

                {/* Timeline items */}
                <div className="relative">
                    {timelineItems.map((item, index) => (
                        <TimelineNode key={item.year} item={item} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-8 sm:mt-12">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full border border-purple-400/30 text-gray-300">
                        <span className="text-green-400 animate-pulse">●</span>
                        <span className="text-sm sm:text-base">Currently building awesome things as a Full Stack Developer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
