import { Layout } from "@/components/layout";
import { StoreTable } from "@/components/store-table";
import { useQuery } from "@tanstack/react-query";
import { Store, Rating } from "@shared/schema";

export default function Stores() {
  const { data: stores } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: ratings } = useQuery<Rating[]>({
    queryKey: ["/api/stores/ratings"],
  });

  const averageRatings = ratings
    ? ratings.reduce((acc, rating) => {
        if (!acc[rating.storeId]) {
          acc[rating.storeId] = { sum: 0, count: 0 };
        }
        acc[rating.storeId].sum += rating.rating;
        acc[rating.storeId].count += 1;
        return acc;
      }, {} as Record<number, { sum: number; count: number }>)
    : {};

  const ratingAverages = Object.entries(averageRatings).reduce(
    (acc, [storeId, { sum, count }]) => {
      acc[parseInt(storeId)] = sum / count;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Stores</h1>
        {stores && <StoreTable stores={stores} ratings={ratingAverages} />}
      </div>
    </Layout>
  );
}
