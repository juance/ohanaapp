import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ClientInfo from './ticket/form/ClientInfo';
import ServicesSection from './ticket/form/ServicesSection';
import DryCleaningSection from './ticket/form/DryCleaningSection';
import LaundryOptionsSection from './ticket/form/LaundryOptionsSection';
import PaymentSection from './ticket/form/PaymentSection';
import TicketFormFooter from './ticket/form/TicketFormFooter';
import { useTicketFormLogic } from './ticket/form/useTicketFormLogic';
import { PaymentMethod } from '@/lib/types';

interface PaymentMethodOption {
  id: string;
  value: PaymentMethod;
  label: string;
}

const TicketForm = () => {
  const {
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    selectedServices,
    selectedDryCleaningItems,
    selectedLaundryOptions,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    laundryServices,
    dryCleaningOptions,
    laundryOptionsList,
    calculateTotal,
    handleServiceToggle,
    handleDryCleaningToggle,
    handleDryCleaningQuantityChange,
    handleLaundryOptionToggle,
    handleSubmit
  } = useTicketFormLogic();

  const paymentMethods: PaymentMethodOption[] = [
    { id: '1', value: 'cash', label: 'Efectivo' },
    { id: '2', value: 'debit', label: 'Débito' },
    { id: '3', value: 'mercadopago', label: 'Mercado Pago' },
    { id: '4', value: 'cuentaDni', label: 'Cuenta DNI' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6">
            <ClientInfo 
              clientName={clientName}
              setClientName={setClientName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />

            <ServicesSection 
              laundryServices={laundryServices}
              selectedServices={selectedServices}
              handleServiceToggle={handleServiceToggle}
            />

            <DryCleaningSection 
              dryCleaningOptions={dryCleaningOptions}
              selectedDryCleaningItems={selectedDryCleaningItems}
              handleDryCleaningToggle={handleDryCleaningToggle}
              handleDryCleaningQuantityChange={handleDryCleaningQuantityChange}
            />

            <LaundryOptionsSection 
              laundryOptionsList={laundryOptionsList}
              selectedLaundryOptions={selectedLaundryOptions}
              handleLaundryOptionToggle={handleLaundryOptionToggle}
            />

            <PaymentSection 
              paymentMethods={paymentMethods}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
        </CardContent>

        <CardFooter>
          <TicketFormFooter 
            calculateTotal={calculateTotal}
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </Card>
    </form>
  );
};

export default TicketForm;
