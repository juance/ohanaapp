
export const useServiceData = () => {
  // Mock laundry services
  const laundryServices = [
    { id: '1', name: 'Washing', price: 15 },
    { id: '2', name: 'Drying', price: 10 },
    { id: '3', name: 'Ironing', price: 20 },
    { id: '4', name: 'Folding', price: 5 },
    { id: '5', name: 'Stain Removal', price: 25 },
    { id: '6', name: 'Blanket Cleaning', price: 35 },
  ];

  // Dry cleaning items
  const dryCleaningOptions = [
    { id: 'shirt', name: 'Shirt', price: 20 },
    { id: 'pants', name: 'Pants', price: 25 },
    { id: 'suit', name: 'Suit', price: 45 },
    { id: 'dress', name: 'Dress', price: 35 },
    { id: 'coat', name: 'Coat', price: 50 },
    { id: 'blanket', name: 'Blanket', price: 40 },
  ];

  // Laundry options
  const laundryOptionsList = [
    { id: 'color_separation', label: 'Color Separation' },
    { id: 'delicate_wash', label: 'Delicate Wash' },
    { id: 'extra_rinse', label: 'Extra Rinse' },
    { id: 'heavy_soil', label: 'Heavy Soil Treatment' },
    { id: 'stain_treatment', label: 'Stain Treatment' },
  ];

  // Payment method options
  const paymentMethods = [
    { id: 'cash', label: 'Cash' },
    { id: 'debit', label: 'Debit Card' },
    { id: 'mercado_pago', label: 'Mercado Pago' },
    { id: 'cuenta_dni', label: 'Cuenta DNI' },
  ];

  return {
    laundryServices,
    dryCleaningOptions,
    laundryOptionsList,
    paymentMethods
  };
};
