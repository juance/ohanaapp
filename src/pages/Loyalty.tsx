
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loading } from '@/components/ui/loading';
import { Card } from '@/components/ui/card';
import CustomerSearch from '@/components/loyalty/CustomerSearch';
import CustomerDetails from '@/components/loyalty/CustomerDetails';
import LoyaltyPoints from '@/components/loyalty/LoyaltyPoints';
import { useLoyaltyCustomer } from '@/hooks/useLoyaltyCustomer';

const Loyalty = () => {
  const {
    phone,
    setPhone,
    loading,
    searchResult,
    redeeming,
    handleSearch,
    handleRedeemValet
  } = useLoyaltyCustomer();
  
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
            <CustomerSearch 
              phone={phone}
              setPhone={setPhone}
              handleSearch={handleSearch}
              loading={loading}
            />
            
            {loading ? (
              <Card className="md:col-span-2 flex justify-center items-center p-8">
                <Loading />
              </Card>
            ) : searchResult ? (
              <>
                <CustomerDetails 
                  name={searchResult.name}
                  phone={searchResult.phone}
                  valetsCount={searchResult.valets_count}
                />
                
                <LoyaltyPoints 
                  loyaltyPoints={searchResult.loyalty_points}
                  freeValets={searchResult.free_valets}
                  handleRedeemValet={handleRedeemValet}
                  redeeming={redeeming}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
