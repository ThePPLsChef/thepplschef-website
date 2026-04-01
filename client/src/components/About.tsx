/*
 * About — Smokehouse Editorial Design
 * Asymmetric layout: large chef image on one side, editorial text on the other.
 * Cream background section with gold accents.
 */
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/about-chef-QVjiLWLps5DMyMxX7uAGJz.webp";
const CHEF_ACTION = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD6QtrG-WvaEZ-_fd290b00.jpg";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative bg-[#F3F1E9] overflow-hidden">
      {/* Top gold accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent" />

      <div className="container py-24 lg:py-32" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={ABOUT_IMG}
                alt="Chef preparing food at an outdoor event"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              {/* Overlapping smaller image */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 w-48 h-48 lg:w-56 lg:h-56 border-4 border-[#F3F1E9] shadow-2xl">
                <img
                  src={CHEF_ACTION}
                  alt="Chef plating food"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Gold corner accent */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#ECA241]" />
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:pl-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#D82E2B]" />
              <span className="text-[#D82E2B] text-sm font-semibold tracking-[0.3em] uppercase">
                Our Story
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-[1.05] mb-8">
              Crafting Memorable{" "}
              <span className="text-[#D82E2B] italic">Dining Experiences</span>
            </h2>

            <div className="space-y-5 text-black/75 text-base lg:text-lg leading-relaxed">
              <p>
                The PPL's Chef was born from a simple belief: that exceptional food
                has the power to bring people together. What started as a passion
                for cooking for friends and family has grown into a full-service
                catering company dedicated to delivering restaurant-quality meals
                at any venue you choose.
              </p>
              <p>
                Every event is a unique canvas. Whether it's an intimate dinner
                party for ten or a grand celebration for hundreds, we bring the
                same level of dedication, creativity, and attention to detail.
                From sourcing the freshest ingredients to crafting custom menus
                that reflect your vision, we handle every aspect of the culinary
                experience.
              </p>
              <p>
                Our mission is simple — to make you and your guests feel like the
                most important people in the room, one plate at a time.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-10 lg:gap-16">
              {[
                { number: "500+", label: "Events Catered" },
                { number: "15k+", label: "Guests Served" },
                { number: "100%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-[family-name:var(--font-heading)] text-3xl lg:text-4xl font-bold text-[#D82E2B]">
                    {stat.number}
                  </div>
                  <div className="text-black/60 text-sm mt-1 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent" />
    </section>
  );
}
