import { contact } from "@/lib/contact";
import { PRICING, formatMoney } from "@/lib/pricing";
import { siteUrl } from "@/lib/site";

// Tells Google what the business is and where it works (local search).
export function BusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Jass Pizza",
    description:
      "Live pizza catering for weddings, birthdays and corporate events. 12-inch pizzas hand-stretched and baked fresh on site.",
    url: siteUrl,
    logo: `${siteUrl}/logo-round.png`,
    image: `${siteUrl}/opengraph-image.jpg`,
    servesCuisine: "Pizza",
    priceRange: `From ${formatMoney(PRICING.minimum)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brampton",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Brampton" },
      { "@type": "AdministrativeArea", name: "Peel Region" },
      { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
    ],
    sameAs: [contact.instagram, contact.tiktok],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
