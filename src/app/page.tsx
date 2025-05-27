'use client';

import { useEffect } from 'react';
import Hero from '@/components/main/hero';
import Projects from '@/components/main/projects';
import Skills from '@/components/main/skills';
import Contact from '@/components/main/contact';
import Header from '@/components/layout/header';
import About from '@/components/main/about';
import AndroidPhone from '@/components/main/android-phone';

export default function Home() {
  useEffect(() => {
    // Handle hash navigation on initial load
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="home" className="min-h-screen">
          <Hero />
        </section>
        <section id="android" className="min-h-screen">
          <AndroidPhone />
        </section>
        <section id="about" className="min-h-screen">
          <About />
        </section>
        <section id="projects" className="min-h-screen">
          <Projects />
        </section>
        <section id="skills" className="min-h-screen">
          <Skills />
        </section>
        <section id="contact" className="min-h-screen">
          <Contact />
        </section>
      </main>
    </div>
  );
}