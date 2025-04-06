
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { ArrowLeft, Calendar as CalendarFull, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeExpense, getStoredExpenses } from '@/lib/dataService';
import { format } from 'date-fns';
import { getCurrentUser } from '@/lib/auth';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

const Expenses = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    setIsComponentMounted(true);
    const checkAdmin = async () => {
      try {
        const user = await getCurrentUser();
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };
    checkAdmin();
    return () => setIsComponentMounted(false);
  }, []);
  
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getStoredExpenses(),
    retry: 1,
    staleTime: 30000,
  });
  
  const addExpenseMutation = useMutation({
    mutationFn: (expenseData: {description: string; amount: number; date: string}) => storeExpense(expenseData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gasto agregado correctamente"
      });
      setDescription('');
      setAmount('');
      setDate(new Date());
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al agregar el gasto"
      });
      console.error('Error adding expense:', error);
    }
  });
  
  const handleAddExpense = () => {
    if (!description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe ingresar una descripción"
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe ingresar un monto válido"
      });
      return;
    }
    
    addExpenseMutation.mutate({
      description,
      amount: Number(amount),
      date: date.toISOString()
    });
  };

  if (!isComponentMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : <span>Seleccionar fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
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
                    <div className="flex justify-center py-8">
                      <Loading />
                    </div>
                  ) : error ? (
                    <ErrorMessage message="Error al cargar los gastos" />
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
                                  <CalendarFull className="h-3.5 w-3.5 text-gray-500" />
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
