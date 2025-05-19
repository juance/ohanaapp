
# Documentación de Arquitectura - OhanaApp

## 1. Visión General

OhanaApp es una aplicación de gestión de tintorería que permite administrar tickets, clientes, inventario, ventas y análisis de datos, optimizada para operaciones en tiendas físicas con capacidades online.

## 2. Arquitectura del Sistema

### 2.1 Tecnologías Utilizadas

- **Frontend**:
  - Framework: React con TypeScript
  - Routing: React Router
  - Estilos: Tailwind CSS y UI Components (Shadcn UI)
  - Gestión de Estado: React Context API y React Query
  - Visualización de datos: Recharts

- **Backend**:
  - Supabase (PostgreSQL, Autenticación, Almacenamiento)
  - Edge Functions para lógica personalizada

- **Despliegue**:
  - Vercel/Netlify (preferencia por Vercel)
  - Supabase para servicios backend

### 2.2 Estructura del Proyecto

```
src/
├── components/        # Componentes de UI
│   ├── admin/         # Componentes de administración
│   ├── analytics/     # Visualizaciones y análisis
│   ├── clients/       # Gestión de clientes
│   ├── dashboard/     # Panel principal
│   ├── inventory/     # Gestión de inventario
│   ├── orders/        # Gestión de pedidos
│   ├── ticket/        # Sistema de tickets
│   ├── ui/            # Componentes de UI reutilizables (shadcn)
├── contexts/          # Contextos de React para estado global
├── hooks/             # Hooks personalizados para lógica reutilizable
│   ├── pickup/        # Hooks relacionados con recogida de pedidos
│   ├── ticket/        # Hooks relacionados con tickets
├── lib/               # Utilidades y servicios
│   ├── data/          # Servicios de acceso a datos
│   │   ├── sync/      # Sincronización con backend
│   ├── types/         # Definiciones de tipos TypeScript
├── integrations/      # Integraciones de terceros
│   ├── supabase/      # Cliente Supabase
```

### 2.3 Capas de la Aplicación

1. **Capa de Presentación**: Componentes React que forman la interfaz de usuario.
2. **Capa de Lógica de Negocio**: Implementada en hooks y contexts.
3. **Capa de Acceso a Datos**: Implementada en servicios que interactúan con Supabase.
4. **Capa de Persistencia**: Supabase (PostgreSQL) y almacenamiento local (localStorage).

## 3. Flujos Principales

### 3.1 Gestión de Tickets

1. Creación de ticket → Validación de datos → Almacenamiento local
2. Sincronización periódica con el backend
3. Actualización de estadísticas y métricas

### 3.2 Gestión de Clientes

1. Registro/búsqueda de cliente → Actualización de datos
2. Sistema de fidelización → Acumulación de puntos/visitas → Beneficios

### 3.3 Sincronización de Datos

1. Almacenamiento local para operación offline
2. Sincronización periódica o manual con Supabase
3. Resolución de conflictos y manejo de errores

## 4. Patrones Arquitectónicos

- **Patrón de Servicio**: Implementado en módulos de acceso a datos
- **Patrón Repositorio**: Abstracción para operaciones CRUD
- **Patrón Observer**: Implementado vía React Context para actualizaciones en tiempo real
- **Patrón Adaptador**: Para la transformación de datos entre API y frontend

## 5. Seguridad

### 5.1 Autenticación

- Sistema de autenticación basado en Supabase Auth
- Roles diferenciados: admin, operator, client
- Políticas RLS (Row Level Security) en tablas de Supabase

### 5.2 Autorización

- Control de acceso basado en roles
- Componentes protegidos con rutas condicionales

## 6. Manejo de Errores

- Sistema centralizado de logging de errores
- Persistencia de errores en Supabase para análisis
- UI para visualización y gestión de errores del sistema

## 7. Datos y Almacenamiento

### 7.1 Esquema de Datos

- **Tickets**: Pedidos de tintorería/lavandería
- **Customers**: Información de clientes
- **Inventory**: Control de inventario
- **Metrics**: Almacenamiento de métricas de negocio
- **Users**: Información de usuarios y roles

### 7.2 Sincronización

- Estrategia offline-first para operación sin conexión
- Colas de sincronización para datos pendientes
- Timestamps para control de conflictos

## 8. Escalabilidad y Rendimiento

- Indexación de tablas críticas en Supabase
- Paginación de consultas grandes
- Caché de consultas frecuentes con React Query
- Lazy loading de componentes pesados

## 9. Integración y Despliegue

- CI/CD via GitHub Actions
- Entornos de desarrollo, staging y producción
- Variables de entorno segregadas por entorno

## 10. Pruebas

- Pruebas unitarias para servicios y utilidades
- Pruebas de componentes para la UI
- Pruebas e2e para flujos críticos

## 11. Monitoreo y Observabilidad

- Logging de errores de cliente
- Métricas de rendimiento de aplicación
- Alertas para errores críticos

## 12. Escalabilidad Futura

- Arquitectura modular para facilitar extensiones
- APIs bien definidas para nuevas integraciones
- Documentación actualizada de tipos y servicios
