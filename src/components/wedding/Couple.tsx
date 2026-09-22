import { wedding } from "./data";
import { images } from "./images";
import { Parallax } from "./Parallax";
import { Reveal, Ornament } from "./Reveal";

function Person({
  person,
  role,
}: {
  person: typeof wedding.bride;
  role: string;
}) {
  return (
    <Reveal className="relative">
      <div className="bg-card/70 border-gold/30 shadow-luxe relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-sm">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url('${images.mandala}')`,
            backgroundSize: "cover",
          }}
        />
        <div className="relative flex flex-col items-center text-center">
          <div className="from-gold/50 via-gold/25 relative h-44 w-44 overflow-hidden rounded-full p-1 bg-gradient-to-b to-transparent shadow-lg">
            <div className="h-full w-full overflow-hidden rounded-full ring-2 ring-gold/40">
              <img
                src={person.image}
                alt={person.fullName}
                loading="lazy"
                width={682}
                height={1024}
                style={{
                  objectPosition: person.imagePosition || "center top",
                  transform: person.imageScale ? `scale(${person.imageScale})` : undefined,
                }}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          <span className="text-gold mt-5 text-[0.6rem] tracking-[0.45em] uppercase">
            {role}
          </span>
          <h3 className="text-primary mt-2 text-3xl font-light">{person.fullName}</h3>
          <p className="text-muted-foreground mt-1 text-xs tracking-wide">{person.line}</p>
          {person.origin && (
            <p className="text-gold/90 mt-1 text-[0.65rem] tracking-[0.25em] uppercase font-medium">
              {person.origin}
            </p>
          )}
          <span className="rule-gold my-4 w-20" />
          <p className="text-foreground/75 text-sm leading-relaxed">{person.note}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function Couple() {
  return (
    <section className="relative overflow-hidden px-5 py-20">
      <img
        src={images.floralCorner}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute -top-6 -left-10 w-44 opacity-40"
      />
      <img
        src={images.floralCorner}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute -right-10 -bottom-6 w-44 rotate-180 opacity-40"
      />

      <div className="relative mx-auto max-w-md">
        <Reveal className="text-center">
          <Ornament label="The Couple" />
          <h2 className="text-primary mt-5 text-4xl font-light">Two hearts, one thread</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xs text-sm leading-relaxed">
            From the shores of Calicut to the cultural melodies of Kolkata — two lives united in love.
          </p>
        </Reveal>

        <div className="mt-10 space-y-8">
          <Parallax speed={26}>
            <Person person={wedding.bride} role="The Bride" />
          </Parallax>
          <div className="flex justify-center">
            <span className="font-script text-gold animate-float-soft text-5xl">&amp;</span>
          </div>
          <Parallax speed={-26}>
            <Person person={wedding.groom} role="The Groom" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
