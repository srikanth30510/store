import { Layout } from "@/components/layout";
import { DashboardStats } from "@/components/dashboard-stats";
import { useAuth } from "@/hooks/use-auth";
import { StoreTable } from "@/components/store-table";
import { useQuery } from "@tanstack/react-query";
import { Store, Rating } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stores } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: ratings } = useQuery<Rating[]>({
    queryKey: ["/api/stores", user?.id, "ratings"],
    enabled: user?.role === "store_owner",
  });

  const storeRatings = ratings?.reduce((acc, rating) => {
    if (!acc[rating.storeId]) {
      acc[rating.storeId] = [];
    }
    acc[rating.storeId].push(rating.rating);
    return acc;
  }, {} as Record<number, number[]>);

  const averageRatings = storeRatings
    ? Object.entries(storeRatings).reduce((acc, [storeId, ratings]) => {
        acc[parseInt(storeId)] =
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        return acc;
      }, {} as Record<number, number>)
    : {};

  return (
    <Layout>
      <div className="space-y-8">
        {user?.role === "admin" && (
          <>
            <h1 className="text-3xl font-bold">System Overview</h1>
            <DashboardStats />
          </>
        )}

        {user?.role === "store_owner" && (
          <>
            <h1 className="text-3xl font-bold">Your Store Statistics</h1>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Store Ratings</h2>
              {stores && (
                <StoreTable
                  stores={stores.filter((store) => store.ownerId === user.id)}
                  ratings={averageRatings}
                />
              )}
            </div>
          </>
        )}

        {user?.role === "user" && (
          <>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Store Activity</h2>
              {stores && <StoreTable stores={stores} />}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
