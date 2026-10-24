type Review = { name: string; rating: number; text: string; date: string; event: string };

// Copied from our Google reviews. Leave out any review that mentions a price.
const reviews: Review[] = [
  {
    name: "Bhavini M.",
    rating: 5,
    date: "August 2026",
    text: "We hired Jass Pizza for our baby shower at Heartlake Conservation, and we honestly couldn’t have been happier with them! 🍕\n\nDespite the horrible weather, they showed up and served some seriously amazing pizza. We chose a selection of four different pizzas, and every single one was a hit. Our family and friends couldn’t stop talking about how good it was!\n\nFrom our very first interaction, Jass Pizza was professional, friendly, and so easy to work with. Even when a few last-minute roadblocks came up, they handled everything quickly and without any stress on our end.\n\nThey were such a great addition to our special day, and we would absolutely recommend Jass Pizza to anyone looking for great food and great service!",
    event: "Bridal shower",
  },
  {
    name: "Jeety G.",
    rating: 5,
    date: "October 2026",
    text: "We had an amazing experience with Jass pizza, they came for a house event we had and did an absolutely amazing job. They were on time and very professional, the set up did looked amazing and the pizzas themselves tasted incredible. Overall one of the best experience we've had with any vendor and we cannot wait to have them come out to our next event.",
    event: "Pre-wedding maiyan",
  },
  {
    name: "Pam B.",
    rating: 5,
    date: "October 2026",
    text: "Hired Jass Pizza for a house party. He was very responsive while booking. They were on time, professional and friendly. Guests praised his pizza dough! Great experience- highly recommend",
    event: "House party",
  },
  {
    name: "Babneet",
    rating: 5,
    date: "September 2026",
    text: "All the pizza was amazing my entire family loved it was so nice for an event I had at my house !!! Would highly recommend! Jas’s and his entire team were amazing !!!",
    event: "Pre-wedding churra ceremony",
  },
  {
    name: "Sukhdeep H.",
    rating: 5,
    date: "August 2026",
    text: "I hired them for my friend's party. The duo was incredible. They were so professional and on time. Not to forget, their pizza was delicious.",
    event: "House party",
  },
];

export function ReviewsSection() {
  return (
    <section aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <h2
          id="reviews-heading"
          className="font-display text-4xl leading-none font-semibold md:text-6xl"
        >
          Reviews<span className="text-gold">.</span>
        </h2>

        <ul className="mt-8 columns-1 gap-4 md:mt-10 md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <li key={review.name} className="mb-2 break-inside-avoid">
              <figure className="flex flex-col gap-1 border border-border bg-card p-6 md:gap-4">
                <p className="text-gold">
                  <span className="sr-only">{review.rating} out of 5 stars</span>
                  <span aria-hidden="true" className="tracking-[0.2em]">
                    {"★".repeat(review.rating)}
                  </span>
                </p>

                <blockquote className="font-display leading-relaxed whitespace-pre-line italic md:text-lg">
                  “{review.text}”
                </blockquote>

                <figcaption className="flex flex-col gap-1 text-sm">
                  <span className="text-gold">{review.name}</span>
                  <span className="text-muted-foreground">
                    {review.event} · {review.date}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
