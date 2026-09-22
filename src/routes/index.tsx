import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Hero } from "@/components/wedding/Hero";
import { Couple } from "@/components/wedding/Couple";
import { Countdown } from "@/components/wedding/Countdown";
import { EventDetails } from "@/components/wedding/EventDetails";
import { Footer } from "@/components/wedding/Footer";
import { Opener } from "@/components/wedding/Opener";
import { ScrollProgress } from "@/components/wedding/ScrollProgress";

const title = "Megha & Aniruddha · 06 December 2026, Calicut";
const description =
  "Together with their families, Megha R and Aniruddha Mazumder invite you to their wedding on 06 December 2026 at Kadody Convention Centre, Calicut.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <>
      <AnimatePresence>
        {!opened && <Opener key="opener" onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      {opened && <ScrollProgress />}

      <motion.main
        initial={{ opacity: 0, scale: 1.03 }}
        animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="bg-background mx-auto w-full max-w-[520px] overflow-hidden"
      >
        <Hero />
        <Couple />
        <Countdown />
        <EventDetails />
        <Footer />
      </motion.main>
    </>
  );
}
