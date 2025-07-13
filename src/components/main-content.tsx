import { TrendingSongs } from "@/components/trending-songs";
import { PopularArtists } from "@/components/popular-artists";
import { PopularAlbums } from "@/components/popular-albums";
import { PopularRadio } from "@/components/popular-radio";
import { FeaturedCharts } from "@/components/featured-charts";
import { GetLoud } from "@/components/get-loud";

export function MainContent() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-zinc-900/20 to-black">
      <div className="p-6 space-y-8">
        <div className="pt-4">
          <h1 className="text-3xl font-bold text-white mb-2">Home</h1>
        </div>

        <TrendingSongs />
        <PopularArtists />
        <PopularAlbums />
        <PopularRadio />
        <FeaturedCharts />
        <GetLoud />

        <div className="h-32" />
      </div>
    </div>
  );
}
