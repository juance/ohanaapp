
import { useFormState } from '@/hooks/ticket/form/useFormState';
import { useServiceOperations } from '@/hooks/ticket/form/useServiceOperations';
import { usePriceCalculation } from '@/hooks/ticket/form/usePriceCalculation';
import { useTicketSubmission } from '@/hooks/ticket/form/useTicketSubmission';
import { useServiceData } from '@/hooks/ticket/form/useServiceData';

export const useTicketFormLogic = () => {
  // Get form state
  const {
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    selectedServices,
    setSelectedServices,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    selectedLaundryOptions,
    setSelectedLaundryOptions,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    setIsSubmitting,
    resetForm
  } = useFormState();

  // Get service data
  const { laundryServices, dryCleaningOptions, laundryOptionsList, paymentMethods } = useServiceData();

  // Get service operations
  const {
    handleServiceToggle,
    handleDryCleaningToggle,
    handleDryCleaningQuantityChange,
    handleLaundryOptionToggle
  } = useServiceOperations(
    setSelectedServices,
    setSelectedDryCleaningItems,
    setSelectedLaundryOptions
  );

  // Get price calculation
  const { calculateTotal: calculateTotalPrice } = usePriceCalculation();

  // Create calculation function with current state
  const calculateTotal = () => calculateTotalPrice(
    selectedServices,
    selectedDryCleaningItems,
    laundryServices,
    dryCleaningOptions
  );

  // Get ticket submission
  const { handleSubmit } = useTicketSubmission(
    clientName,
    phoneNumber,
    selectedServices,
    selectedDryCleaningItems,
    selectedLaundryOptions,
    paymentMethod,
    laundryServices,
    dryCleaningOptions,
    calculateTotal,
    setIsSubmitting,
    resetForm
  );

  return {
    // Form state
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    selectedServices,
    setSelectedServices,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    selectedLaundryOptions,
    setSelectedLaundryOptions,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    setIsSubmitting,
    
    // Service data
    laundryServices,
    dryCleaningOptions,
    laundryOptionsList,
    paymentMethods,
    
    // Service operations
    handleServiceToggle,
    handleDryCleaningToggle,
    handleDryCleaningQuantityChange,
    handleLaundryOptionToggle,
    
    // Price calculation
    calculateTotal,
    
    // Form submission
    handleSubmit
  };
};
