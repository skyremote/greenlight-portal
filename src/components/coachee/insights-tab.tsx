"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { RefreshCw, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InsightsTabProps {
  coacheeId: Id<"coachees">;
  userId: Id<"users">;
  industry?: string;
}

export function InsightsTab({ coacheeId, userId, industry }: InsightsTabProps) {
  const insights = useQuery(api.insights.listByCoachee, { coacheeId });
  const refreshInsights = useMutation(api.insights.refresh);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshInsights({ coacheeId, userId });
      toast.success("Insights refreshed", { description: "New industry insights have been generated." });
    } catch (e) {
      toast.error("Failed to refresh insights");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-500" />
          {industry && <Badge variant="secondary">{industry}</Badge>}
        </div>
        <Button size="sm" variant="secondary" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh Insights
            </>
          )}
        </Button>
      </div>

      {!insights || insights.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon="💡"
              message="No insights yet. Click 'Refresh Insights' to generate industry-relevant insights for this coachee."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card
              key={insight._id}
              className="border-green-500/20 bg-gradient-to-br from-[#2A2A2A] via-[#2A2A2A] to-green-950/10"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-green-400 border-green-500/30"
                  >
                    {insight.source}
                  </Badge>
                </div>
                <CardTitle className="text-base">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {insight.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
