import { CraftSection } from "@/components/craft-section";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { OccasionsStrip } from "@/components/occasions-strip";
import { ReviewsSection } from "@/components/reviews-section";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <OccasionsStrip />
        <CraftSection />
        <MenuSection />
        <ReviewsSection />
      </main>
    </>
  );
}
