
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { useQualityControl } from '@/hooks/quality/useQualityControl';

const QualityControl: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [qualityNotes, setQualityNotes] = useState('');
  const [qualityRating, setQualityRating] = useState(5);
  
  const {
    pendingTickets,
    qualityReports,
    createQualityReport,
    uploadPhoto,
    isLoading
  } = useQualityControl();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedTicket) {
      try {
        await uploadPhoto(selectedTicket, file);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  const handleSubmitQuality = async () => {
    if (!selectedTicket) return;
    
    await createQualityReport({
      ticketId: selectedTicket,
      rating: qualityRating,
      notes: qualityNotes,
      inspector: 'Sistema', // En un sistema real, sería el usuario actual
      date: new Date().toISOString()
    });
    
    setQualityNotes('');
    setQualityRating(5);
    setSelectedTicket('');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Control de Calidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inspect">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inspect">Inspeccionar</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inspect" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tickets Pendientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pendingTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          selectedTicket === ticket.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <div className="font-semibold">Ticket #{ticket.ticketNumber}</div>
                        <div className="text-sm text-gray-600">{ticket.clientName}</div>
                        <div className="text-sm text-green-600 font-semibold">
                          ${ticket.total.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inspección</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTicket ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Calificación
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-6 w-6 cursor-pointer ${
                                  star <= qualityRating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setQualityRating(star)}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Notas de Calidad
                          </label>
                          <Textarea
                            value={qualityNotes}
                            onChange={(e) => setQualityNotes(e.target.value)}
                            placeholder="Observaciones sobre la calidad del servicio..."
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Fotos de Control
                          </label>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Camera className="h-4 w-4 mr-2" />
                              Tomar Foto
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Upload className="h-4 w-4 mr-2" />
                              <label htmlFor="photo-upload" className="cursor-pointer">
                                Subir Foto
                              </label>
                              <Input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                            </Button>
                          </div>
                        </div>

                        <Button 
                          onClick={handleSubmitQuality}
                          disabled={isLoading}
                          className="w-full"
                        >
                          Completar Inspección
                        </Button>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        Selecciona un ticket para inspeccionar
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4">
                {qualityReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">
                            Ticket #{report.ticketNumber}
                          </div>
                          <div className="text-sm text-gray-600">
                            Inspector: {report.inspector}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                          {report.notes && (
                            <div className="mt-2 text-sm">{report.notes}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 ${getRatingColor(report.rating)}`}>
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-semibold">{report.rating}/5</span>
                          </div>
                          <Badge 
                            variant={report.rating >= 4 ? "default" : report.rating >= 3 ? "secondary" : "destructive"}
                            className="mt-1"
                          >
                            {report.rating >= 4 ? 'Excelente' : 
                             report.rating >= 3 ? 'Bueno' : 'Necesita Mejora'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControl;
