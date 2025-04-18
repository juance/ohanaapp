import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/lib/toast";
import { AlertTriangle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const TicketSettings = () => {
  const [noRetired45Days, setNoRetired45Days] = React.useState(0);
  const [noRetired90Days, setNoRetired90Days] = React.useState(0);

  React.useEffect(() => {
    loadUnretiredTickets();
  }, []);

  const loadUnretiredTickets = async () => {
    try {
      const now = new Date();

      const date45DaysAgo = new Date(now);
      date45DaysAgo.setDate(now.getDate() - 45);

      const date90DaysAgo = new Date(now);
      date90DaysAgo.setDate(now.getDate() - 90);

      const { data: tickets45Days, error: error45Days } = await supabase
        .from('tickets')
        .select('id')
        .eq('status', 'ready')
        .eq('is_canceled', false)
        .lt('date', date45DaysAgo.toISOString())
        .gte('date', date90DaysAgo.toISOString());

      if (error45Days) throw error45Days;

      const { data: tickets90Days, error: error90Days } = await supabase
        .from('tickets')
        .select('id')
        .eq('status', 'ready')
        .eq('is_canceled', false)
        .lt('date', date90DaysAgo.toISOString());

      if (error90Days) throw error90Days;

      setNoRetired45Days(tickets45Days?.length || 0);
      setNoRetired90Days(tickets90Days?.length || 0);
    } catch (error) {
      console.error("Error loading unretired tickets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los tickets no retirados."
      });
    }
  };



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle>Alertas de Tickets No Retirados</CardTitle>
          </div>
          <CardDescription>
            Tickets que no han sido retirados por los clientes después de 45 y 90 días
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-lg border p-4 ${noRetired45Days > 0 ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">Tickets sin retirar por más de 45 días</h3>
              </div>

              {noRetired45Days > 0 ? (
                <p className="text-sm">
                  Hay <strong>{noRetired45Days}</strong> tickets que no han sido retirados en los últimos 45 días.
                </p>
              ) : (
                <p className="text-sm text-amber-700">No hay tickets sin retirar desde hace 45 días.</p>
              )}
            </div>

            <div className={`rounded-lg border p-4 ${noRetired90Days > 0 ? 'bg-amber-50' : ''}`}>
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-medium">Tickets sin retirar por más de 90 días (prendas a donar)</h3>
              </div>

              {noRetired90Days > 0 ? (
                <p className="text-sm">
                  Hay <strong>{noRetired90Days}</strong> tickets con prendas que pueden ser donadas.
                </p>
              ) : (
                <p className="text-sm text-amber-700">No hay tickets sin retirar desde hace 90 días.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};
