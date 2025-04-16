
import React, { useState, useEffect } from 'react';
import { Expense } from '@/lib/types/expense.types';
import { ExpenseCategory } from '@/lib/types/error.types';
import { storeExpense, getStoredExpenses } from '@/lib/data/expenseService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { ArrowLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | null>(0);
  const [date, setDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      const storedExpenses = await getStoredExpenses();
      setExpenses(storedExpenses);
    };

    fetchExpenses();
  }, []);

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

    const result = await storeExpense({
      description,
      amount: parseFloat(amount.toString()),
      date
      // Removed category field as it doesn't exist in the database
    });

    if (result) {
      toast({
        title: "Éxito",
        description: "Gasto agregado correctamente"
      });
      setDescription('');
      setAmount(0);
      setDate('');

      // Refresh expenses list
      const updatedExpenses = await getStoredExpenses();
      setExpenses(updatedExpenses);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al agregar el gasto"
      });
    }

    setIsSubmitting(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver Atrás
        </Button>
        <h1 className="text-2xl font-bold">Gastos</h1>
        <div className="w-24"></div> {/* Spacer para mantener el título centrado */}
      </div>

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

      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de Gastos</h2>
        {expenses.length === 0 ? (
          <p>No hay gastos agregados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
