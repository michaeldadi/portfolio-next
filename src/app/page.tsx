import Hero from '@/components/Hero';
import { ProjectsSection } from '@/components/Projects';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Contact from '@/components/Contact';

const Home = () => {
  return (
    <main className='min-h-screen bg-gray-950'>
      <Hero />
      <ProjectsSection />
      <Skills />
      <About />
      <Contact />
    </main>
  );
};

export default Home;
