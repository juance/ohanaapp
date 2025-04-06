
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TicketFormFooterProps {
  calculateTotal: () => number;
  isSubmitting: boolean;
}

const TicketFormFooter: React.FC<TicketFormFooterProps> = ({
  calculateTotal,
  isSubmitting
}) => {
  return (
    <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
      <div className="text-lg font-medium">
        Total: <span className="text-laundry-700">${calculateTotal()}</span>
      </div>
      <Button
        type="submit"
        className="bg-laundry-500 hover:bg-laundry-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Create Ticket
          </span>
        )}
      </Button>
    </div>
  );
};

export default TicketFormFooter;
