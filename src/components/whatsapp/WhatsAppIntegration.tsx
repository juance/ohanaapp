
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Phone, Calendar, Settings } from 'lucide-react';
import { useWhatsAppIntegration } from '@/hooks/whatsapp/useWhatsAppIntegration';

const WhatsAppIntegration: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  
  const {
    customers,
    messageTemplates,
    sentMessages,
    sendMessage,
    scheduleMessage,
    createTemplate,
    isLoading
  } = useWhatsAppIntegration();

  const handleSendMessage = async () => {
    if (!message.trim() || selectedCustomers.length === 0) return;
    
    for (const customerId of selectedCustomers) {
      await sendMessage(customerId, message);
    }
    
    setMessage('');
    setSelectedCustomers([]);
  };

  const handleScheduleMessage = async () => {
    if (!message.trim() || selectedCustomers.length === 0 || !scheduledDate) return;
    
    await scheduleMessage(selectedCustomers, message, scheduledDate);
    setMessage('');
    setSelectedCustomers([]);
    setScheduledDate('');
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-green-600" />
            WhatsApp Business
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="compose">Componer</TabsTrigger>
              <TabsTrigger value="templates">Plantillas</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seleccionar Clientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedCustomers.includes(customer.id) 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleCustomerSelection(customer.id)}
                      >
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.phoneNumber}</div>
                        {customer.hasActiveOrder && (
                          <Badge variant="secondary" className="mt-1">
                            Orden Activa
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mensaje</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                    />
                    
                    <div className="text-sm text-gray-600">
                      Caracteres: {message.length} | Clientes seleccionados: {selectedCustomers.length}
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSendMessage}
                          disabled={isLoading || !message.trim() || selectedCustomers.length === 0}
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Ahora
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleScheduleMessage}
                          disabled={isLoading || !message.trim() || selectedCustomers.length === 0 || !scheduledDate}
                          variant="outline"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Programar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                {messageTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">{template.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {template.content}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMessage(template.content)}
                        >
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="grid gap-4">
                {sentMessages.map((msg) => (
                  <Card key={msg.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{msg.customerName}</div>
                          <div className="text-sm text-gray-600">{msg.phoneNumber}</div>
                          <div className="text-sm mt-2">{msg.content}</div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(msg.sentAt).toLocaleDateString()}
                          <br />
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">
                        Configuración de WhatsApp Business
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Para usar esta funcionalidad, necesitas configurar tu número de WhatsApp Business
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
