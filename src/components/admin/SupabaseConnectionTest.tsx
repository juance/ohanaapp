
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { AlertTriangle, CheckCircle, Database } from 'lucide-react';

export const SupabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // First test direct connection
      const { data: directData, error: directError } = await supabase
        .from('ticket_sequence')
        .select('last_number')
        .limit(1);

      if (directError) {
        throw new Error(`Direct Supabase connection failed: ${directError.message}`);
      }

      // Then test edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('test_connection');

      if (functionError) {
        throw new Error(`Edge function connection failed: ${functionError.message}`);
      }

      setResult({
        directData,
        functionData
      });

      toast.success("Supabase connection successful!");
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || "Unknown connection error");
      toast.error(`Connection error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Test the connection to your Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <strong>Project ID:</strong>
            <span>{import.meta.env.VITE_SUPABASE_URL?.split('.')?.[0]?.split('//')?.[1] || "ebbarmqwvxkxqbzmkiby"}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <strong>Environment URL:</strong>
            <span className="break-all">{import.meta.env.VITE_SUPABASE_URL || "https://ebbarmqwvxkxqbzmkiby.supabase.co"}</span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start mt-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div className="text-red-800 text-sm">
                <p className="font-medium">Error:</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-start mt-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div className="text-green-800 text-sm">
                <p className="font-medium">Connection successful!</p>
                <p className="mt-1">Direct query result: {JSON.stringify(result.directData)}</p>
                <p className="mt-1">Function result: {JSON.stringify(result.functionData)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? "Testing connection..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  );
};
