import Image from "next/image";

// To add a photo: put it in public/menu/ and add e.g. image: "/menu/margherita.jpg"
type MenuItem = { title: string; description: string; image?: string };

const menu: MenuItem[] = [
  {
    title: "Classic Margherita",
    description: "Tomato sauce, fresh mozzarella, basil, olive oil.",
    image: "/menu/margherita.png",
  },
  {
    title: "Cheese Pizza",
    description: "Tomato sauce, a blend of mozzarella and parmesan.",
  },
  {
    title: "Roasted Garlic Bianca",
    description: "Roasted garlic white sauce, mushrooms, mozzarella.",
  },
  {
    title: "Paneer Tikka Delight",
    description:
      "Tomato sauce, tandoori paneer, bell peppers, onions, mozzarella.",
  },
  {
    title: "Classic Pepperoni",
    description: "Tomato sauce, mozzarella, pepperoni.",
    image: "/menu/pepperoni.png",
  },
  {
    title: "Tandoori Chicken Twist",
    description:
      "Tomato sauce, tandoori chicken, onions, cilantro, mozzarella.",
    image: "/menu/chicken.png",
  },
  {
    title: "Garden Veggie Classic",
    description: "Tomato sauce, bell peppers, onions, mushrooms, mozzarella.",
    image: "/menu/veggie.png",
  },
];

const addOns = [
  {
    title: "Fresh-Filled Cannoli",
    description:
      "House-made ricotta filling, piped fresh at your event and finished with pistachio or chocolate chips.",
  },
];

export function MenuSection() {
  return (
    <section id="menu" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-32">
        <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
          The menu
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2 className="font-display text-4xl leading-none font-semibold md:text-6xl">
            pick your pies<span className="text-gold">.</span>
          </h2>
          <p className="text-lg leading-relaxed text-ivory-muted md:max-w-sm md:text-right">
            Every sauce and dough made in-house. Choose up to four for your
            event.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:gap-x-7 md:gap-y-14 lg:grid-cols-4">
          {menu.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 md:gap-4">
              <div className="relative aspect-4/4 overflow-hidden border border-border bg-secondary">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center text-2xl text-gold/40"
                  >
                    ✦
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl font-semibold md:text-2xl lg:text-3xl">
                {item.title}
                <span className="text-gold">.</span>
              </h3>
              <p className="text-sm leading-relaxed text-ivory-muted md:text-base">
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-gold/50 pt-8 md:mt-16">
          <p className="text-[13px] tracking-[0.25em] text-gold uppercase">
            Add-on
          </p>
          <ul className="mt-4 flex flex-col gap-6">
            {addOns.map((item) => (
              <li key={item.title} className="flex flex-col gap-2">
                <h3 className="font-display text-2xl text-gold italic md:text-3xl">
                  {item.title}.
                </h3>
                <p className="max-w-xl leading-relaxed text-ivory-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
