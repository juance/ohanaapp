
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Metrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Métricas</h1>
      </div>

      <Card className="border-dashed flex flex-col items-center justify-center py-12">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Análisis de métricas</CardTitle>
        </CardHeader>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          Las métricas completas se han trasladado a la página de análisis de tickets, donde encontrarás información detallada sobre ventas, tickets y más.
        </p>
        <Link to="/analysis">
          <Button className="flex items-center gap-2">
            Ver análisis de tickets
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Metrics;
