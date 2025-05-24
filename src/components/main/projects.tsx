import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const projects = [
	{
		title: 'Computer Lab Management System',
		description:
			'A comprehensive system for managing computer lab resources, bookings, and maintenance built with Visual Basic .NET. Features include user authentication, resource scheduling, maintenance tracking, and detailed reporting capabilities.',
		image: '/projects/computerlab.jpg',
		tags: ['Visual Basic .NET', 'SQL Server', 'Windows Forms'],
		languages: ['Visual Basic .NET', 'SQL', 'C#'],
		link: 'https://github.com/Aditya7594/computerlab-COMPLETED.git',
		stats: { stars: 12, forks: 5, watchers: 8 },
		features: [
			'User Management',
			'Resource Booking',
			'Maintenance Tracking',
			'Report Generation',
		],
		category: 'Desktop Application',
	},
	{
		title: 'Anime Soundboard',
		description:
			'An Android app featuring sound clips from popular anime series like One Piece and Bleach. Interactive interface with custom sound effects, favorites system, and sharing capabilities.',
		image: '/projects/Animesoundboard.png',
		tags: ['Java', 'Android', 'Media Player'],
		languages: ['Java', 'XML', 'Kotlin'],
		link: 'https://github.com/Aditya7594/Anime-Soundboard.git',
		stats: { stars: 28, forks: 12, watchers: 15 },
		features: [
			'Sound Library',
			'Favorites System',
			'Share Sounds',
			'Custom Playlists',
		],
		category: 'Mobile Application',
	},
	{
		title: 'AI Music Player',
		description:
			'An intelligent music player that uses AI to enhance the listening experience with smart recommendations, mood detection, and personalized playlists based on listening habits.',
		image: '/projects/aimusic.jpg',
		tags: ['Kotlin', 'Android', 'AI Integration'],
		languages: ['Kotlin', 'Python', 'TensorFlow'],
		link: 'https://github.com/Aditya7594/Ai-Music-Player.git',
		stats: { stars: 45, forks: 18, watchers: 32 },
		features: [
			'AI Recommendations',
			'Mood Detection',
			'Smart Playlists',
			'Voice Control',
		],
		category: 'AI Application',
	},
];

const Projects = () => {
	const [currentProject, setCurrentProject] = useState<number>(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [autoSlide, setAutoSlide] = useState(true);

	useEffect(() => {
		if (!autoSlide) return;

		const interval = setInterval(() => {
			setCurrentProject((prev) => (prev + 1) % projects.length);
			setIsFlipped(false);
		}, 5000);

		return () => clearInterval(interval);
	}, [autoSlide]);

	const handleProjectChange = (index: number) => {
		setCurrentProject(index);
		setIsFlipped(false);
		setAutoSlide(false);
	};

	const handleCardHover = () => {
		setIsFlipped(true);
		setAutoSlide(false);
	};

	const handleCardLeave = () => {
		setIsFlipped(false);
	};

	const project = projects[currentProject];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
			{/* Animated floating box background */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div
					className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float"
					style={{ left: '10%', top: '10%' }}
				></div>
				<div
					className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float-delayed"
					style={{ right: '10%', bottom: '15%' }}
				></div>
				<div
					className="absolute w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float-slow"
					style={{ left: '50%', top: '60%' }}
				></div>
			</div>

			<div className="relative z-10 container mx-auto px-8 py-16 h-screen flex flex-col">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
						Featured Projects
					</h2>
					<p className="text-gray-300 text-xl max-w-2xl mx-auto">
						Discover my latest work in software development and AI integration
					</p>
				</div>

				{/* Main Content */}
				<div className="flex-1 flex items-center justify-center">
					<div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Left Side - Project Card */}
						<div className="relative h-[600px] perspective-1000">
							<div
								className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${
									isFlipped ? 'rotate-y-180' : ''
								}`}
								onMouseEnter={handleCardHover}
								onMouseLeave={handleCardLeave}
							>
								{/* Front of Card - Project Image */}
								<div className="absolute inset-0 w-full h-full backface-hidden">
									<div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
										<Image
											src={project.image}
											alt={project.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											width={500}
											height={500}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
										<div className="absolute bottom-6 left-6 right-6">
											<div className="flex items-center gap-3 mb-4">
												<span className="px-3 py-1 bg-purple-600/80 text-white text-sm rounded-full">
													{project.category}
												</span>
												<div className="flex items-center gap-4 text-white/80">
													<span className="flex items-center gap-1">
														<svg
															className="w-4 h-4 text-yellow-400"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
														{project.stats.stars}
													</span>
													<span className="flex items-center gap-1">
														<svg
															className="w-4 h-4 text-blue-400"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 0z"
																clipRule="evenodd"
															/>
														</svg>
														{project.stats.forks}
													</span>
												</div>
											</div>
											<h3 className="text-2xl font-bold text-white mb-2">
												{project.title}
											</h3>
											<p className="text-white/60 text-sm">
												Hover to see languages used →
											</p>
										</div>
									</div>
								</div>

								{/* Back of Card - Languages */}
								<div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
									<div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 flex flex-col justify-center items-center shadow-2xl border border-white/10">
										<h3 className="text-3xl font-bold text-white mb-8 text-center">
											Technologies Used
										</h3>
										<div className="grid grid-cols-1 gap-6 w-full max-w-sm">
											{project.languages.map((lang, index) => (
												<div
													key={index}
													className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-white/10 transform hover:scale-105 transition-transform duration-300"
													style={{ animationDelay: `${index * 0.1}s` }}
												>
													<span className="text-white font-semibold text-lg">
														{lang}
													</span>
												</div>
											))}
										</div>
										<div className="mt-8 flex flex-wrap gap-2 justify-center">
											{project.tags.map((tag, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right Side - Project Details */}
						<div className="space-y-8">
							<div>
								<h3 className="text-4xl font-bold text-white mb-4">
									{project.title}
								</h3>
								<p className="text-gray-300 text-lg leading-relaxed">
									{project.description}
								</p>
							</div>

							<div>
								<h4 className="text-xl font-semibold text-white mb-4">
									Key Features
								</h4>
								<div className="grid grid-cols-2 gap-3">
									{project.features.map((feature, index) => (
										<div
											key={index}
											className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300"
										>
											<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
											<span className="text-gray-300">{feature}</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex items-center gap-6">
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
								>
									View Project
								</a>
								<div className="flex items-center gap-4 text-gray-400">
									<span className="flex items-center gap-2">
										<svg
											className="w-5 h-5 text-yellow-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										{project.stats.stars}
									</span>
									<span className="flex items-center gap-2">
										<svg
											className="w-5 h-5 text-blue-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										{project.stats.forks}
									</span>
									<span className="flex items-center gap-2">
										<svg
											className="w-5 h-5 text-green-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
											<path
												fillRule="evenodd"
												d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z"
												clipRule="evenodd"
											/>
										</svg>
										{project.stats.watchers}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Navigation Dots */}
				<div className="flex justify-center gap-4 mt-12">
					{projects.map((_, index) => (
						<button
							key={index}
							onClick={() => handleProjectChange(index)}
							className={`w-4 h-4 rounded-full transition-all duration-300 ${
								currentProject === index
									? 'bg-purple-500 scale-125'
									: 'bg-white/30 hover:bg-white/50'
							}`}
						/>
					))}
				</div>
			</div>

			<style jsx>{`
				.perspective-1000 {
					perspective: 1000px;
				}
				.preserve-3d {
					transform-style: preserve-3d;
				}
				.backface-hidden {
					backface-visibility: hidden;
				}
				.rotate-y-180 {
					transform: rotateY(180deg);
				}
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-20px);
					}
				}
				@keyframes float-delayed {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-30px);
					}
				}
				@keyframes float-slow {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-15px);
					}
				}
				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
				.animate-float-delayed {
					animation: float-delayed 8s ease-in-out infinite;
				}
				.animate-float-slow {
					animation: float-slow 10s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
};

export default Projects;