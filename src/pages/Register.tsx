
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register = () => {
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
          <RegisterForm />
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
