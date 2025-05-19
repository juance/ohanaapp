
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/lib/types/expense.types';
import { storeExpense } from '@/lib/data/expenseService';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onExpenseAdded }) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | null>(0);
  const [date, setDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor complete todos los campos"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure the date is a valid ISO string
      let dateToUse = date;
      if (dateToUse) {
        try {
          const dateObj = new Date(dateToUse);
          if (!isNaN(dateObj.getTime())) {
            dateToUse = dateObj.toISOString();
          } else {
            dateToUse = new Date().toISOString();
          }
        } catch (dateError) {
          console.error('Error al procesar la fecha:', dateError);
          dateToUse = new Date().toISOString();
        }
      } else {
        dateToUse = new Date().toISOString();
      }

      const result = await storeExpense({
        description,
        amount: parseFloat(amount.toString()),
        date: dateToUse,
        category: 'other' // Add default category
      });

      if (result) {
        toast({
          title: "Éxito",
          description: "Gasto agregado correctamente"
        });
        setDescription('');
        setAmount(0);
        setDate('');
        
        // Notify parent to refresh expenses list
        onExpenseAdded();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al agregar el gasto"
        });
      }
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al agregar el gasto: " + (error instanceof Error ? error.message : 'Error desconocido')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingrese una descripción"
          />
        </div>
        <div>
          <Label htmlFor="amount">Monto</Label>
          <Input
            type="number"
            id="amount"
            value={amount === null ? '' : amount.toString()}
            onChange={(e) => setAmount(e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="Ingrese el monto"
          />
        </div>
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(new Date(date), "PPP") : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(date) => setDate(date?.toISOString() || '')}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? 'Enviando...' : 'Agregar Gasto'}
      </Button>
    </form>
  );
};
