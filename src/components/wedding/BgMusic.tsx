import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const SRC = `${import.meta.env.BASE_URL}music/bg.mp3`;

/**
 * Background music player. Playback starts on the opener's seal-tap
 * (a user gesture, so browsers allow it) and loops until toggled.
 * Drop the wedding song at `public/music/bg.mp3`.
 */
export function BgMusic({ start }: { start: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !start || missing) return;
    el.volume = 0.6;
    el
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [start, missing]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio
        ref={ref}
        src={SRC}
        loop
        preload="auto"
        onError={() => setMissing(true)}
      />
      {start && !missing && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={toggle}
          whileTap={{ scale: 0.9 }}
          aria-label={playing ? "Mute background music" : "Play background music"}
          className="border-gold/50 bg-emerald-ink/70 text-gold fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full border shadow-lg backdrop-blur-sm"
        >
          <motion.span
            animate={playing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={playing ? { repeat: Infinity, duration: 2 } : {}}
            className="grid place-items-center"
          >
            {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </motion.span>
        </motion.button>
      )}
    </>
  );
}
