
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ClientInfo from './ticket/form/ClientInfo';
import ServicesSection from './ticket/form/ServicesSection';
import DryCleaningSection from './ticket/form/DryCleaningSection';
import LaundryOptionsSection from './ticket/form/LaundryOptionsSection';
import PaymentSection from './ticket/form/PaymentSection';
import TicketFormFooter from './ticket/form/TicketFormFooter';
import { useTicketFormLogic } from './ticket/form/useTicketFormLogic';
import { PaymentMethod } from '@/lib/types';

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

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'debit', label: 'Débito' },
    { value: 'mercadopago', label: 'Mercado Pago' },
    { value: 'cuenta_dni', label: 'Cuenta DNI' }
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
