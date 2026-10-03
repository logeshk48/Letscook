import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Marquee from "@/components/sections/Marquee";
import Recipe from "@/components/sections/Recipe";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import InkCta from "@/components/sections/InkCta";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      {/* everything below slides up over the sticky hero */}
      <div className="stack">
        <Services />
        <Marquee />
        <Recipe />
        <About />
        <Work />
        <Testimonials />
        <Faq />
        <InkCta />
        <Contact />
      </div>
    </main>
  );
}
