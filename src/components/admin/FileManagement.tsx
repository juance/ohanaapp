
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { 
  File, FileText, Image, FileArchive, Trash2, Download, Eye, 
  UploadCloud, FolderPlus, Folder, RefreshCw, Search, X, FileUp
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  created_at: string;
  bucket: string;
  path: string;
}

const FileManagement = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState('documents');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch files from storage
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if the folder exists, if not create it
      const { data: bucketData } = await supabase.storage.getBucket(activeTab);
      if (!bucketData) {
        await supabase.storage.createBucket(activeTab, {
          public: false
        });
      }

      // List files in the bucket
      const { data, error } = await supabase
        .storage
        .from(activeTab)
        .list('', {
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;

      // Convert to our file format
      const fileItems: FileItem[] = data.filter(item => !item.id.endsWith('/')).map(item => ({
        id: item.id,
        name: item.name,
        type: getFileType(item.name),
        size: item.metadata?.size || 0,
        created_at: item.created_at || new Date().toISOString(),
        bucket: activeTab,
        path: item.name
      }));

      setFiles(fileItems);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error fetching files:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab]);

  // Get file type icon based on extension
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return 'image';
    }
    
    // Document types
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
      return 'document';
    }
    
    // Archive types
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return 'archive';
    }
    
    // Spreadsheet types
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'spreadsheet';
    }

    // Default
    return 'file';
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file upload
  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se seleccionaron archivos para subir"
      });
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    try {
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        setUploadProgress(Math.round((i / uploadFiles.length) * 100));

        const { error } = await supabase
          .storage
          .from(selectedFolder)
          .upload(file.name, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Error al subir ${file.name}: ${error.message}`
          });
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Éxito",
          description: `${successCount} de ${uploadFiles.length} archivos subidos correctamente`
        });
        setUploadFiles([]);
        setIsUploadOpen(false);
        fetchFiles();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error in upload process:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error en el proceso de carga: " + error.message
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file deletion
  const handleDelete = async (file: FileItem) => {
    const confirmed = window.confirm(`¿Está seguro de eliminar "${file.name}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .storage
        .from(file.bucket)
        .remove([file.path]);

      if (error) throw error;

      setFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
      toast({
        title: "Éxito",
        description: `Archivo "${file.name}" eliminado correctamente`
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el archivo: " + error.message
      });
    }
  };

  // Get file download URL
  const getFileUrl = async (file: FileItem): Promise<string> => {
    const { data } = await supabase
      .storage
      .from(file.bucket)
      .getPublicUrl(file.path);
    
    return data.publicUrl;
  };

  // Handle file download
  const handleDownload = async (file: FileItem) => {
    try {
      const url = await getFileUrl(file);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error downloading file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al descargar el archivo: " + error.message
      });
    }
  };

  // Handle file preview
  const handlePreview = async (file: FileItem) => {
    try {
      if (file.type === 'image') {
        const url = await getFileUrl(file);
        setPreviewUrl(url);
      } else {
        toast({
          variant: "destructive",
          title: "Vista previa no disponible",
          description: "Solo se pueden previsualizar imágenes"
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error previewing file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al previsualizar el archivo: " + error.message
      });
    }
  };

  // File icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'archive':
        return <FileArchive className="h-5 w-5 text-yellow-500" />;
      case 'spreadsheet':
        return <FileText className="h-5 w-5 text-emerald-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter files by search term
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Administración de Archivos</CardTitle>
          <CardDescription>
            Gestione los archivos del sistema. Suba, descargue o elimine archivos según sea necesario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="images">
                  <Image className="h-4 w-4 mr-2" />
                  Imágenes
                </TabsTrigger>
                <TabsTrigger value="archives">
                  <FileArchive className="h-4 w-4 mr-2" />
                  Archivos
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar archivos..."
                    className="pl-8 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchFiles}
                  className="h-9"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Actualizar
                </Button>
                
                <Button 
                  onClick={() => {
                    setSelectedFolder(activeTab);
                    setIsUploadOpen(true);
                  }}
                  size="sm"
                  className="h-9"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Subir
                </Button>
              </div>
            </div>
            
            <TabsContent value="documents" className="mt-0">
              {renderFileTable()}
            </TabsContent>
            
            <TabsContent value="images" className="mt-0">
              {renderFileTable()}
            </TabsContent>
            
            <TabsContent value="archives" className="mt-0">
              {renderFileTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Sheet */}
      <Sheet open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Subir Archivos</SheetTitle>
            <SheetDescription>
              Seleccione los archivos que desea subir a la carpeta {selectedFolder}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Carpeta destino</Label>
              <select
                id="folder"
                className="w-full border rounded-md h-10 px-3"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
              >
                <option value="documents">Documentos</option>
                <option value="images">Imágenes</option>
                <option value="archives">Archivos</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="files">Archivos</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Input
                  id="files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadFiles(Array.from(e.target.files));
                    }
                  }}
                />
                <Label htmlFor="files" className="cursor-pointer w-full block">
                  <FileUp className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Haga clic para seleccionar o arrastre los archivos aquí
                  </p>
                </Label>
              </div>
            </div>
            
            {uploadFiles.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <p className="text-sm font-medium">Archivos seleccionados:</p>
                <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                  {uploadFiles.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progreso</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button 
              onClick={handleUpload} 
              disabled={uploadFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Subiendo...' : 'Subir Archivos'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Image Preview Sheet */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full p-4">
            <Button 
              variant="ghost" 
              className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1.5"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] mx-auto rounded shadow-lg" 
            />
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to render the file table
  function renderFileTable() {
    if (error) {
      return (
        <ErrorMessage
          title="Error al cargar archivos"
          message={error.message}
          onRetry={fetchFiles}
        />
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-12">
          <Loading className="mx-auto" />
          <p className="mt-4 text-gray-600">Cargando archivos...</p>
        </div>
      );
    }

    if (filteredFiles.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Folder className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-500">
            {searchTerm 
              ? 'No se encontraron archivos que coincidan con la búsqueda'
              : `No hay archivos en esta carpeta`}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setIsUploadOpen(true)}
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Subir Archivos
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium flex items-center gap-2">
                {getFileIcon(file.type)}
                <span className="truncate max-w-[250px]">{file.name}</span>
              </TableCell>
              <TableCell>{file.type.charAt(0).toUpperCase() + file.type.slice(1)}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{formatDate(file.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {file.type === 'image' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(file)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(file)}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
};

export default FileManagement;
