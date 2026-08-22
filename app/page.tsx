import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Aviation from "@/components/Aviation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

export default function Page() {
  return (
    <main id="main" className="relative">
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Stack />
      <Aviation />
      <Contact />
      <Footer />
    </main>
  );
}
