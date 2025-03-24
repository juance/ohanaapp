import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Award, Gift, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  loyalty_points: number;
  free_valets: number;
  valets_count: number;
  valets_redeemed: number | null;
}

const Loyalty = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<LoyaltyCustomer | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  
  const handleSearch = async () => {
    if (!phone || phone.length < 8) {
      toast.error('Por favor ingrese un número de teléfono válido');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSearchResult(data as LoyaltyCustomer);
      } else {
        toast.error('Cliente no encontrado');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching for customer:', error);
      toast.error('Error al buscar cliente');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRedeemValet = async () => {
    if (!searchResult) return;
    
    setRedeeming(true);
    try {
      // Update customer's free_valets count
      const { error } = await supabase
        .from('customers')
        .update({ 
          free_valets: searchResult.free_valets + 1,
          loyalty_points: Math.max(0, searchResult.loyalty_points - 100), // Subtract 100 points
          valets_redeemed: (searchResult.valets_redeemed || 0) + 1
        })
        .eq('id', searchResult.id);
      
      if (error) throw error;
      
      toast.success('¡Valet gratis canjeado con éxito!');
      
      // Refresh customer data
      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', searchResult.id)
        .single();
      
      if (fetchError) throw fetchError;
      setSearchResult(data as LoyaltyCustomer);
      
    } catch (error) {
      console.error('Error redeeming free valet:', error);
      toast.error('Error al canjear valet gratis');
    } finally {
      setRedeeming(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Programa de Fidelidad</h1>
            <p className="text-gray-500">Gestión de puntos y recompensas para clientes</p>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center gap-4">
                <Award className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle>Búsqueda de Cliente</CardTitle>
                  <CardDescription>Ingrese el número de teléfono del cliente para consultar su estado de fidelidad</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="Ej: 11 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {loading ? (
              <Card className="md:col-span-2 flex justify-center items-center p-8">
                <Loading />
              </Card>
            ) : searchResult ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                    <CardDescription>Datos del cliente y estado actual</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label>Nombre</Label>
                      <p className="text-lg font-medium">{searchResult.name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Teléfono</Label>
                      <p className="text-lg font-medium">{searchResult.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Valets Realizados</Label>
                      <p className="text-lg font-medium">{searchResult.valets_count}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5 text-yellow-500" />
                      Puntos de Fidelidad
                    </CardTitle>
                    <CardDescription>
                      Por cada valet el cliente acumula 10 puntos. Con 100 puntos puede canjear un valet gratis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <h3 className="text-muted-foreground text-sm">Puntos</h3>
                        <p className="text-3xl font-bold">{searchResult.loyalty_points}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${Math.min(100, (searchResult.loyalty_points % 100))}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-center mt-1">
                          {searchResult.loyalty_points >= 100 
                            ? '¡Puede canjear un valet gratis!' 
                            : `${100 - (searchResult.loyalty_points % 100)} puntos más para un valet gratis`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-muted-foreground text-sm">Valets Gratis Disponibles</h3>
                        <p className="text-2xl font-bold">{searchResult.free_valets}</p>
                      </div>
                      <Button
                        variant="outline"
                        disabled={searchResult.loyalty_points < 100 || redeeming}
                        onClick={handleRedeemValet}
                        className="flex items-center"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        {redeeming ? 'Procesando...' : 'Canjear Valet Gratis'}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Los valets gratis se podrán utilizar en el formulario de tickets seleccionando la opción correspondiente.
                  </CardFooter>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
