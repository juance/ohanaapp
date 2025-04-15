import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
import { Expense } from '@/lib/types/expense.types';
import { ExpenseCategory } from '@/lib/types/error.types';
import { storeExpense, getStoredExpenses } from '@/lib/data/expenseService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<number | null>(0);
  const [date, setDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

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
      toast.error('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);

    const result = await storeExpense({
      description,
      amount: parseFloat(amount.toString()),
      date,
      category: 'operations' // Adding default category
    });

    if (result) {
      toast.success('Expense added successfully');
      setDescription('');
      setAmount(0);
      setDate('');

      // Refresh expenses list
      const updatedExpenses = await getStoredExpenses();
      setExpenses(updatedExpenses);
    } else {
      toast.error('Failed to add expense');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              value={amount === null ? '' : amount.toString()}
              onChange={(e) => setAmount(e.target.value === '' ? null : parseFloat(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
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
                  {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
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
          {isSubmitting ? 'Submitting...' : 'Add Expense'}
        </Button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Expense List</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
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
