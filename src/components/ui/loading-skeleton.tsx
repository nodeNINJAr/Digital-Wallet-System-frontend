import { Skeleton } from '@/components/ui/skeleton'


export const FeatureCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <Skeleton className="h-12 w-12 rounded-full mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3" />
  </div>
)

export const FAQSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
)

export const HeroSkeleton = () => (
  <div className="text-center space-y-6">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-2/3 mx-auto" />
    <div className="flex justify-center space-x-4">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-32" />
    </div>
  </div>
)


