import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star } from "lucide-react";

export function DashboardStats() {
  const { data: users } = useQuery<any[]>({ 
    queryKey: ["/api/users"],
  });

  const { data: stores } = useQuery<any[]>({ 
    queryKey: ["/api/stores"],
  });

  const stats = [
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: Users,
    },
    {
      title: "Total Stores",
      value: stores?.length || 0,
      icon: Store,
    },
    {
      title: "Total Ratings",
      value: "Coming soon",
      icon: Star,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
