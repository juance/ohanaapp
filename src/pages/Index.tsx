
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    
    checkUser();
  }, [navigate]);
  
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-laundry-50 to-white p-4">
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-laundry-100/50 blur-3xl" />
      
      <div className="relative z-10 mb-8 text-center">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-laundry-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
              <path d="M12 22a9.94 9.94 0 0 1-3.64-.68 10.06 10.06 0 0 1-5.68-5.68A9.94 9.94 0 0 1 2 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10z" />
              <path d="M8 9.05v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a3 3 0 0 1-6 0" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-laundry-900">WashWise</h1>
          <p className="text-muted-foreground">Smart laundry management system</p>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
      
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform flex-col items-center gap-4 text-sm text-muted-foreground">
        <p className="text-center">
          Streamline your laundry operations with WashWise.<br />
          Efficient. Simple. Reliable.
        </p>
      </div>
    </div>
  );
};

export default Index;
