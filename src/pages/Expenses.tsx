
import React from 'react';
import Navbar from '@/components/Navbar';
import { useExpensesData } from '@/hooks/useExpensesData';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';

const Expenses: React.FC = () => {
  const { 
    expenses, 
    loading, 
    error, 
    refreshData,
    addExpense,
    totalExpenses
  } = useExpensesData();
  
  const handleRefreshData = async () => {
    toast("Actualizando datos de gastos...");
    try {
      await refreshData();
      toast("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast("Error al actualizar los datos");
    }
  };
  
  const handleAddSampleExpense = async () => {
    try {
      const sampleExpense = {
        description: `Gasto ${Math.floor(Math.random() * 1000)}`,
        amount: Math.floor(Math.random() * 10000) / 100,
        date: new Date().toISOString()
      };
      
      toast("Añadiendo gasto de ejemplo...");
      await addExpense(sampleExpense);
      toast("Gasto añadido correctamente");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast("Error al añadir el gasto");
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto">
          <header className="mb-8">
            <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Gastos</h1>
            <p className="text-gray-500">Administra los gastos del negocio</p>
          </header>
          
          <div className="mb-6 flex flex-wrap gap-4">
            <Button onClick={handleRefreshData} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar Datos</span>
            </Button>
            
            <Button variant="outline" onClick={handleAddSampleExpense}>
              Añadir Gasto de Ejemplo
            </Button>
          </div>
          
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
              <p className="text-red-700">{error.message}</p>
              
              <Button 
                variant="destructive" 
                className="mt-4"
                onClick={handleRefreshData}
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Gasto Total</h2>
                <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Lista de Gastos</h2>
                
                {expenses.length === 0 ? (
                  <p>No hay gastos registrados</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left">Descripción</th>
                          <th className="pb-2 text-left">Monto</th>
                          <th className="pb-2 text-left">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{expense.description}</td>
                            <td className="py-2">${expense.amount.toFixed(2)}</td>
                            <td className="py-2">{new Date(expense.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
