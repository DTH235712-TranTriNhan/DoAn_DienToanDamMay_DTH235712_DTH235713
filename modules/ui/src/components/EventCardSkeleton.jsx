import { THEME_COLORS } from "../constants/uiConstants";

const EventCardSkeleton = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md animate-pulse flex flex-col h-full"
      style={{ boxShadow: `0 0 15px ${THEME_COLORS.PRIMARY}05` }}
    >
      {/* Image Skeleton */}
      <div className="h-48 bg-white/5 w-full"></div>

      <div className="p-5 flex flex-col grow">
        {/* Title Skeleton */}
        <div className="h-6 bg-primary/20 rounded w-3/4 mb-4"></div>

      {/* Description Skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-secondary/10 rounded w-full"></div>
        <div className="h-3 bg-secondary/10 rounded w-5/6"></div>
        <div className="h-3 bg-secondary/10 rounded w-4/6"></div>
      </div>

      {/* Info Rows Skeleton */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent/20 rounded"></div>
          <div className="h-3 bg-accent/10 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent/20 rounded"></div>
          <div className="h-3 bg-accent/10 rounded w-2/3"></div>
        </div>
      </div>

      {/* Progress Skeleton */}
      <div className="mt-auto pt-4 border-t border-secondary/10">
        <div className="flex justify-between mb-2">
          <div className="h-2 bg-secondary/20 rounded w-1/4"></div>
          <div className="h-2 bg-secondary/20 rounded w-1/4"></div>
        </div>
        <div className="h-2 bg-secondary/10 rounded-full w-full"></div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-6 h-10 bg-primary/20 rounded-lg w-full"></div>
    </div>
  </div>
);
};

export default EventCardSkeleton;
