
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

export const GeneralSettings = () => {
  const [businessName, setBusinessName] = useState("Lavandería Ohana");
  const [address, setAddress] = useState("Camargo 590, Villa Crespo");
  const [phone, setPhone] = useState("1136424871");
  const [email, setEmail] = useState("lav.camargo@gmail.com");
  const [welcomeMessage, setWelcomeMessage] = useState("Bienvenido a Lavandería Ohana, donde cuidamos tu ropa como si fuera nuestra.");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to Supabase
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          business_name: businessName,
          address,
          phone,
          email,
          welcome_message: welcomeMessage,
          notifications_enabled: notifications,
          dark_mode_enabled: darkMode,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Cambios guardados",
        description: "La configuración ha sido actualizada correctamente."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios. Intente nuevamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setBusinessName("Lavandería Ohana");
    setAddress("Camargo 590, Villa Crespo");
    setPhone("1136424871");
    setEmail("lav.camargo@gmail.com");
    setWelcomeMessage("Bienvenido a Lavandería Ohana, donde cuidamos tu ropa como si fuera nuestra.");
    setNotifications(true);
    setDarkMode(false);
    
    toast({
      title: "Valores restablecidos",
      description: "Los valores han sido restablecidos a los predeterminados."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Ajustes Generales</CardTitle>
        <p className="text-muted-foreground">Configuración básica del sistema</p>
        <span className="text-xs text-muted-foreground">v1.0.0</span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre del Negocio</Label>
            <Input 
              id="businessName" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              value={email} 
              type="email"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
          <Textarea 
            id="welcomeMessage" 
            value={welcomeMessage} 
            onChange={(e) => setWelcomeMessage(e.target.value)} 
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Este mensaje aparecerá en la página de inicio para dar la bienvenida a los usuarios.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications" className="flex-1">Notificaciones</Label>
            <Switch 
              id="notifications" 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
            <span className="text-xs text-muted-foreground ml-2">Activar alertas del sistema</span>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="darkMode" className="flex-1">Modo Oscuro</Label>
            <Switch 
              id="darkMode" 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
            <span className="text-xs text-muted-foreground ml-2">Interfaz con tema oscuro</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="language" className="flex-1">Idioma</Label>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">Predeterminado</span>
            <span className="text-xs text-muted-foreground">Español</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleReset}>
            Restablecer
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
