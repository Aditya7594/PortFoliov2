'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  index: number;
}

const ProjectCard = ({
  title,
  description,
  image,
  tags,
  githubUrl,
  liveUrl,
  index,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-gray-900 rounded-xl overflow-hidden group"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-500 transition-colors"
          >
            <FiGithub size={24} />
          </a>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-500 transition-colors"
          >
            <FiExternalLink size={24} />
          </a>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* GitHub metadata row (optional, for use in main/projects.tsx) */}
        {/**
        {githubData && (
          <div className="flex flex-wrap gap-4 items-center text-gray-400 text-xs mt-2 animate-fade-in">
            {githubData.stars !== undefined && (
              <span title="Stars" className="flex items-center gap-1"><svg width="16" height="16" fill="currentColor" className="text-yellow-400"><path d="M9 1.5l2.47 5.01 5.53.8-4 3.89.94 5.5L9 13.77l-4.94 2.59.94-5.5-4-3.89 5.53-.8z"/></svg>{githubData.stars}</span>
            )}
            {githubData.forks !== undefined && (
              <span title="Forks" className="flex items-center gap-1"><svg width="16" height="16" fill="currentColor" className="text-blue-300"><path d="M6 3a3 3 0 1 1-2 5.83V13a3 3 0 1 1 2 5.83V13a3 3 0 1 1 2-5.83V3z"/></svg>{githubData.forks}</span>
            )}
            {githubData.languages && githubData.languages.length > 0 && (
              <span title="Languages" className="flex items-center gap-1"><svg width="16" height="16" fill="currentColor" className="text-indigo-400"><circle cx="8" cy="8" r="7"/></svg>{githubData.languages.join(', ')}</span>
            )}
          </div>
        )}
        */}
      </div>
    </motion.div>
  );
};

export default ProjectCard;