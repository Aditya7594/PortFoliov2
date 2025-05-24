'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const games = [
  {
    title: "Snake Game",
    description: "Classic snake game with modern controls and scoring system",
    image: "/games/snake.jpg",
    tags: ["JavaScript", "Canvas", "HTML5"],
    link: "/games/snake"
  },
  {
    title: "Tic Tac Toe",
    description: "Interactive Tic Tac Toe with AI opponent",
    image: "/games/tictactoe.jpg",
    tags: ["React", "TypeScript", "AI"],
    link: "/games/tictactoe"
  },
  {
    title: "Memory Match",
    description: "Card matching game with animations and timer",
    image: "/games/memory.jpg",
    tags: ["React", "Framer Motion", "CSS"],
    link: "/games/memory"
  }
];

const Games = () => {
  return (
    <section id="games" className="py-20 bg-black/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Fun Games
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Check out these interactive games I've built. Feel free to play and challenge yourself!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gray-900 rounded-xl overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={game.link}
                  className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Play Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games; 