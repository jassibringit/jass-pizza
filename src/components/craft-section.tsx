const steps = [
  {
    title: "the dough",
    body: "Mixed in-house, then cold-fermented upto 24 hours . That's where the flavour, the chew and the light, blistered crust come from.",
  },
  {
    title: "the flavours",
    body: "Tandoori-spiced paneer next to a classic margherita, on sauce we make in-house. Familiar favourites and bold new ones, so there's a slice for every guest.",
  },
  {
    title: "the station",
    body: "Our signature black and gold, an ivory runner and warm wood boards. A setup that looks as good as the pizza, and one your guests will want to photograph.",
  },
];

export function CraftSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-32">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2 className="max-w-2xl font-display text-4xl leading-none font-semibold md:text-6xl">
            made the slow, traditional way<span className="text-gold">.</span>
          </h2>
          <p className="text-lg leading-relaxed text-ivory-muted md:max-w-sm">
            No shortcuts. Just good ingredients and plenty of time.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 border border-border p-8 md:min-h-80 md:px-8 md:py-10"
            >
              <span className="font-display text-xl text-gold italic">
                N°{i + 1}
              </span>
              <h3 className="font-display text-3xl font-semibold md:text-4xl">
                {step.title}
                <span className="text-gold">.</span>
              </h3>
              <p className="leading-relaxed text-ivory-muted md:text-[17px]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
