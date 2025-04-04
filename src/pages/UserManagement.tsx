
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash, UserCog, Edit, UserPlus, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Mock users
const mockUsers = [
  { id: '1', username: 'admin1', role: 'Administrador', name: 'Principal' },
  { id: '2', username: 'admin2', role: 'Administrador', name: '' },
  { id: '3', username: 'admin3', role: 'Administrador', name: '' },
  { id: '4', username: 'staff1', role: 'Personal', name: '' },
  { id: '5', username: 'blanco', role: 'Administrador', name: '' }
];

const UserManagement = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userRole, setUserRole] = useState('Personal');
  
  const handleAddUser = () => {
    if (!newUsername.trim()) {
      toast.error('Ingrese un nombre de usuario');
      return;
    }
    
    if (!newPassword.trim()) {
      toast.error('Ingrese una contraseña');
      return;
    }
    
    toast.success(`Usuario ${newUsername} agregado correctamente`, {
      description: `Rol: ${userRole}`
    });
    
    // Reset form
    setNewUsername('');
    setNewPassword('');
    setUserRole('Personal');
  };
  
  const handleDeleteUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      toast.success(`Usuario ${user.username} eliminado`);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
              <p className="text-gray-500">Sistema de Tickets</p>
            </div>
          </header>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Gestión de Usuarios
              </h2>
              
              <h3 className="text-lg font-medium mb-3">Usuarios Existentes</h3>
              
              <div className="space-y-3">
                {mockUsers.map(user => (
                  <div key={user.id} className="border rounded-md p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.username}</span>
                        {user.role === 'Administrador' && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        )}
                        {user.role === 'Personal' && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        )}
                        {user.name && (
                          <span className="text-sm text-gray-500">
                            {user.name}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8 w-8 p-0"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Ver tickets
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Crear tickets
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Editar tickets
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        +5 más
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Agregar Nuevo Usuario
              </h2>
              
              <div className="p-6 border rounded-md bg-white">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input 
                      id="username" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de Usuario</Label>
                    <RadioGroup 
                      value={userRole} 
                      onValueChange={setUserRole}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Personal" id="personal" />
                        <Label htmlFor="personal">Personal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Administrador" id="admin" />
                        <Label htmlFor="admin">Administrador</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2" 
                    onClick={handleAddUser}
                  >
                    Agregar Usuario
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
