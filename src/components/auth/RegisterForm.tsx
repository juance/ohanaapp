
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUser } from '@/lib/auth';
import { toast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Definimos el tipo para nuestro estado
type RegisterState = {
  isLoading: boolean;
};

// Definimos las acciones para nuestro reducer
type RegisterAction = 
  | { type: 'SET_LOADING'; payload: boolean };

// Definimos el reducer
const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const RegisterForm = () => {
  // Reemplazamos useState con useReducer
  const [state, dispatch] = useReducer(registerReducer, { isLoading: false });
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      phone: ""
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Use the name as email since we don't collect email anymore
      await registerUser(values.name, values.name, values.password, values.phone);
      
      toast.success('Registro exitoso', {
        description: 'Ya puedes iniciar sesión con tu cuenta',
      });
      
      navigate('/');
    } catch (error: any) {
      toast.error('Error al registrar', {
        description: error.message || 'Por favor intente nuevamente',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Su nombre"
                  {...field}
                  className="h-12 rounded-xl px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de teléfono</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Su número de teléfono"
                  {...field}
                  className="h-12 rounded-xl px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="h-12 rounded-xl px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="h-12 rounded-xl px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-blue-500 text-white transition-all hover:bg-blue-600"
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Registrando...
            </span>
          ) : (
            'Registrarse'
          )}
        </Button>
      </form>
    </Form>
  );
};
