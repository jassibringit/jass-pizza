import { CraftSection } from "@/components/craft-section";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { MenuSection } from "@/components/menu-section";
import { OccasionsStrip } from "@/components/occasions-strip";
import { QuoteSection } from "@/components/quote-section";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <OccasionsStrip />
        {/* <CraftSection /> */}
        <MenuSection />
        <HowItWorks />
        <ReviewsSection />
        <QuoteSection />
      </main>
    </>
  );
}
