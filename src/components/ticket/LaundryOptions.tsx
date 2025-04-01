
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface LaundryOptionsProps {
  separateByColor: boolean;
  setSeparateByColor: (value: boolean) => void;
  delicateDry: boolean;
  setDelicateDry: (value: boolean) => void;
  stainRemoval: boolean;
  setStainRemoval: (value: boolean) => void;
  bleach: boolean;
  setBleach: (value: boolean) => void;
  noFragrance: boolean;
  setNoFragrance: (value: boolean) => void;
  noDry: boolean;
  setNoDry: (value: boolean) => void;
}

export const LaundryOptions: React.FC<LaundryOptionsProps> = ({
  separateByColor,
  setSeparateByColor,
  delicateDry,
  setDelicateDry,
  stainRemoval,
  setStainRemoval,
  bleach,
  setBleach,
  noFragrance,
  setNoFragrance,
  noDry,
  setNoDry
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Opciones de Lavado</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="separateByColor" 
            checked={separateByColor} 
            onCheckedChange={setSeparateByColor}
          />
          <Label htmlFor="separateByColor">Separar por Color</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="delicateDry" 
            checked={delicateDry} 
            onCheckedChange={setDelicateDry}
          />
          <Label htmlFor="delicateDry">Secado Delicado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="stainRemoval" 
            checked={stainRemoval} 
            onCheckedChange={setStainRemoval}
          />
          <Label htmlFor="stainRemoval">Quitamanchas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="bleach" 
            checked={bleach} 
            onCheckedChange={setBleach}
          />
          <Label htmlFor="bleach">Blanquear</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="noFragrance" 
            checked={noFragrance} 
            onCheckedChange={setNoFragrance}
          />
          <Label htmlFor="noFragrance">Sin Perfume</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="noDry" 
            checked={noDry} 
            onCheckedChange={setNoDry}
          />
          <Label htmlFor="noDry">Sin Secar</Label>
        </div>
      </div>
    </div>
  );
};
