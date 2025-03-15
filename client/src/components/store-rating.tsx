import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StoreRatingProps {
  storeId: number;
  currentRating?: number;
  disabled?: boolean;
}

export function StoreRating({ storeId, currentRating, disabled }: StoreRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await apiRequest("POST", `/api/stores/${storeId}/ratings`, { rating });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/ratings`] });
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting rating",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          variant="ghost"
          size="sm"
          disabled={disabled || ratingMutation.isPending}
          className="p-0 h-8 w-8"
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => ratingMutation.mutate(rating)}
        >
          <Star
            className={`h-6 w-6 ${
              rating <= (hoveredRating || currentRating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      ))}
    </div>
  );
}
