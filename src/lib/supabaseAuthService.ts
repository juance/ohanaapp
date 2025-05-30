
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from './types/auth.types';
import { toast } from '@/lib/toast';

// Verificar conexión con Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('ticket_sequence')
      .select('last_number')
      .limit(1);
    
    if (error) {
      console.error('Error de conexión Supabase:', error);
      return false;
    }
    
    console.log('Conexión Supabase exitosa');
    return true;
  } catch (error) {
    console.error('Error verificando conexión:', error);
    return false;
  }
};

// Función para verificar contraseñas de demostración
const verifyDemoPassword = (phoneNumber: string, password: string): boolean => {
  const demoCredentials = {
    '1123989718': 'Juance001',  // Superusuario
    '1234567890': 'password',   // Admin
    '0987654321': 'password',   // Operador
    '5555555555': 'password'    // Cliente
  };
  
  return demoCredentials[phoneNumber as keyof typeof demoCredentials] === password;
};

// Autenticar usuario con la tabla users
export const authenticateUser = async (phoneNumber: string, password: string): Promise<User> => {
  try {
    console.log(`Autenticando usuario: ${phoneNumber}`);
    
    // Primero verificar credenciales de demostración
    if (verifyDemoPassword(phoneNumber, password)) {
      // Crear usuarios de demostración si no existen
      const demoUsers = {
        '1123989718': { name: 'Superusuario', role: 'admin', email: 'super@demo.com' },
        '1234567890': { name: 'Administrador', role: 'admin', email: 'admin@demo.com' },
        '0987654321': { name: 'Operador', role: 'operator', email: 'operator@demo.com' },
        '5555555555': { name: 'Cliente', role: 'client', email: 'client@demo.com' }
      };
      
      const userData = demoUsers[phoneNumber as keyof typeof demoUsers];
      
      console.log(`Autenticación de demostración exitosa para: ${phoneNumber}`);
      
      return {
        id: `demo-${phoneNumber}`,
        name: userData.name,
        phoneNumber: phoneNumber,
        role: userData.role as Role,
        email: userData.email,
        createdAt: new Date().toISOString()
      };
    }

    // Si no es credencial de demostración, buscar en la base de datos
    const { data: userData, error } = await supabase
      .rpc('get_user_by_phone', { phone: phoneNumber });
    
    if (error || !userData || userData.length === 0) {
      console.error('Usuario no encontrado:', phoneNumber);
      throw new Error('Credenciales inválidas');
    }
    
    const user = userData[0];
    
    // Verificar contraseña simple (en producción usar bcrypt)
    if (user.password !== password) {
      console.error('Contraseña incorrecta');
      throw new Error('Credenciales inválidas');
    }
    
    console.log(`Autenticación exitosa para: ${phoneNumber}`);
    
    // Retornar usuario sin contraseña
    return {
      id: user.id,
      name: user.name,
      phoneNumber: user.phone_number,
      role: user.role as Role,
      email: user.email,
      createdAt: user.created_at
    };
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    throw error;
  }
};

// Registrar nuevo usuario
export const registerUser = async (name: string, phoneNumber: string, password: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .rpc('create_user', {
        user_name: name,
        user_phone: phoneNumber,
        user_password: password,
        user_role: 'client'
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Error al crear usuario');
    }
    
    const newUser = data[0];
    return {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phone_number,
      role: newUser.role as Role,
      email: newUser.email,
      createdAt: newUser.created_at
    };
    
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw error;
  }
};

export const requestPasswordReset = async (phoneNumber: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_phone', { phone: phoneNumber });
    
    if (error || !data || data.length === 0) {
      throw new Error('No existe un usuario con este número de teléfono');
    }
    
    toast.success(`Solicitud de recuperación enviada al número ${phoneNumber}`);
    
  } catch (error) {
    console.error('Error en solicitud de reset:', error);
    throw error;
  }
};

export const hasPermission = (user: User | null, requiredRoles: Role[]): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return requiredRoles.includes(user.role);
};

export const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('update_user', {
        user_id: userId,
        user_password: newPassword
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw error;
  }
};
