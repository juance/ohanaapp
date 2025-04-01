
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ClientFormData } from './types';

interface ClientInformationProps {
  clientData: ClientFormData;
  onChange: (field: keyof ClientFormData, value: string) => void;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ clientData, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Information</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientData.clientName}
            onChange={(e) => onChange('clientName', e.target.value)}
            placeholder="Enter client name"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={clientData.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            placeholder="+54 9 11 XXXX XXXX"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
