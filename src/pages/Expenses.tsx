
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeExpense, getStoredExpenses } from '@/lib/expenseService';
import { format } from 'date-fns';

const Expenses = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch expenses data
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getStoredExpenses()
  });
  
  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: storeExpense,
    onSuccess: () => {
      toast.success('Gasto agregado correctamente');
      // Reset form
      setDescription('');
      setAmount('');
      // Refetch expenses
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error('Error al agregar el gasto');
      console.error('Error adding expense:', error);
    }
  });
  
  const handleAddExpense = () => {
    if (!description) {
      toast.error('Debe ingresar una descripción');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Debe ingresar un monto válido');
      return;
    }
    
    addExpenseMutation.mutate({
      description,
      amount: Number(amount),
      date: new Date().toISOString()
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Control de Gastos</h1>
              <p className="text-gray-500">Gestión de gastos del negocio</p>
            </div>
          </header>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Registrar Nuevo Gasto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descripción del gasto"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto ($)</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={handleAddExpense}
                      disabled={addExpenseMutation.isPending}
                    >
                      {addExpenseMutation.isPending ? 'Guardando...' : 'Registrar Gasto'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Gastos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Cargando gastos...</div>
                  ) : !expenses || expenses.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay gastos registrados
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell className="font-medium whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                  <span>{format(new Date(expense.date), 'dd/MM/yyyy')}</span>
                                </div>
                              </TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell className="text-right font-medium">
                                ${expense.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
