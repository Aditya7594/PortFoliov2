'use client';

import Hero from '@/components/main/hero';
import Projects from '@/components/main/projects';
import Skills from '@/components/main/skills';
import Contact from '@/components/main/contact';
import Header from '@/components/layout/header';
import About from '@/components/main/about';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </>
  );
}