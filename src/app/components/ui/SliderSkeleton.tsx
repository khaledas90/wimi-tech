// components/shared/HomeSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SliderSkeleton = () => {
  return (
    <div className="p-4 space-y-6 animate-pulse flex justify-center flex-col items-center">

      <Skeleton height={30} width={150} />

      <div className="flex gap-4 overflow-x-auto flex-wrap justify-center mx-[350px]">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} height={200} width={250} borderRadius={16} />
        ))}
      </div>

      <Skeleton height={180} borderRadius={12} />

      <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} circle height={80} width={80} />
        ))}
      </div>
      <Skeleton height={30} width={150} />

      <div className="flex gap-4 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height={200} width={250} borderRadius={16} />
        ))}
      </div>
    </div>
  );
};

export default SliderSkeleton;
