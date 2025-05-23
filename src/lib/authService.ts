
import { User, Role } from './types/auth.types';
import { toast } from '@/lib/toast';
import { comparePasswords, hashPassword } from './passwordValidator';
import { notificationManager } from './notificationManager';

// Usuario administrador hardcodeado para demostración
const ADMIN_USER = {
  id: 'admin-1',
  name: 'Admin General',
  phoneNumber: '1123989718',
  password: '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', // Hash de 'Juance001'
  role: 'admin' as Role
};

// Mock usuarios para pruebas
const DEMO_USERS = [
  ADMIN_USER,
  {
    id: 'admin-2',
    name: 'Admin User',
    phoneNumber: '1234567890',
    password: '$2a$10$zDv7ogIVrs.HYEfBhRGJ9eUtIrKg1jQHgJq.zfz1Wr8l40awi9v5m', // Hash de 'password'
    role: 'admin' as Role
  },
  {
    id: 'operator-1',
    name: 'Operator User',
    phoneNumber: '0987654321',
    password: '$2a$10$zDv7ogIVrs.HYEfBhRGJ9eUtIrKg1jQHgJq.zfz1Wr8l40awi9v5m', // Hash de 'password'
    role: 'operator' as Role
  },
  {
    id: 'client-1',
    name: 'Client User',
    phoneNumber: '5555555555',
    password: '$2a$10$zDv7ogIVrs.HYEfBhRGJ9eUtIrKg1jQHgJq.zfz1Wr8l40awi9v5m', // Hash de 'password'
    role: 'client' as Role
  }
];

// Autenticar usuario
export const authenticateUser = async (phoneNumber: string, password: string): Promise<User> => {
  console.log(`Intentando autenticar usuario: ${phoneNumber}`);
  
  // Buscar usuario por teléfono
  const user = DEMO_USERS.find(u => u.phoneNumber === phoneNumber);
  
  if (!user) {
    console.error(`Usuario no encontrado: ${phoneNumber}`);
    throw new Error('Credenciales inválidas');
  }

  // Comparar contraseña
  const passwordMatch = await comparePasswords(password, user.password);
  
  if (!passwordMatch) {
    console.error(`Contraseña incorrecta para: ${phoneNumber}`);
    throw new Error('Credenciales inválidas');
  }

  // Credenciales correctas
  console.log(`Autenticación exitosa para: ${phoneNumber} con rol: ${user.role}`);
  
  // Omitir la contraseña del usuario devuelto
  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword as User;
};

// Registrar nuevo usuario
export const registerUser = async (name: string, phoneNumber: string, password: string): Promise<User> => {
  // Verificar si el usuario ya existe
  const existingUser = DEMO_USERS.find(u => u.phoneNumber === phoneNumber);
  if (existingUser) {
    throw new Error('El número de teléfono ya está registrado');
  }

  // Hashear contraseña
  const hashedPassword = await hashPassword(password);
  
  // Crear nuevo usuario (en producción, esto se haría en la base de datos)
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    phoneNumber,
    password: hashedPassword,
    role: 'client' as Role
  };
  
  // En un escenario real, aquí guardaríamos el usuario en la base de datos
  // Para la demostración, solo mostramos un mensaje de éxito
  
  // Omitir la contraseña del usuario devuelto
  const { password: _, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword as User;
};

// Solicitar cambio de contraseña
export const requestPasswordReset = async (phoneNumber: string): Promise<void> => {
  // Verificar que el usuario existe
  const user = DEMO_USERS.find(u => u.phoneNumber === phoneNumber);
  if (!user) {
    throw new Error('No existe un usuario con este número de teléfono');
  }
  
  // En un escenario real, aquí enviaríamos un código de verificación
  // Para la demostración, solo mostramos un mensaje de éxito
  
  notificationManager.success(
    'Solicitud enviada', 
    `Se ha enviado un código de recuperación al número ${phoneNumber}`
  );
};

// Verificar si el usuario tiene permisos específicos
export const hasPermission = (user: User | null, requiredRoles: Role[]): boolean => {
  if (!user) return false;
  
  // Admin tiene acceso a todo
  if (user.role === 'admin') return true;
  
  // Verificar si el rol del usuario está en los roles requeridos
  return requiredRoles.includes(user.role as Role);
};

// Cambiar contraseña
export const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<boolean> => {
  // En un escenario real, aquí verificaríamos la contraseña actual
  // y actualizaríamos la nueva en la base de datos
  
  return true;
};
