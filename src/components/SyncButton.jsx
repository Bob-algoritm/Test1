import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n.jsx";

export default function SyncButton() {
  const { t } = useLang();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("syncAirtableUnits", {});
      const data = res.data || {};
      toast({
        title: t("matrix.syncDone", {
          created: data.created ?? 0,
          updated: data.updated ?? 0,
        }),
      });
      await queryClient.invalidateQueries();
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("matrix.syncError"),
        description: err?.response?.data?.error || err?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={loading}
      className="gap-2"
    >
      <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
      {t("matrix.sync")}
    </Button>
  );
}