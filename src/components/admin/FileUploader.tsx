
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Image, CheckCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo para subir');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulamos el análisis del archivo (en un caso real, aquí se conectaría con un servicio de OCR)
      // Crear un nombre único para el archivo usando la fecha y nombre original
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Para una implementación real con Supabase Storage:
      // 1. Primero verificaríamos si existe el bucket, sino lo crearemos
      // 2. Luego subiríamos el archivo

      // Esperamos un poco para simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (file.type.startsWith('image/')) {
        // Simular extracción de datos dependiendo del tipo de imagen
        let simulatedData = {
          tipo: 'Factura',
          fecha: new Date().toLocaleDateString(),
          cliente: 'Cliente Simulado',
          total: Math.floor(Math.random() * 10000) + 1000
        };
        
        setExtractedData(simulatedData);
        setUploadedFileUrl(preview);
      }
      
      toast.success('Archivo procesado correctamente');
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      toast.error('Error al procesar el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (!preview) return null;
    
    if (file?.type.startsWith('image/')) {
      return (
        <div className="mt-4 overflow-hidden rounded-md border">
          <img 
            src={preview} 
            alt="Vista previa" 
            className="h-auto max-h-64 w-full object-contain"
          />
        </div>
      );
    }
    
    return (
      <div className="mt-4 flex items-center justify-center rounded-md border p-4">
        <FileText className="mr-2 h-6 w-6 text-muted-foreground" />
        <span className="text-sm">{file?.name}</span>
      </div>
    );
  };

  const renderExtractedData = () => {
    if (!extractedData) return null;
    
    return (
      <div className="mt-4 rounded-md border p-4">
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="font-medium">Datos Extraídos</h3>
        </div>
        <div className="mt-2 space-y-1 text-sm">
          {Object.entries(extractedData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir y Analizar Documentos</CardTitle>
        <CardDescription>
          Sube imágenes de facturas o tickets para extraer datos automáticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="file" className="text-sm font-medium">
              Selecciona un archivo
            </label>
            <Input 
              id="file" 
              type="file" 
              onChange={handleFileChange} 
              accept="image/*"
              disabled={isUploading}
            />
          </div>
          
          {renderPreview()}
          {renderExtractedData()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isUploading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="flex items-center"
        >
          {isUploading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Procesando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Procesar Archivo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
