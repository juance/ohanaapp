
import { supabase } from '@/integrations/supabase/client';
import { User, UserWithPassword } from '@/lib/types/auth.types';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      throw error;
    }
    
    return (data || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      phoneNumber: user.phone_number,
      role: user.role,
      email: user.email,
      createdAt: user.created_at
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: UserWithPassword): Promise<User> => {
  try {
    const { data, error } = await supabase.rpc('create_user', {
      user_name: userData.name,
      user_phone: userData.phoneNumber,
      user_password: userData.password,
      user_role: userData.role,
      user_email: userData.email || null
    });
    
    if (error) {
      throw error;
    }
    
    const newUser = data[0];
    return {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phone_number,
      role: newUser.role,
      email: newUser.email,
      createdAt: newUser.created_at
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<UserWithPassword>): Promise<User> => {
  try {
    const { data, error } = await supabase.rpc('update_user', {
      user_id: userId,
      user_name: userData.name,
      user_phone: userData.phoneNumber,
      user_email: userData.email || null,
      user_role: userData.role,
      user_password: userData.password || null
    });
    
    if (error) {
      throw error;
    }
    
    const updatedUser = data[0];
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      phoneNumber: updatedUser.phone_number,
      role: updatedUser.role,
      email: updatedUser.email,
      createdAt: updatedUser.created_at
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('delete_user', {
      user_id: userId
    });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
