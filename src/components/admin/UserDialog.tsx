
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Role, UserWithPassword } from '@/lib/types/auth.types';
import { createUser, updateUser } from '@/lib/userService';
import { toast } from '@/lib/toast';
import { validatePassword, PasswordStrength, getPasswordStrengthColor } from '@/lib/passwordValidator';

interface UserDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  user: User | null;
}

export const UserDialog: React.FC<UserDialogProps> = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState<UserWithPassword>({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'client',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role,
        password: '',
      });
      setConfirmPassword('');
    } else {
      resetForm();
    }
  }, [user, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      role: 'client',
      password: '',
    });
    setConfirmPassword('');
    setErrors({});
    setPasswordStrength(PasswordStrength.WEAK);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es obligatorio';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!user && !formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (formData.password) {
      // Validate password strength
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        newErrors.password = validation.errors[0];
      }
    }

    if (formData.password && formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update password strength when password changes
    if (name === 'password' && value) {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as Role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (user) {
        // Update existing user
        await updateUser(user.id, formData);
        toast({
          title: 'Usuario actualizado',
          description: 'El usuario ha sido actualizado correctamente',
        });
      } else {
        // Create new user
        await createUser(formData);
        toast({
          title: 'Usuario creado',
          description: 'El usuario ha sido creado correctamente',
        });
      }

      onClose(true); // Close dialog and refresh user list
    } catch (err) {
      console.error('Error saving user:', err);

      // Extract error message
      let errorMessage = 'Error al guardar el usuario';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Handle Supabase error object
        const supabaseError = err as any;
        if (supabaseError.message) {
          errorMessage = supabaseError.message;
        } else if (supabaseError.error && supabaseError.error.message) {
          errorMessage = supabaseError.error.message;
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Actualiza los datos del usuario existente.'
              : 'Completa los datos para crear un nuevo usuario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Form fields - name, phone, email */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Teléfono</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Número de teléfono"
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico (opcional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* User role selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="operator">Operador</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password fields */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={errors.password ? 'border-red-500' : ''}
            />
            {formData.password && (
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm">Fortaleza:</div>
                  <div
                    className="h-2 flex-1 rounded-full"
                    style={{ backgroundColor: getPasswordStrengthColor(passwordStrength) }}
                  />
                  <div className="text-sm">
                    {passwordStrength === PasswordStrength.STRONG ? 'Fuerte' :
                     passwordStrength === PasswordStrength.MEDIUM ? 'Media' : 'Débil'}
                  </div>
                </div>
              </div>
            )}
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className={errors.confirmPassword ? 'border-red-500' : ''}
              disabled={!formData.password}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
