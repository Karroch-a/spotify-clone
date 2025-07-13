import { TrendingSongs } from "@/components/trending-songs";
import { PopularArtists } from "@/components/popular-artists";
import { PopularAlbums } from "@/components/popular-albums";
import { PopularRadio } from "@/components/popular-radio";
import { FeaturedCharts } from "@/components/featured-charts";
import { GetLoud } from "@/components/get-loud";

export function MainContent() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-zinc-900/20 to-black">
      <div className="responsive-padding space-y-4 md:space-y-8">
        <div className="space-y-6 md:space-y-8 pt-10">
          <TrendingSongs />
          <PopularArtists />
          <PopularAlbums />
          <PopularRadio />
          <FeaturedCharts />
          <GetLoud />
        </div>

        <div className="h-24 md:h-32" />
      </div>
    </div>
  );
}
