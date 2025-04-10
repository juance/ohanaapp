/**
 * Formats a phone number to ensure it has the correct format
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // If it already starts with +549, return as is
  if (phoneNumber.startsWith('+549')) {
    return phoneNumber;
  }
  
  // If it starts with +, replace with +549
  if (phoneNumber.startsWith('+')) {
    return '+549' + phoneNumber.substring(1);
  }
  
  // Otherwise, add +549 prefix
  return '+549' + phoneNumber;
};

/**
 * Creates compatibility between phone and phoneNumber fields
 * This helps bridge the gap between old code using phoneNumber and new code using phone
 */
export const compatiblePhone = (customer: any): any => {
  // If we receive an object with 'phone', add a 'phoneNumber' field
  if (customer && customer.phone && !customer.phoneNumber) {
    return {
      ...customer,
      phoneNumber: customer.phone
    };
  }
  
  // If we receive an object with 'phoneNumber', add a 'phone' field
  if (customer && customer.phoneNumber && !customer.phone) {
    return {
      ...customer,
      phone: customer.phoneNumber
    };
  }
  
  return customer;
};
