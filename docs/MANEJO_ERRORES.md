
# Sistema de Manejo de Errores - OhanaApp

## 1. Visión General

El sistema de manejo de errores de OhanaApp está diseñado para capturar, registrar y presentar errores de manera coherente y útil, permitiendo la depuración eficiente y el mantenimiento de la calidad del servicio.

## 2. Capas de Manejo de Errores

### 2.1 Captura de Errores

#### Errores de UI
- **Error Boundaries**: Componentes React para capturar errores en la renderización
- **Event Handlers**: Manejo de errores en manejadores de eventos UI

#### Errores de Red
- **Interceptores Axios/Fetch**: Captura centralizada de errores HTTP
- **Timeouts y Reintentos**: Manejo de fallos de conexión

#### Errores de Operación
- **Try/Catch en Operaciones Críticas**: Captura estructurada de excepciones
- **Validación Preventiva**: Evitar errores validando entradas

### 2.2 Registro de Errores

#### Almacenamiento Local
- Registro de errores en `localStorage` para persistencia offline
- Cola de errores para sincronización posterior

#### Almacenamiento en Supabase
- Tabla `error_logs` para registro centralizado
- Contexto, timestamp y metadatos asociados

### 2.3 Presentación de Errores

#### Notificaciones al Usuario
- **Toasts**: Para errores no críticos
- **Diálogos Modales**: Para errores que requieren acción

#### Panel de Administración
- **ErrorLogs**: Componente para visualizar y gestionar errores
- **Filtrado y Búsqueda**: Herramientas para analizar errores

## 3. Estructura del Error

```typescript
interface SystemError {
  id: string;              // Identificador único
  message: string;         // Mensaje de error principal
  error_message?: string;  // Alias para compatibilidad
  stack?: string;          // Stack trace
  error_stack?: string;    // Alias para compatibilidad
  timestamp: string | Date; // Momento del error
  context?: Record<string, unknown>; // Información contextual
  error_context?: Record<string, unknown>; // Alias para compatibilidad
  resolved: boolean;       // Indica si fue resuelto
  component?: string;      // Componente donde ocurrió
  userId?: string;         // Usuario afectado
  user_id?: string;        // Alias para compatibilidad
  browserInfo?: Record<string, unknown>; // Información del navegador
  browser_info?: Record<string, unknown>; // Alias para compatibilidad
  level?: ErrorLevel;      // Nivel de severidad
  created_at?: string | Date; // Fecha de creación en la BD
}
```

## 4. Flujo de Manejo de Errores

1. **Captura**: Error detectado en cualquier capa de la aplicación
2. **Enriquecimiento**: Añadir contexto, metadatos y clasificación
3. **Registro**: Almacenar en localStorage y/o Supabase
4. **Notificación**: Informar al usuario según gravedad
5. **Recuperación**: Intentar recuperarse del error si es posible
6. **Resolución**: Marcado como resuelto por administradores

## 5. Ejemplos de Implementación

### 5.1 Captura Global de Errores JavaScript

```typescript
// errorHandlingService.ts
export const setupGlobalErrorHandling = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    logError(error || msg, {
      url,
      lineNo,
      columnNo
    });
    return false;
  };

  window.onunhandledrejection = (event) => {
    logError(event.reason, {
      type: 'unhandledrejection'
    });
  };
};
```

### 5.2 Error Boundary

```tsx
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    logError(error, {
      component: this.props.componentName,
      reactInfo: info
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 5.3 Logging a Supabase

```typescript
// errorService.ts
export const logError = async (error: Error | string | unknown, context: Record<string, any> = {}) => {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const systemError: SystemError = {
      id: uuidv4(),
      error_message: errorMessage,
      error_stack: errorStack,
      timestamp: new Date(),
      error_context: context,
      resolved: false
    };

    // En modo de desarrollo, solo registramos los errores en la consola
    if (import.meta.env.DEV) {
      console.log('Error registrado (modo desarrollo):', systemError);
      return systemError;
    }

    // En producción, intentamos registrar el error en Supabase
    const isSessionActive = await ensureSupabaseSession();

    if (isSessionActive) {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.warn('No se pudo registrar el error en Supabase: Usuario no autenticado');
        return systemError;
      }

      const { error: insertError } = await supabase
        .from('error_logs')
        .insert({
          error_message: systemError.error_message,
          error_stack: systemError.error_stack,
          error_context: JSON.stringify(systemError.error_context),
          resolved: systemError.resolved,
          id: systemError.id,
          browser_info: JSON.stringify(getBrowserInfo()),
          component: context.component,
          user_id: session.session.user.id
        });

      if (insertError) {
        console.warn('Error al insertar en error_logs:', insertError);
      }
    }

    return systemError;
  } catch (err) {
    console.error('Error logging error:', err);
    return null;
  }
};
```

## 6. Gestión de Errores por Tipo

### 6.1 Errores de Validación

```typescript
// handleValidationError.ts
export const handleValidationError = (
  message: string,
  field?: string,
  value?: any
): void => {
  logError(
    `Validation error: ${message}`,
    ErrorLevel.WARNING,
    ErrorContext.UI,
    { field, value }
  );
};
```

### 6.2 Errores de API

```typescript
// handleApiError.ts
export const handleApiError = (error: any, endpoint?: string): void => {
  let message = 'API request failed';
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  }

  logError(
    message,
    ErrorLevel.ERROR,
    ErrorContext.API,
    { endpoint, error }
  );
};
```

### 6.3 Errores de Base de Datos

```typescript
// handleDatabaseError.ts
export const handleDatabaseError = (error: any, operation?: string): void => {
  logError(
    `Database operation failed: ${operation || 'unknown'}`,
    ErrorLevel.ERROR,
    ErrorContext.DATABASE,
    error
  );
};
```

## 7. Panel de Administración

El panel de administración de errores permite:

- Ver errores recientes y filtrarlos por estado
- Marcar errores como resueltos
- Eliminar errores antiguos
- Exportar registros para análisis externo
- Configurar umbrales de alertas

## 8. Buenas Prácticas Implementadas

1. **Mensajes Claros**: Errores descriptivos para usuarios y desarrolladores
2. **Fail-Safe**: Operaciones críticas con mecanismos de respaldo
3. **Seguridad**: No exponer información sensible en mensajes de error
4. **Internacionalización**: Mensajes de error traducibles
5. **Degradación Elegante**: Fallar componentes individuales, no toda la app
6. **Retención Limitada**: Política de eliminación de errores antiguos

## 9. Recomendaciones de Mejora

1. **Integración con Sentry**: Para monitoreo avanzado en producción
2. **Análisis de Patrones**: Detectar errores recurrentes automáticamente
3. **Alerta Temprana**: Notificaciones a desarrolladores para errores críticos
4. **Recuperación Automática**: Implementar estrategias de auto-recuperación
5. **Documentación Viva**: Vincular errores a documentación de soluciones
