
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientInfoProps {
  clientName: string;
  setClientName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({
  clientName,
  setClientName,
  phoneNumber,
  setPhoneNumber
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Information</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+54 9 11 XXXX XXXX"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
