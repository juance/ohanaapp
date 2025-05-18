
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from '@/lib/types/auth.types';
import bcrypt from 'bcryptjs';

export interface UserWithPassword extends Omit<User, 'id'> {
  id?: string;
  password?: string;
}

/**
 * Get all users from the database
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_all_users');

    if (error) throw error;

    // Transform to our internal format
    const users: User[] = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email || undefined,
      phoneNumber: user.phone_number,
      role: user.role as Role,
    }));

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_id', { user_id: id });

    if (error || !data || data.length === 0) return null;

    // Transform to our internal format
    const user: User = {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email || undefined,
      phoneNumber: data[0].phone_number,
      role: data[0].role as Role,
    };

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData: UserWithPassword): Promise<User> => {
  try {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Check if user with this phone number already exists
    const { data: existingUser } = await supabase
      .rpc('get_user_by_phone', { phone: userData.phoneNumber });

    if (existingUser && existingUser.length > 0) {
      throw new Error('Ya existe un usuario con este número de teléfono');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create the user
    const { data, error } = await supabase
      .rpc('create_user', {
        user_name: userData.name,
        user_phone: userData.phoneNumber || '',
        user_email: userData.email || null,
        user_password: hashedPassword,
        user_role: userData.role
      });

    if (error || !data || data.length === 0) {
      throw error || new Error('Failed to create user');
    }

    // Return the created user
    return {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email || undefined,
      phoneNumber: data[0].phone_number,
      role: data[0].role as Role,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (id: string, userData: UserWithPassword): Promise<User> => {
  try {
    let updateData: any = {
      user_id: id,
      user_name: userData.name,
      user_phone: userData.phoneNumber || '',
      user_email: userData.email || null,
      user_role: userData.role
    };

    // If password is provided, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      updateData.user_password = hashedPassword;
    }

    // Update the user
    const { data, error } = await supabase
      .rpc('update_user', updateData);

    if (error || !data || data.length === 0) {
      throw error || new Error('Failed to update user');
    }

    // Return the updated user
    return {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email || undefined,
      phoneNumber: data[0].phone_number,
      role: data[0].role as Role,
    };
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('delete_user', { user_id: id });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
