
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingBag,
  DollarSign,
  CreditCard,
  Receipt,
  Award
} from "lucide-react";

interface CounterCheckboxesProps {
  selectedCounters: {
    tickets: boolean;
    paidTickets: boolean;
    revenue: boolean;
    expenses: boolean;
    freeValets: boolean;
  };
  
  allSelected: boolean;
  toggleAll: () => void;
}

export const CounterCheckboxes: React.FC<CounterCheckboxesProps> = ({
  selectedCounters,
  toggleCounter,
  allSelected,
  toggleAll
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="all-counters"
          checked={allSelected}
          onCheckedChange={toggleAll}
        />
        <label
          htmlFor="all-counters"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Seleccionar todos los contadores
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tickets"
            checked={selectedCounters.tickets}
            onCheckedChange={() => toggleCounter('tickets')}
          />
          <label
            htmlFor="tickets"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <ShoppingBag className="h-4 w-4 text-green-500" />
            Tickets
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="paidTickets"
            checked={selectedCounters.paidTickets}
            onCheckedChange={() => toggleCounter('paidTickets')}
          />
          <label
            htmlFor="paidTickets"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Receipt className="h-4 w-4 text-blue-500" />
            Tickets Pagados
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="revenue"
            checked={selectedCounters.revenue}
            onCheckedChange={() => toggleCounter('revenue')}
          />
          <label
            htmlFor="revenue"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <DollarSign className="h-4 w-4 text-yellow-500" />
            Ingresos
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="expenses"
            checked={selectedCounters.expenses}
            onCheckedChange={() => toggleCounter('expenses')}
          />
          <label
            htmlFor="expenses"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <CreditCard className="h-4 w-4 text-red-500" />
            Gastos
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="freeValets"
            checked={selectedCounters.freeValets}
            onCheckedChange={() => toggleCounter('freeValets')}
          />
          <label
            htmlFor="freeValets"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Award className="h-4 w-4 text-purple-500" />
            Valets Gratis
          </label>
        </div>
      </div>
    </div>
  );
};
