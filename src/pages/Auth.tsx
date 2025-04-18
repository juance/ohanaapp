
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock, UserPlus, Phone, AlertCircle } from 'lucide-react';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Forgot password dialog state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // If user is already logged in, redirect to appropriate page
  if (user) {
    if (user.role === 'client') {
      return <Navigate to="/user-tickets" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginPhone || !loginPassword) {
      return;
    }

    try {
      await login(loginPhone, loginPassword);
      // Navigation will be handled by the redirect above when user state updates
    } catch (err) {
      // Error is handled in the login function
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!registerName || !registerPhone || !registerPassword) {
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima de contraseña (8 caracteres)
    if (registerPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await register(registerName, registerPhone, registerPassword);
      // Navigation will be handled by the redirect above when user state updates
    } catch (err: any) {
      // La mayoría de errores son manejados en la función register
      // Pero podemos manejar errores específicos aquí si es necesario
      if (err.message && err.message.includes('contraseña')) {
        setPasswordError(err.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Lavandería Ohana</CardTitle>
          <CardDescription>
            Inicia sesión o crea una cuenta para continuar
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-blue-600"
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Nombre completo"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      setPasswordError('');
                    }}
                    required
                    autoComplete="new-password"
                    className={passwordError ? 'border-red-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={registerPasswordConfirm}
                    onChange={(e) => {
                      setRegisterPasswordConfirm(e.target.value);
                      setPasswordError('');
                    }}
                    required
                    autoComplete="new-password"
                    className={passwordError ? 'border-red-500' : ''}
                  />
                </div>
                {passwordError && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
};

export default Auth;
