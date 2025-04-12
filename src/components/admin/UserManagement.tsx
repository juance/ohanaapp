import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Role } from '@/lib/types/auth';
import { getAllUsers, deleteUser } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { Loading } from '@/components/ui/loading';
import { UserDialog } from './UserDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

// User card component optimized with memo
const UserCard = React.memo(({
  user,
  onEdit,
  onDelete
}: {
  user: User,
  onEdit: (user: User) => void,
  onDelete: (userId: string) => void
}) => {
  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'operator':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'client':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'operator':
        return 'Operador';
      case 'client':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <Card key={user.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <Badge className={getRoleBadgeColor(user.role)}>
            {getRoleLabel(user.role)}
          </Badge>
        </div>
        <CardDescription>
          {user.email && (
            <div className="truncate">{user.email}</div>
          )}
          {user.phoneNumber && (
            <div>{user.phoneNumber}</div>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button
          onClick={() => onEdit(user)}
          variant="outline"
          size="sm"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el usuario {user.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(user.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
});

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err : new Error('Error al cargar usuarios'));
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los usuarios',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado correctamente',
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el usuario',
        variant: 'destructive',
      });
    }
  }, [users]);

  const handleDialogClose = useCallback((refresh: boolean = false) => {
    setIsDialogOpen(false);
    if (refresh) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-gray-500">Administra los usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRefreshTrigger(prev => prev + 1)} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleAddUser} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loading className="h-8 w-8" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p className="font-medium">Error al cargar usuarios</p>
          <p>{error.message}</p>
          <Button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            variant="outline"
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}

          {users.length === 0 && (
            <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay usuarios registrados</p>
              <Button onClick={handleAddUser} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Usuario
              </Button>
            </div>
          )}
        </div>
      )}

      <UserDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        user={selectedUser}
      />
    </div>
  );
};
