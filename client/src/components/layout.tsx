import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { UserCircle, Store, Users, Home, LogOut } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Stores", href: "/stores", icon: Store },
    ...(user?.role === "admin" ? [{ name: "Users", href: "/users", icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-sidebar border-r">
        <nav className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold">Store Ratings</h2>
          </div>
          <div className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle className="h-8 w-8" />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
