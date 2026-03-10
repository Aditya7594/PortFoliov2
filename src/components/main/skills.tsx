import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
  color: string;
  category: string;
  icon: string;
}

const skills: Skill[] = [
  { name: 'C++', level: 40, color: '#00599C', category: 'Programming', icon: '💠' },
  { name: 'C', level: 40, color: '#555555', category: 'Programming', icon: '🔵' },
  { name: 'Java', level: 40, color: '#5382A1', category: 'Programming', icon: '☕' },
  { name: 'Python', level: 90, color: '#3776AB', category: 'Programming', icon: '🐍' },
  { name: 'PTB', level: 70, color: '#4B8BBE', category: 'Library', icon: '🤖' },
  { name: 'PHP', level: 75, color: '#777BB4', category: 'Web', icon: '🐘' },
  { name: 'HTML', level: 85, color: '#E34F26', category: 'Web', icon: '🌐' },
  { name: 'CSS', level: 80, color: '#1572B6', category: 'Web', icon: '🎨' },
  { name: 'Tailwind', level: 70, color: '#38BDF8', category: 'Web', icon: '🌊' },
  { name: 'MongoDB', level: 75, color: '#47A248', category: 'Database', icon: '🍃' },
  { name: 'SQL', level: 80, color: '#336791', category: 'Database', icon: '🗄️' },
  { name: 'NumPy', level: 85, color: '#013243', category: 'Data', icon: '🔢' },
  { name: 'Pandas', level: 85, color: '#150458', category: 'Data', icon: '🐼' },
];

const SkillCard = ({ skill, index, isSpread, hoveredCard, setHoveredCard, windowWidth }: {
  skill: Skill;
  index: number;
  isSpread: boolean;
  hoveredCard: number | null;
  setHoveredCard: (index: number | null) => void;
  windowWidth: number;
}) => {
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const cardWidth = isMobile ? 120 : 180;
  const cardHeight = isMobile ? 160 : 250;

  const getCardPosition = () => {
    if (!isSpread) {
      // Stacked position - slight offset for depth effect
      return {
        x: index * 2,
        y: index * -3,
        rotate: index * 0.5,
        scale: 1 - (index * 0.01),
        zIndex: skills.length - index
      };
    }

    // Spread positions in a circular/grid pattern
    const cols = isMobile ? 2 : isTablet ? 3 : 5;
    const rows = Math.ceil(skills.length / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);

    const spacingX = isMobile ? 10 : 30;
    const spacingY = isMobile ? 20 : 40;

    const totalWidth = (cols - 1) * (cardWidth + spacingX);
    const totalHeight = (rows - 1) * (cardHeight + spacingY);

    const x = (col * (cardWidth + spacingX)) - (totalWidth / 2);
    const y = (row * (cardHeight + spacingY)) - (totalHeight / 2);

    return {
      x,
      y,
      rotate: 0,
      scale: hoveredCard === index ? (isMobile ? 1.05 : 1.1) : 1,
      zIndex: hoveredCard === index ? 100 : 10 + index
    };
  };

  const cardPosition = getCardPosition();

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: cardWidth,
        height: cardHeight,
        left: '50%',
        top: '50%',
        transformOrigin: 'center center'
      }}
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.8,
        opacity: 0
      }}
      animate={{
        x: cardPosition.x,
        y: cardPosition.y,
        rotate: cardPosition.rotate,
        scale: cardPosition.scale,
        opacity: 1,
        zIndex: cardPosition.zIndex
      }}
      transition={{
        type: 'spring',
        stiffness: isSpread ? 120 : 200,
        damping: isSpread ? 15 : 20,
        delay: isSpread ? index * (isMobile ? 0.05 : 0.1) : (skills.length - index) * 0.05,
        duration: 0.6
      }}
      whileHover={{
        scale: isSpread ? (isMobile ? 1.05 : 1.15) : 1.05,
        y: isSpread ? cardPosition.y - 10 : cardPosition.y - 10,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setHoveredCard(index)}
      onHoverEnd={() => setHoveredCard(null)}
      onClick={() => setHoveredCard(hoveredCard === index ? null : index)}
    >
      <motion.div
        className="w-full h-full rounded-2xl shadow-2xl relative overflow-hidden transform-gpu"
        style={{
          background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}40)`,
          border: `2px solid ${skill.color}60`,
          transform: 'translate(-50%, -50%)'
        }}
        whileHover={{
          boxShadow: `0 20px 40px ${skill.color}40`,
          borderColor: skill.color
        }}
      >
        {/* Card Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${skill.color} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span
            className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: `${skill.color}80` }}
          >
            {skill.category}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 text-center mt-2 sm:mt-0">
          {/* Icon */}
          <motion.div
            className="text-4xl sm:text-6xl mb-2 sm:mb-4"
            animate={{
              rotate: hoveredCard === index ? [0, -10, 10, 0] : 0,
              scale: hoveredCard === index ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.5, repeat: hoveredCard === index ? Infinity : 0 }}
          >
            {skill.icon}
          </motion.div>

          {/* Skill Name */}
          <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
            {skill.name}
          </h3>

          {/* Proficiency Level */}
          <div className="w-full mb-1 sm:mb-3 px-1 sm:px-0">
            <div className="flex justify-between items-center mb-0.5 sm:mb-1">
              <span className="text-[10px] sm:text-sm text-gray-200">Level</span>
              <span className="text-[10px] sm:text-sm font-bold text-white">{skill.level}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1 sm:h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{
                  duration: 1.5,
                  delay: isSpread ? index * 0.1 + 0.5 : 0,
                  ease: "easeOut"
                }}
              />
            </div>
          </div>

          {/* Experience Indicator - Hidden on small screens */}
          <div className="hidden sm:flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{
                  backgroundColor: i < Math.floor(skill.level / 20) ? skill.color : '#ffffff40'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: isSpread ? index * 0.1 + 0.8 + (i * 0.1) : 0.5 + (i * 0.1),
                  type: 'spring',
                  stiffness: 200
                }}
              />
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {hoveredCard === index && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-4"
            >
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white text-sm font-medium px-4 text-center"
              >
                {skill.level >= 80 ? 'Expert Level' :
                  skill.level >= 60 ? 'Advanced' :
                    'Intermediate'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const Skills = () => {
  const [inView, setInView] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 200 && rect.bottom > 200;

      if (isVisible !== inView) {
        setInView(isVisible);

        // Add slight delay for spread animation
        if (isVisible) {
          setTimeout(() => setIsSpread(true), 300);
        } else {
          setIsSpread(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView]);

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden min-h-screen"
      ref={sectionRef}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(147,51,234,0.1),transparent)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: inView ? 1 : 0,
              y: inView ? 0 : 30,
              backgroundPosition: inView ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
            }}
            transition={{
              duration: 0.8,
              backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
            style={{
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Technical Skills
          </motion.h2>

          <motion.p
            className="text-gray-400 text-xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            My technical expertise spans across AI/ML, Full-Stack Development, Data Engineering, and DevOps
          </motion.p>

          {/* Cards Counter */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-white font-medium">{skills.length} Skills</span>
            <motion.span
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{
                opacity: [1, 0.5, 1],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Cards Container */}
        <div className="relative h-[1100px] sm:h-[800px] flex items-center justify-center px-2">
          <motion.div
            className="relative w-full h-full"
            animate={{
              rotateY: isSpread ? 0 : 5,
              rotateX: isSpread ? 0 : -5
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ perspective: '1000px' }}
          >
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={index}
                isSpread={isSpread}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                windowWidth={windowWidth}
              />
            ))}
          </motion.div>

          {/* Interaction Hint */}
          <AnimatePresence>
            {isSpread && !hoveredCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center"
              >
                <motion.p
                  className="text-gray-400 text-sm flex items-center space-x-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>👆</span>
                  <span>Hover over cards to see proficiency details</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;