
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUser } from '@/lib/auth';
import { toast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  phone: z.string().min(8, 'Ingrese un número de teléfono válido')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md animate-scale-in overflow-hidden shadow-lg sm:rounded-2xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">Registro de Usuario</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Ingrese sus datos para crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrarse'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            ¿Ya tiene una cuenta? <Link to="/" className="text-blue-500 hover:underline">Iniciar sesión</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
