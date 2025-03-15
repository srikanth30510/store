import { Layout } from "@/components/layout";
import { UserTable } from "@/components/user-table";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function Users() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        {users && <UserTable users={users} />}
      </div>
    </Layout>
  );
}
