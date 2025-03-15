import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Store } from "@shared/schema";
import { StoreRating } from "./store-rating";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface StoreTableProps {
  stores: Store[];
  ratings?: Record<number, number>;
}

export function StoreTable({ stores, ratings }: StoreTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Store>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { user } = useAuth();

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStores = [...filteredStores].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: keyof Store) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search stores by name or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("name")}
            >
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => toggleSort("address")}
            >
              Address {sortField === "address" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Rating</TableHead>
            {user?.role === "user" && <TableHead>Your Rating</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.name}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{ratings?.[store.id] || "No ratings"}</TableCell>
              {user?.role === "user" && (
                <TableCell>
                  <StoreRating
                    storeId={store.id}
                    currentRating={0}
                    disabled={user.role !== "user"}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
