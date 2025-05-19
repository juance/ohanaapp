
# Guía de Optimización y Despliegue - OhanaApp

## 1. Optimización de Rendimiento

### 1.1 Optimización de Componentes React

#### Code Splitting y Lazy Loading

Implementar lazy loading para componentes grandes y rutas:

```javascript
// Antes
import Dashboard from './Dashboard';

// Después
const Dashboard = React.lazy(() => import('./Dashboard'));

// En el componente padre
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

#### Memoización de Componentes

Utilizar React.memo y hooks de memoización para evitar re-renderizados:

```javascript
// Componente optimizado con memo
const UserCard = React.memo(({ user, onEdit }) => {
  // Implementación del componente
});

// Hooks memoizados
const filteredClients = useMemo(() => {
  return clients.filter(client => client.name.includes(searchTerm));
}, [clients, searchTerm]);

const handleDelete = useCallback((id) => {
  deleteClient(id);
}, []);
```

### 1.2 Optimización de Red

#### Caché de Datos con React Query

```javascript
// Configuración óptima para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Ejemplo de consulta optimizada
const { data, isLoading } = useQuery({
  queryKey: ['clients'],
  queryFn: fetchClients,
  onError: (error) => logError(error, { component: 'ClientList' })
});
```

#### Batch de Operaciones

```javascript
// Antes: Múltiples operaciones separadas
const saveTicket = async () => {
  await saveTicketData(ticket);
  await updateClientVisits(clientId);
  await updateInventory(items);
};

// Después: Operación en lote
const saveTicket = async () => {
  await batchOperation([
    { type: 'ticket', data: ticket },
    { type: 'client', data: { id: clientId, incrementVisits: true } },
    { type: 'inventory', data: { items } }
  ]);
};
```

### 1.3 Optimización de Estado

#### Normalización de Estado

```javascript
// Antes: Estado anidado y duplicado
const state = {
  clients: [
    { id: 1, name: 'Juan', tickets: [{ id: 101, total: 1500 }] },
    { id: 2, name: 'Ana', tickets: [{ id: 102, total: 2000 }] }
  ]
};

// Después: Estado normalizado
const state = {
  clients: {
    byId: {
      1: { id: 1, name: 'Juan', ticketIds: [101] },
      2: { id: 2, name: 'Ana', ticketIds: [102] }
    },
    allIds: [1, 2]
  },
  tickets: {
    byId: {
      101: { id: 101, total: 1500, clientId: 1 },
      102: { id: 102, total: 2000, clientId: 2 }
    },
    allIds: [101, 102]
  }
};
```

#### Fraccionamiento de Contextos

```javascript
// Antes: Contexto monolítico
const AppContext = createContext();

// Después: Contextos específicos
const AuthContext = createContext();
const TicketContext = createContext();
const ClientContext = createContext();
const UIContext = createContext();
```

### 1.4 Optimización de Recursos

#### Optimización de Imágenes

```javascript
// Uso de componentes optimizados para imágenes
<Image 
  src="/logo.png" 
  width={200} 
  height={100} 
  loading="lazy"
  alt="Logo"
/>
```

#### Inlining de Recursos Críticos

```javascript
// Recursos críticos incrustados en HTML para primera renderización
<style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
```

## 2. Despliegue en Producción

### 2.1 Preparación para Producción

#### Lista de Verificación Pre-Despliegue

1. Verificar variables de entorno
2. Generar build de producción optimizado
3. Ejecutar pruebas automatizadas
4. Validar funcionalidad en ambiente de staging
5. Verificar conectividad con Supabase

#### Configuración de Variables de Entorno

```javascript
// Verificación de variables críticas al inicio
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Falta configuración de Supabase. Verifica variables de entorno.');
}

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY;
```

### 2.2 Despliegue con Vercel

#### Configuración de Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "buildCommand": "npm run build",
        "installCommand": "npm install --legacy-peer-deps"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "dest": "/assets/$1"
    },
    { "src": "/favicon.ico", "dest": "/favicon.ico" },
    { "src": "/manifest.json", "dest": "/manifest.json" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Comandos de Despliegue

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Despliegue a producción
vercel --prod
```

### 2.3 Despliegue con Netlify

#### Configuración de Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Comandos de Despliegue

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Despliegue a producción
netlify deploy --prod
```

### 2.4 Estrategias de Despliegue

#### Despliegue Progresivo

1. **Ambiente de Desarrollo**: Vercel/Netlify Preview
2. **Ambiente de Staging**: Rama staging/beta
3. **Producción Parcial**: 10% de usuarios
4. **Producción Completa**: 100% de usuarios

#### Rollback Automatizado

```javascript
// Ejemplo de monitorización para rollback automático
const monitorDeployment = async (deploymentId) => {
  const errorRate = await getErrorRate(deploymentId);
  if (errorRate > ERROR_THRESHOLD) {
    await triggerRollback(deploymentId);
    await notifyTeam('Deployment rolled back due to high error rate');
  }
};
```

## 3. Monitoreo en Producción

### 3.1 Integración con Sentry

```javascript
// Configuración de Sentry
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(history),
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 3.2 Analytics y Métricas de Usuario

```javascript
// Integración con Google Analytics
export const logEvent = (category, action, label) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

// Ejemplo de uso
logEvent('Ticket', 'Create', 'Valet Service');
```

### 3.3 Monitoreo de Rendimiento

```javascript
// Reporte de métricas de rendimiento web vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  const body = JSON.stringify({ name, delta, id });
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) || 
    fetch('/analytics', { body, method: 'POST', keepalive: true });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## 4. Estrategias para Alta Disponibilidad

### 4.1 Resistencia a Fallos

#### Manejo de Offline

```javascript
// Detector de estado de conexión
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Uso en componentes
const isOnline = useOnlineStatus();
if (!isOnline) {
  return <OfflineNotice />;
}
```

#### Circuit Breaker

```javascript
// Implementación de patrón Circuit Breaker
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }
  
  async exec(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF-OPEN';
      } else {
        throw new Error('Circuit is OPEN');
      }
    }
    
    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

// Ejemplo de uso
const fetchWithBreaker = new CircuitBreaker(fetchData);
try {
  const data = await fetchWithBreaker.exec(url);
} catch (error) {
  // Manejar error o usar fallback
}
```

### 4.2 Seguridad

#### Sanitización de Entradas

```javascript
// Sanitizar entradas de usuario
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};

// Uso en formularios
const handleSubmit = (e) => {
  e.preventDefault();
  const safeComment = sanitizeInput(comment);
  saveComment(safeComment);
};
```

#### CSP (Content Security Policy)

```html
<!-- Meta tag para CSP -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.supabase.co"
>
```

## 5. Optimizaciones Avanzadas

### 5.1 Server-Side Rendering

Consideraciones para migrar a Next.js:

1. Identificar rutas críticas para SEO
2. Separar lógica de cliente y servidor
3. Adaptar llamadas a API para SSR

### 5.2 Edge Functions

Uso de edge functions para procesamiento más cercano al usuario:

```javascript
// ejemplo de edge function para verificación de acceso
export const onRequest = async (context) => {
  const { request } = context;
  const token = request.headers.get('Authorization');
  
  if (!token || !isValidToken(token)) {
    return new Response('No autorizado', { status: 401 });
  }
  
  // Continuar con la solicitud original
  return context.next();
};
```

Esta guía proporciona un enfoque estructurado para optimizar y desplegar OhanaApp en producción, cubriendo aspectos críticos de rendimiento, despliegue y monitoreo.
