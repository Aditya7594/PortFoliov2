'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface Project {
	title: string;
	description: string;
	image: string;
	tags: string[];
	languages: string[];
	link: string;
	iframeUrl: string;
	stats: { stars: number; forks: number; watchers: number };
	features: string[];
	category: string;
	icon: string;
}

const fallbackProjects: Project[] = [
	{
		title: 'Computer Lab Management System',
		description:
			'A comprehensive system for managing computer lab resources, bookings, and maintenance built with Visual Basic .NET. Features include user authentication, resource scheduling, maintenance tracking, and detailed reporting capabilities.',
		image: '/PortFoliov2/projects/computerlab.jpg',
		tags: ['Visual Basic .NET', 'SQL Server', 'Windows Forms'],
		languages: ['Visual Basic .NET', 'SQL', 'C#'],
		link: 'https://github.com/Aditya7594/computerlab-COMPLETED',
		iframeUrl: 'https://github.com/Aditya7594/computerlab-COMPLETED',
		stats: { stars: 12, forks: 5, watchers: 8 },
		features: ['User Management', 'Resource Booking', 'Maintenance Tracking', 'Report Generation'],
		category: 'Desktop Application',
		icon: '🖥️',
	},
	{
		title: 'Anime Soundboard',
		description:
			'An Android app featuring sound clips from popular anime series like One Piece and Bleach. Interactive interface with custom sound effects, favorites system, and sharing capabilities.',
		image: '/PortFoliov2/projects/Animesoundboard.png',
		tags: ['Java', 'Android', 'Media Player'],
		languages: ['Java', 'XML', 'Kotlin'],
		link: 'https://github.com/Aditya7594/Anime-Soundboard',
		iframeUrl: 'https://github.com/Aditya7594/Anime-Soundboard',
		stats: { stars: 28, forks: 12, watchers: 15 },
		features: ['Sound Library', 'Favorites System', 'Share Sounds', 'Custom Playlists'],
		category: 'Mobile Application',
		icon: '🎵',
	},
	{
		title: 'AI Music Player',
		description:
			'An intelligent music player that uses AI to enhance the listening experience with smart recommendations, mood detection, and personalized playlists based on listening habits.',
		image: '/PortFoliov2/projects/aimusic.jpg',
		tags: ['Kotlin', 'Android', 'AI Integration'],
		languages: ['Kotlin', 'Python', 'TensorFlow'],
		link: 'https://github.com/Aditya7594/Ai-Music-Player',
		iframeUrl: 'https://github.com/Aditya7594/Ai-Music-Player',
		stats: { stars: 45, forks: 18, watchers: 32 },
		features: ['AI Recommendations', 'Mood Detection', 'Smart Playlists', 'Voice Control'],
		category: 'AI Application',
		icon: '🤖',
	},
];

const StarIcon = () => (
	<svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
	</svg>
);

const ForkIcon = () => (
	<svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
		<path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
	</svg>
);

const Projects = () => {
	const [projectsList, setProjectsList] = useState<Project[]>(fallbackProjects);
	const [currentProject, setCurrentProject] = useState<number>(0);
	const [autoSlide, setAutoSlide] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [iframeLoaded, setIframeLoaded] = useState(false);

	// Helper function to extract first image from markdown
	const extractFirstImageFromMarkdown = (markdown: string): string | null => {
		// Match Markdown images: ![alt](url)
		const mdRegex = /!\[.*?\]\((.*?)\)/;
		const mdMatch = markdown.match(mdRegex);
		if (mdMatch && mdMatch[1]) return mdMatch[1];

		// Match HTML images: <img src="url">
		const htmlRegex = /<img.*?src=["'](.*?)["']/;
		const htmlMatch = markdown.match(htmlRegex);
		if (htmlMatch && htmlMatch[1]) return htmlMatch[1];

		return null;
	};

	// Helper function to extract text description from markdown
	const extractDescriptionFromMarkdown = (markdown: string): string | null => {
		const lines = markdown.split('\n');
		for (let line of lines) {
			let text = line.trim();

			// Skip headings, blockquotes, code blocks, or pure image/badge lines
			if (text.startsWith('#') || text.startsWith('>') || text.startsWith('```') ||
				text.match(/^\[!\[.*?\]\(.*?\)\]\(.*?\)$/) || text.match(/^!\[.*?\]\(.*?\)$/)) {
				continue;
			}

			// Clean remaining HTML, images, and links
			text = text.replace(/<[^>]*>?/gm, ''); // remove HTML
			text = text.replace(/!\[.*?\]\(.*?\)/g, ''); // remove inline images
			text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // flatten links to just their text
			text = text.trim();

			// If line has substantial text content, assume it's the description
			if (text.length > 25) {
				return text.length > 150 ? text.substring(0, 147) + '...' : text;
			}
		}
		return null;
	};

	useEffect(() => {
		const fetchGithubProjects = async () => {
			try {
				const res = await fetch('https://api.github.com/users/Aditya7594/repos?sort=updated&per_page=10');
				if (!res.ok) return;
				const repos = await res.json();
				const activeRepos = repos.filter((r: any) => !r.fork);

				const dynamicProjectsPromises = activeRepos.map(async (repo: any) => {
					// Match with existing fallback data for better icons/features if available
					const match = fallbackProjects.find(p => p.link.includes(repo.name) || p.title.toLowerCase() === repo.name.toLowerCase().replace(/-/g, ' '));

					let readmeImageUrl = null;
					let readmeDescription = null;

					// Always try to fetch README if fallback image or description is missing.
					// We prioritize the README description because it's usually much better than the repo's 'about' field.
					if (!match?.image || !match?.description) {
						try {
							const readmeRes = await fetch(`https://raw.githubusercontent.com/Aditya7594/${repo.name}/${repo.default_branch || 'main'}/README.md`);
							if (readmeRes.ok) {
								const markdown = await readmeRes.text();

								// Extract Image
								if (!match?.image) {
									const extractedImage = extractFirstImageFromMarkdown(markdown);
									if (extractedImage) {
										if (extractedImage.startsWith('http')) {
											readmeImageUrl = extractedImage;
										} else {
											const cleanPath = extractedImage.startsWith('/') ? extractedImage.substring(1) : extractedImage;
											readmeImageUrl = `https://raw.githubusercontent.com/Aditya7594/${repo.name}/${repo.default_branch || 'main'}/${cleanPath}`;
										}
									}
								}

								// Extract Description
								if (!match?.description) {
									readmeDescription = extractDescriptionFromMarkdown(markdown);
								}
							}
						} catch (e) {
							console.log('No readme found for', repo.name);
						}
					}

					return {
						title: repo.name.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase()),
						description: match?.description || readmeDescription || repo.description || 'No description provided for this repository.',
						image: match?.image || readmeImageUrl || `https://opengraph.githubassets.com/1/Aditya7594/${repo.name}`,
						tags: repo.topics && repo.topics.length > 0 ? repo.topics : (match?.tags || []),
						languages: [repo.language].filter(Boolean) as string[],
						link: repo.html_url,
						iframeUrl: match?.iframeUrl || (repo.has_pages ? `https://aditya7594.github.io/${repo.name}` : repo.html_url),
						stats: { stars: repo.stargazers_count, forks: repo.forks_count, watchers: repo.watchers_count },
						features: match?.features || ['Open Source', 'GitHub Hosted'],
						category: match?.category || 'Software Project',
						icon: match?.icon || '📁'
					};
				});

				const dynamicProjects = await Promise.all(dynamicProjectsPromises);

				if (dynamicProjects.length > 0) {
					// Merge dynamic with fallbacks that might not be in the recent API call
					const merged = [...dynamicProjects];
					fallbackProjects.forEach(fp => {
						if (!merged.find(dp => dp.link === fp.link)) {
							merged.push(fp);
						}
					});
					setProjectsList(merged);
				}
			} catch (err) {
				console.error("Failed to load GitHub projects", err);
			}
		};
		fetchGithubProjects();
	}, []);

	useEffect(() => {
		if (!autoSlide || modalOpen || projectsList.length === 0) return;
		const interval = setInterval(() => {
			setCurrentProject((prev) => (prev + 1) % projectsList.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [autoSlide, modalOpen]);

	const handleProjectChange = (index: number) => {
		setCurrentProject(index);
		setAutoSlide(false);
	};

	const handlePrev = () => {
		setCurrentProject((prev) => (prev - 1 + projectsList.length) % projectsList.length);
		setAutoSlide(false);
	};

	const handleNext = () => {
		setCurrentProject((prev) => (prev + 1) % projectsList.length);
		setAutoSlide(false);
	};

	const openModal = () => {
		setIframeLoaded(false);
		setModalOpen(true);
	};

	const closeModal = useCallback(() => {
		setModalOpen(false);
	}, []);

	// Close modal on Escape
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeModal();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [closeModal]);

	const project = projectsList[currentProject];

	if (!project) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
			{/* Animated background blobs */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float" style={{ left: '10%', top: '10%' }}></div>
				<div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float-delayed" style={{ right: '10%', bottom: '15%' }}></div>
				<div className="absolute w-56 sm:w-80 h-56 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float-slow" style={{ left: '50%', top: '60%' }}></div>
			</div>

			<div className="relative z-10 container mx-auto px-4 sm:px-8 py-16 sm:py-20">
				{/* Header */}
				<div className="text-center mb-10 sm:mb-12">
					<h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
						Featured Projects
					</h2>
					<p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto">
						Discover my latest work in software development and AI integration
					</p>
				</div>

				{/* Main Content */}
				<div className="w-full max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

						{/* Left Side - Project Image Card */}
						<div className="relative">
							<div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
								style={{ height: 'clamp(280px, 45vw, 500px)' }}>
								<Image
									src={project.image}
									alt={project.title}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
									width={600}
									height={500}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

								{/* Category badge & stats */}
								<div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
									<div className="flex items-center gap-3 mb-2 sm:mb-4 flex-wrap">
										<span className="px-3 py-1 bg-purple-600/80 text-white text-xs sm:text-sm rounded-full backdrop-blur-sm">
											{project.icon} {project.category}
										</span>
										<div className="flex items-center gap-2 sm:gap-4 text-white/80 text-sm">
											<span className="flex items-center gap-1"><StarIcon />{project.stats.stars}</span>
											<span className="flex items-center gap-1"><ForkIcon />{project.stats.forks}</span>
										</div>
									</div>
									<h3 className="text-lg sm:text-2xl font-bold text-white mb-1">{project.title}</h3>
									<button
										onClick={openModal}
										className="text-cyan-400 text-xs sm:text-sm hover:text-cyan-300 transition-colors underline underline-offset-2"
									>
										🔍 Live Preview →
									</button>
								</div>
							</div>

							{/* Prev / Next arrows */}
							<div className="flex items-center justify-between mt-4 px-2">
								<button
									onClick={handlePrev}
									className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10"
								>
									← Prev
								</button>

								{/* Navigation Dots */}
								<div className="flex justify-center mt-8 gap-2">
									{projectsList.map((_, idx) => (
										<button
											key={idx}
											onClick={() => handleProjectChange(idx)}
											className={`transition-all duration-300 rounded-full ${idx === currentProject
												? 'w-8 h-2 bg-blue-500'
												: 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
												}`}
											aria-label={`Go to project ${idx + 1}`}
										/>
									))}
								</div>

								<button
									onClick={handleNext}
									className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10"
								>
									Next →
								</button>
							</div>
						</div>

						{/* Right Side - Project Details */}
						<div className="space-y-6">
							<div>
								<h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">{project.title}</h3>
								<p className="text-gray-300 text-sm sm:text-lg leading-relaxed">{project.description}</p>
							</div>

							{/* Languages */}
							<div>
								<h4 className="text-lg sm:text-xl font-semibold text-white mb-3">Technologies</h4>
								<div className="flex flex-wrap gap-2">
									{project.languages.map((lang, index) => (
										<span
											key={index}
											className="px-3 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white font-medium text-sm rounded-xl border border-white/10 hover:border-purple-400/50 transition-colors"
										>
											{lang}
										</span>
									))}
								</div>
							</div>

							{/* Features */}
							<div>
								<h4 className="text-lg sm:text-xl font-semibold text-white mb-3">Key Features</h4>
								<div className="grid grid-cols-2 gap-2 sm:gap-3">
									{project.features.map((feature, index) => (
										<div
											key={index}
											className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300"
										>
											<div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
											<span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
										</div>
									))}
								</div>
							</div>

							{/* Tags */}
							<div className="flex flex-wrap gap-2">
								{project.tags.map((tag, index) => (
									<span key={index} className="px-2 sm:px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs">
										#{tag}
									</span>
								))}
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap items-center gap-4">
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
								>
									View on GitHub
								</a>
								<button
									onClick={openModal}
									className="px-6 py-3 border-2 border-cyan-500 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-300 text-sm sm:text-base"
								>
									🔍 Live Preview
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* iFrame Modal */}
			{modalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
					style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
					onClick={closeModal}
				>
					<div
						className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
						style={{ height: '85vh' }}
						onClick={e => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-800 border-b border-white/10 flex-shrink-0">
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<span className="text-xl sm:text-2xl">{project.icon}</span>
								<span className="text-white font-semibold text-sm sm:text-base truncate">{project.title}</span>
								<span className="hidden sm:inline text-gray-400 text-sm">— GitHub Preview</span>
							</div>
							<div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
								>
									Open GitHub ↗
								</a>
								<button
									onClick={closeModal}
									className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors text-lg font-bold"
								>
									✕
								</button>
							</div>
						</div>

						{/* Loading overlay */}
						{!iframeLoaded && (
							<div className="absolute inset-0 top-14 flex items-center justify-center bg-slate-900 z-10">
								<div className="text-center">
									<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
									<p className="text-gray-400">Loading preview...</p>
								</div>
							</div>
						)}

						{/* iFrame */}
						<iframe
							src={project.iframeUrl}
							className="flex-1 w-full border-0"
							title={`${project.title} Preview`}
							onLoad={() => setIframeLoaded(true)}
							sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
						/>
					</div>
				</div>
			)}

			<style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
      `}</style>
		</div>
	);
};

export default Projects;