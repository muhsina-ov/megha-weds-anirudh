import { motion } from "framer-motion";
import { images } from "./images";
import { Reveal, Ornament } from "./Reveal";

const moments = [
  {
    image: images.couple3,
    caption: "Golden light & timeless promises",
    alt: "Megha & Aniruddha in warm sunlight",
  },
  {
    image: images.couple2,
    caption: "Love in every whispered smile",
    alt: "Megha & Aniruddha candid moment",
  },
  {
    image: images.couple1,
    caption: "Together, wherever the journey leads",
    alt: "Megha & Aniruddha together",
  },
];

export function Gallery() {
  return (
    <section className="relative overflow-hidden px-5 py-20">
      <div className="relative mx-auto max-w-md">
        <Reveal className="text-center">
          <Ornament label="Moments of Love" />
          <h2 className="text-primary mt-5 text-4xl font-light">A glimpse of forever</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xs text-sm leading-relaxed">
            Every shared laugh, gentle smile, and quiet glance that brought us to this celebration.
          </p>
        </Reveal>

        <div className="mt-10 space-y-6">
          {moments.map((item, idx) => (
            <Reveal key={idx} delay={idx * 0.12}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-card/70 border-gold/30 shadow-luxe group relative overflow-hidden rounded-[2rem] border p-3.5 backdrop-blur-sm"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.4rem]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width={682}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute right-0 bottom-0 left-0 p-5 text-center">
                    <p className="font-script text-gold-soft text-2xl drop-shadow-sm">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
