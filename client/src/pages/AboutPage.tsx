/**
 * AboutPage — Dedicated About page for The PPL's Chef
 * Tells the story of Chef Stephen Austin and the brand.
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Award, Users, Star, Heart, ChefHat, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import {
  LOGO_PRIMARY, CHEF_BW_PORTRAIT, SEAFOOD_BOIL_CHEF,
  HERO_BG, CHEF_REAL_PORTRAIT_1, CHEF_REAL_PORTRAIT_2,
} from "@/lib/images";

const fontBody = { fontFamily: "var(--font-body)" };
const fontSerif = { fontFamily: "var(--font-serif)" };

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Chef Stephen Austin | The PPL's Chef | Las Vegas";
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="relative z-10 container pb-16 pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">About Us</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-3">
              Meet the <span className="text-[#ECA241]">Chef</span>
            </h1>
            <p className="text-[#F3F1E9]/60 text-lg max-w-xl" style={fontSerif}>
              The story behind Las Vegas's premier private chef and catering experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CHEF BIO ─── */}
      <section className="section-cream py-24 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn>
              <div className="relative">
                <img
                  src={CHEF_BW_PORTRAIT}
                  alt="Chef Stephen Austin — Founder & Director of Culinary Operations, The PPL's Chef"
                  className="w-full h-[560px] lg:h-[700px] object-cover object-top"
                />
                <div className="absolute top-4 left-4 w-14 h-14 border-t-2 border-l-2 border-[#ECA241]" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D82E2B]" />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-center gap-4 mb-6">
                <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-16 w-auto object-contain drop-shadow-lg" />
                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-black">The PPL's <span className="text-[#D82E2B]">Chef</span></div>
                  <div className="text-[#D82E2B]/60 text-[10px] tracking-[0.25em] uppercase" style={fontBody}>The People's Chef</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
                <span className="brand-label text-[#D82E2B]">Meet the Chef</span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight mb-2">
                Chef Stephen <span className="text-[#D82E2B]">Austin</span>
              </h2>
              <p className="text-[#ECA241] text-sm tracking-widest uppercase mb-6" style={{ ...fontBody, fontWeight: 600 }}>
                Founder &amp; Director of Culinary Operations
              </p>

              <div className="space-y-4 text-black/60 text-base leading-relaxed" style={{ ...fontSerif, fontWeight: 400 }}>
                <p>
                  Chef Stephen Austin is the founder and culinary force behind The PPL's Chef — Las Vegas's premier private chef and catering experience. Born and raised in Georgia, Chef Stephen spent over 25 years immersed in professional kitchens, learning and mastering every aspect of the culinary craft from the ground up.
                </p>
                <p>
                  After relocating to Las Vegas, he formalized his training at the College of Southern Nevada (CSN), where he sharpened his technical skills and deepened his passion for creating exceptional dining experiences. That passion became a mission: to bring restaurant-quality food directly to the people — in their homes, at their events, and in their most meaningful moments.
                </p>
                <p>
                  Today, The PPL's Chef serves clients across the Las Vegas Valley with custom menus, full-service catering, intimate private dining experiences, and chef-crafted meal prep that turns every occasion into an unforgettable memory.
                </p>
              </div>

              <blockquote className="mt-7 border-l-4 border-[#D82E2B] pl-5">
                <p className="text-black/70 text-base italic leading-relaxed" style={{ ...fontSerif, fontWeight: 400 }}>
                  "I spent my life in kitchens learning and training so people can enjoy moments with food."
                </p>
                <footer className="mt-2 text-[#D82E2B] text-xs tracking-widest uppercase" style={{ ...fontBody, fontWeight: 600 }}>— Chef Stephen Austin</footer>
              </blockquote>

              <div className="mt-8 flex gap-10 lg:gap-14">
                {[
                  { num: "25+", label: "Years Experience" },
                  { num: "500+", label: "Events Served" },
                  { num: "5★", label: "Client Rating" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#D82E2B]">{s.num}</div>
                    <div className="text-black/40 text-xs mt-1 tracking-wide" style={fontBody}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── IN ACTION ─── */}
      <section className="section-dark py-24 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#ECA241]" />
                <span className="brand-label">In Action</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-[#F3F1E9] leading-tight mb-6">
                Passion in Every <span className="text-[#ECA241]">Plate</span>
              </h2>
              <div className="space-y-4 text-[#F3F1E9]/55 text-base leading-relaxed" style={fontSerif}>
                <p>
                  Whether it's a signature seafood boil for a backyard celebration, a multi-course plated dinner for an intimate anniversary, or weekly meal prep for a busy professional — Chef Stephen brings the same level of care, creativity, and precision to every dish.
                </p>
                <p>
                  His approach is simple: treat every client like family, use the freshest ingredients, and never cut corners. The result is food that doesn't just taste extraordinary — it creates moments people remember.
                </p>
              </div>

              <blockquote className="mt-7 border-l-4 border-[#ECA241] pl-5">
                <p className="text-[#F3F1E9]/60 text-base italic leading-relaxed" style={fontSerif}>
                  "Everybody Deserves to Have a Chef."
                </p>
                <footer className="mt-2 text-[#ECA241] text-xs tracking-widest uppercase" style={{ ...fontBody, fontWeight: 600 }}>— The PPL's Chef</footer>
              </blockquote>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative">
                <img
                  src={SEAFOOD_BOIL_CHEF}
                  alt="Chef Stephen Austin preparing a signature seafood boil"
                  className="w-full h-[480px] lg:h-[560px] object-cover"
                />
                <div className="absolute bottom-4 right-4 w-14 h-14 border-b-2 border-r-2 border-[#ECA241]" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="section-cream py-24 lg:py-32">
        <div className="container">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#D82E2B]" />
              <span className="brand-label text-[#D82E2B]">Why Choose Us</span>
              <div className="w-8 h-[1px] bg-[#D82E2B]" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight">
              What Sets Us <span className="text-[#D82E2B]">Apart</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: "25+ Years of Experience", desc: "From Georgia kitchens to Las Vegas fine dining, Chef Stephen brings decades of hands-on culinary expertise to every event." },
              { icon: Award, title: "CSN Trained", desc: "Formal culinary training at the College of Southern Nevada, combining classical technique with creative innovation." },
              { icon: MapPin, title: "Las Vegas Based", desc: "Proudly serving the entire Las Vegas Valley — from Henderson to Summerlin and everywhere in between." },
              { icon: Heart, title: "Personal Touch", desc: "Every menu is custom-designed. Every event is treated like our own. Your satisfaction comes first." },
              { icon: Users, title: "Full-Service Team", desc: "From setup to cleanup, our professional team handles every detail so you can enjoy the moment." },
              { icon: Star, title: "5-Star Reputation", desc: "Consistently rated 5 stars by clients across Las Vegas for food quality, service, and professionalism." },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="text-center group p-6">
                  <div className="w-16 h-16 mx-auto mb-5 border border-[#D82E2B]/20 flex items-center justify-center group-hover:bg-[#D82E2B] group-hover:border-[#D82E2B] transition-all duration-400">
                    <item.icon size={24} className="text-[#D82E2B] group-hover:text-white transition-colors duration-400" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg mb-3">{item.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed" style={fontBody}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${CHEF_REAL_PORTRAIT_2})` }} />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 container text-center">
          <FadeIn>
            <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-20 w-auto object-contain mx-auto mb-6 drop-shadow-xl" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-5">
              Ready to Experience the <span className="text-[#ECA241]">Difference?</span>
            </h2>
            <p className="text-[#F3F1E9]/55 text-base lg:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={fontBody}>
              Let Chef Stephen and the team bring an unforgettable culinary experience to your next event.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">Book Your Experience</Link>
              <a href="tel:725-212-2236" className="btn-outline">Call 725-212-2236</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
