
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/auth';
import { toast } from 'sonner';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(username, password);
      // Save user to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(`¡Bienvenido/a, ${user.name}!`);
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Por favor verifique sus credenciales e intente nuevamente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md animate-scale-in overflow-hidden shadow-lg sm:rounded-2xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Ingrese sus credenciales para acceder a su cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="username"
              type="text"
              placeholder="Nombre o Teléfono"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-12 rounded-xl px-4 transition-all duration-200 focus-visible:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl px-4 transition-all duration-200 focus-visible:ring-blue-500"
            />
          </div>
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
                Iniciando Sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">¿No tiene una cuenta? <Link to="/register" className="text-blue-500 hover:underline">Registrarse</Link></p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="mb-2">Usuarios de Prueba:</p>
          <p>Administradores: juance/Juance001, nahir/Nahir001, carla/carla001</p>
          <p>Operador: vanesa/vanesa01</p>
          <p>Otros: admin@example.com/password, cashier@example.com/password</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
