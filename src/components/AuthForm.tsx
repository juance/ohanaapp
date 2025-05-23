
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/lib/toast';
import { Phone } from 'lucide-react';

const AuthForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`Intentando iniciar sesión con: ${phone}`);
      await login(phone, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor verifica tus credenciales e intenta de nuevo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md animate-scale-in overflow-hidden shadow-lg sm:rounded-2xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12 rounded-xl pl-10 px-4 transition-all duration-200 focus-visible:ring-laundry-500"
              />
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-xl px-4 transition-all duration-200 focus-visible:ring-laundry-500"
            />
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-laundry-500 text-white transition-all hover:bg-laundry-600"
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
        <div className="text-xs text-muted-foreground">
          <p className="mb-2">Cuentas de demostración:</p>
          <p><strong>Superusuario:</strong> 1123989718 / Juance001</p>
          <p>Admin: 1234567890 / password</p>
          <p>Operador: 0987654321 / password</p>
          <p>Cliente: 5555555555 / password</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
