
// Creando servicio de usuarios para compatibilidad con UserDialog y UserManagement
import { supabase } from '@/integrations/supabase/client';
import { User, Role, UserWithPassword } from '@/lib/types/auth.types';

/**
 * Obtiene todos los usuarios del sistema
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data as User[];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

/**
 * Crea un nuevo usuario
 * @param userData Datos del nuevo usuario
 */
export async function createUser(userData: UserWithPassword): Promise<User> {
  try {
    // Validar datos
    if (!userData.name || !userData.phoneNumber || !userData.role || !userData.password) {
      throw new Error('Faltan datos requeridos');
    }

    // Crear usuario en la tabla users
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        phone_number: userData.phoneNumber,
        email: userData.email || null,
        role: userData.role,
        password: userData.password // Idealmente debería estar hasheada
      })
      .select()
      .single();

    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

/**
 * Actualiza un usuario existente
 * @param id ID del usuario a actualizar
 * @param userData Nuevos datos del usuario
 */
export async function updateUser(id: string, userData: UserWithPassword): Promise<User> {
  try {
    // Validar datos
    if (!userData.name || !userData.phoneNumber || !userData.role) {
      throw new Error('Faltan datos requeridos');
    }

    const updateData: any = {
      name: userData.name,
      phone_number: userData.phoneNumber,
      email: userData.email || null,
      role: userData.role
    };

    // Solo actualizar la contraseña si se proporciona
    if (userData.password) {
      updateData.password = userData.password; // Idealmente debería estar hasheada
    }

    // Actualizar usuario
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

/**
 * Elimina un usuario
 * @param id ID del usuario a eliminar
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

/**
 * Interfaz exportada para compatibilidad con componentes existentes
 */
export type { UserWithPassword };
