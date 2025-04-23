
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Database, Layout, Server, User, FileText, Layers, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/**
 * CodeDocumentation Page - Only accessible to admin users
 * 
 * This page provides comprehensive documentation about the codebase
 * and explains how different parts of the application work.
 */
const CodeDocumentation = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Documentación del Código</h1>
            <p className="text-gray-500">Explicación detallada de la estructura y funcionamiento de la aplicación</p>
          </div>
          
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="overview">Visión General</TabsTrigger>
              <TabsTrigger value="structure">Estructura</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="pages">Páginas</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="database">Base de Datos</TabsTrigger>
              <TabsTrigger value="authentication">Autenticación</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="structure" className="space-y-6">
              <StructureSection />
            </TabsContent>

            <TabsContent value="components" className="space-y-6">
              <ComponentsSection />
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <PagesSection />
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <ServicesSection />
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <DatabaseSection />
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <AuthenticationSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const OverviewSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layout className="w-6 h-6 mr-2 text-blue-500" />
          Visión General de la Aplicación
        </CardTitle>
        <CardDescription>
          Una explicación general de la aplicación Ohana Laundry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">¿Qué es Ohana Laundry?</h3>
          <p className="text-muted-foreground">
            Ohana Laundry es una aplicación completa para la gestión de lavanderías. Permite administrar tickets de servicio,
            clientes, inventario, gastos y proporciona informes analíticos. La aplicación está diseñada para funcionar tanto en línea
            como fuera de línea, con sincronización de datos cuando hay conexión a internet.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Arquitectura General</h3>
          <p className="text-muted-foreground">
            La aplicación está construida con React y TypeScript, utilizando Vite como herramienta de compilación.
            Se conecta a una base de datos Supabase para el almacenamiento en la nube y utiliza almacenamiento local
            para operaciones sin conexión. La interfaz de usuario se basa en componentes de shadcn/ui y Tailwind CSS.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Principales características</h3>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Gestión de tickets (creación, actualización, seguimiento)</li>
            <li>Administración de clientes y programa de fidelidad</li>
            <li>Control de inventario</li>
            <li>Seguimiento de gastos</li>
            <li>Informes y análisis</li>
            <li>Gestión de usuarios con diferentes roles (admin, operador, cliente)</li>
            <li>Funcionamiento sin conexión con sincronización</li>
            <li>Sistema de notificaciones</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Workflow className="w-6 h-6 mr-2 text-blue-500" />
          Flujo de Trabajo de la Aplicación
        </CardTitle>
        <CardDescription>
          Cómo funciona el flujo principal de la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            El flujo de trabajo principal de la aplicación se centra en el ciclo de vida de los tickets:
          </p>
          
          <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
            <li>
              <strong>Creación de ticket:</strong> Un operador crea un nuevo ticket para un cliente,
              especificando los servicios (lavandería, tintorería, servicio a domicilio).
            </li>
            <li>
              <strong>Procesamiento:</strong> El ticket pasa a estado "pendiente" mientras se procesa.
            </li>
            <li>
              <strong>Recogida:</strong> Cuando las prendas están listas, el ticket pasa a estado "listo para recoger".
            </li>
            <li>
              <strong>Entrega:</strong> Al entregar las prendas al cliente, el ticket pasa a estado "entregado".
            </li>
            <li>
              <strong>Análisis:</strong> Los datos de los tickets alimentan el sistema de análisis y reportes.
            </li>
          </ol>
          
          <p className="text-muted-foreground">
            Paralelamente, la aplicación gestiona clientes, actualizando sus puntos de fidelidad,
            controlando el inventario y registrando gastos para calcular rentabilidad.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const StructureSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="w-6 h-6 mr-2 text-blue-500" />
          Estructura del Proyecto
        </CardTitle>
        <CardDescription>
          Organización de carpetas y archivos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="src">
            <AccordionTrigger className="font-medium">
              /src (Código fuente principal)
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li><strong>/components</strong>: Componentes reutilizables de React</li>
                <li><strong>/contexts</strong>: Contextos de React (AuthContext, etc.)</li>
                <li><strong>/hooks</strong>: Hooks personalizados de React</li>
                <li><strong>/integrations</strong>: Integraciones con servicios externos</li>
                <li><strong>/lib</strong>: Funciones y utilidades</li>
                <li><strong>/pages</strong>: Componentes de página completa</li>
                <li><strong>/providers</strong>: Proveedores de contexto</li>
                <li><strong>/utils</strong>: Funciones utilitarias</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="components">
            <AccordionTrigger className="font-medium">
              /components (Componentes de la UI)
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li><strong>/admin</strong>: Componentes para la sección de administración</li>
                <li><strong>/analytics</strong>: Componentes para gráficos y análisis</li>
                <li><strong>/clients</strong>: Componentes para gestión de clientes</li>
                <li><strong>/dashboard</strong>: Componentes del panel principal</li>
                <li><strong>/orders</strong>: Componentes para gestión de órdenes</li>
                <li><strong>/shared</strong>: Componentes compartidos entre secciones</li>
                <li><strong>/ticket</strong>: Componentes para creación y gestión de tickets</li>
                <li><strong>/ui</strong>: Componentes UI base (botones, tarjetas, etc.)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="lib">
            <AccordionTrigger className="font-medium">
              /lib (Lógica de negocio)
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li><strong>/data</strong>: Servicios de acceso a datos</li>
                <li><strong>/services</strong>: Servicios de negocio</li>
                <li><strong>/ticket</strong>: Lógica específica de tickets</li>
                <li><strong>/types</strong>: Definiciones de tipos TypeScript</li>
                <li><strong>/utils</strong>: Utilidades y helpers</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="pages">
            <AccordionTrigger className="font-medium">
              /pages (Páginas principales)
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li><strong>Administration.tsx</strong>: Página de administración</li>
                <li><strong>Auth.tsx</strong>: Página de autenticación</li>
                <li><strong>Clients.tsx</strong>: Gestión de clientes</li>
                <li><strong>Dashboard.tsx</strong>: Panel principal</li>
                <li><strong>Expenses.tsx</strong>: Gestión de gastos</li>
                <li><strong>Index.tsx</strong>: Página de inicio</li>
                <li><strong>Inventory.tsx</strong>: Gestión de inventario</li>
                <li><strong>Loyalty.tsx</strong>: Programa de fidelidad</li>
                <li><strong>PickupOrders.tsx</strong>: Órdenes listas para recoger</li>
                <li><strong>Tickets.tsx</strong>: Creación de tickets</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
);

const ComponentsSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="w-6 h-6 mr-2 text-blue-500" />
          Componentes Principales
        </CardTitle>
        <CardDescription>
          Descripción de los componentes más importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ticket-components">
            <AccordionTrigger className="font-medium">
              Componentes de Tickets
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">TicketForm</h3>
                <p className="text-muted-foreground">
                  Componente principal para la creación de tickets. Maneja la lógica de formulario,
                  cálculo de precios y envío de datos. Se compone de varios subcomponentes para cada sección.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/TicketForm.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">TicketPrint</h3>
                <p className="text-muted-foreground">
                  Componente para la impresión de tickets. Genera una vista optimizada para impresión
                  con los detalles del ticket y código QR.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/TicketPrint.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">TicketDetailPanel</h3>
                <p className="text-muted-foreground">
                  Muestra los detalles completos de un ticket. Se utiliza en las vistas de tickets pendientes,
                  listos para recoger y entregados.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/orders/TicketDetailPanel.tsx</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="customer-components">
            <AccordionTrigger className="font-medium">
              Componentes de Clientes
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">ClientList</h3>
                <p className="text-muted-foreground">
                  Lista paginada de clientes con búsqueda. Permite ver detalles y editar información.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/clients/ClientList.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">AddClientForm</h3>
                <p className="text-muted-foreground">
                  Formulario para añadir nuevos clientes al sistema.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/clients/AddClientForm.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">LoyaltyProgram</h3>
                <p className="text-muted-foreground">
                  Muestra y gestiona la información del programa de fidelidad para un cliente.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/clients/LoyaltyProgram.tsx</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="admin-components">
            <AccordionTrigger className="font-medium">
              Componentes de Administración
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">AdminTabs</h3>
                <p className="text-muted-foreground">
                  Sistema de pestañas para la sección de administración, organizando las diferentes
                  categorías de configuración.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/admin/AdminTabs.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">UserManagement</h3>
                <p className="text-muted-foreground">
                  Gestión de usuarios del sistema (creación, edición, eliminación).
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/admin/UserManagement.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">ErrorLogs</h3>
                <p className="text-muted-foreground">
                  Visualización y gestión de registros de errores del sistema.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/admin/ErrorLogs.tsx</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dashboard-components">
            <AccordionTrigger className="font-medium">
              Componentes del Dashboard
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">MetricsCards</h3>
                <p className="text-muted-foreground">
                  Tarjetas de métricas que muestran información clave como ingresos, tickets pendientes, etc.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/dashboard/MetricsCards.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">ChartSection</h3>
                <p className="text-muted-foreground">
                  Sección de gráficos que muestra tendencias de ingresos, tickets y otros datos importantes.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/dashboard/ChartSection.tsx</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">SyncDataButton</h3>
                <p className="text-muted-foreground">
                  Botón para sincronizar datos locales con la base de datos en la nube.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/components/dashboard/SyncDataButton.tsx</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
);

const PagesSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-500" />
          Páginas Principales
        </CardTitle>
        <CardDescription>
          Descripción de las páginas más importantes de la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="index-page">
            <AccordionTrigger className="font-medium">
              Página de Inicio (Index)
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                La página de inicio es el punto de entrada principal a la aplicación. Muestra un panel de navegación 
                con acceso a todas las funciones según el rol del usuario. Para usuarios no autenticados, muestra opciones
                de inicio de sesión.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Características principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Navegación principal</li>
                <li>Accesos directos a funciones clave</li>
                <li>Resumen de estado del sistema (para administradores)</li>
                <li>Información de la versión del sistema</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Archivos relacionados:</strong> <code>src/pages/Index.tsx</code>
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dashboard-page">
            <AccordionTrigger className="font-medium">
              Dashboard
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                El Dashboard proporciona una visión general del estado del negocio con métricas clave,
                gráficos y acceso rápido a las funciones más utilizadas. Solo accesible para administradores.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Características principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Tarjetas de métricas (ingresos, tickets, clientes)</li>
                <li>Gráficos de tendencias</li>
                <li>Contadores de artículos de tintorería</li>
                <li>Botones de acceso rápido a funciones</li>
                <li>Botón de sincronización de datos</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Archivos relacionados:</strong> <code>src/pages/Dashboard.tsx</code>
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tickets-page">
            <AccordionTrigger className="font-medium">
              Tickets
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                La página de Tickets permite crear nuevos tickets para servicios de lavandería, tintorería y 
                envío a domicilio. Incluye un formulario completo con cálculo de precios y opciones de impresión.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Características principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Formulario de creación de tickets</li>
                <li>Selección de servicios (lavandería, tintorería, valet)</li>
                <li>Búsqueda de clientes o creación rápida</li>
                <li>Cálculo automático de precios</li>
                <li>Impresión de tickets</li>
                <li>Aplicación de descuentos y promociones</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Archivos relacionados:</strong> <code>src/pages/Tickets.tsx</code>
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="pickup-page">
            <AccordionTrigger className="font-medium">
              Órdenes para Recoger
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                La página de Órdenes para Recoger muestra los tickets que están listos para ser entregados a los
                clientes. Permite buscar, filtrar y marcar tickets como entregados.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Características principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Lista de tickets listos para recoger</li>
                <li>Búsqueda por número de ticket o teléfono</li>
                <li>Vista detallada de cada ticket</li>
                <li>Botones para marcar como entregado</li>
                <li>Selección de método de pago</li>
                <li>Reimpresión de tickets</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Archivos relacionados:</strong> <code>src/pages/PickupOrders.tsx</code>
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="admin-page">
            <AccordionTrigger className="font-medium">
              Administración
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                La página de Administración proporciona acceso a configuraciones del sistema, gestión de usuarios,
                registros de errores y otras funciones administrativas.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Características principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Configuración general del negocio</li>
                <li>Gestión de usuarios y permisos</li>
                <li>Configuración de tickets y numeración</li>
                <li>Visualización de registros de errores</li>
                <li>Información del sistema y versiones</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Archivos relacionados:</strong> <code>src/pages/Administration.tsx</code>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
);

const ServicesSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="w-6 h-6 mr-2 text-blue-500" />
          Servicios Principales
        </CardTitle>
        <CardDescription>
          Lógica de negocio y servicios de datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ticket-services">
            <AccordionTrigger className="font-medium">
              Servicios de Tickets
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">ticketService</h3>
                <p className="text-muted-foreground">
                  Servicio principal para la gestión de tickets. Maneja la creación, actualización, 
                  consulta y eliminación de tickets en el sistema.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>createTicket</code>: Crea un nuevo ticket</li>
                  <li><code>updateTicketStatus</code>: Actualiza el estado de un ticket</li>
                  <li><code>getTicketsByStatus</code>: Obtiene tickets por estado</li>
                  <li><code>markTicketAsDelivered</code>: Marca un ticket como entregado</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/ticketService.ts</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">ticketNumberService</h3>
                <p className="text-muted-foreground">
                  Gestiona la generación y asignación de números únicos para los tickets.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>getNextTicketNumber</code>: Obtiene el siguiente número de ticket</li>
                  <li><code>resetTicketSequence</code>: Reinicia la secuencia de números</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/data/ticket/ticketNumberService.ts</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">ticketValidationService</h3>
                <p className="text-muted-foreground">
                  Proporciona validación para los datos de tickets antes de guardarlos.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>validateTicket</code>: Valida un ticket completo</li>
                  <li><code>validateCustomerData</code>: Valida los datos del cliente</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/services/ticketValidationService.ts</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="customer-services">
            <AccordionTrigger className="font-medium">
              Servicios de Clientes
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">customerService</h3>
                <p className="text-muted-foreground">
                  Gestiona la información de clientes, incluyendo creación, actualización y consulta.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>createCustomer</code>: Crea un nuevo cliente</li>
                  <li><code>updateCustomer</code>: Actualiza datos de un cliente</li>
                  <li><code>getCustomerByPhone</code>: Busca cliente por teléfono</li>
                  <li><code>getAllCustomers</code>: Obtiene todos los clientes</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/data/customerService.ts</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">loyaltyService</h3>
                <p className="text-muted-foreground">
                  Gestiona el programa de fidelidad, incluyendo puntos y beneficios.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>updateLoyaltyPoints</code>: Actualiza puntos de fidelidad</li>
                  <li><code>checkFreeValetEligibility</code>: Verifica elegibilidad para valet gratis</li>
                  <li><code>useCustomerFreeValet</code>: Utiliza un valet gratis</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/services/loyaltyService.ts</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sync-services">
            <AccordionTrigger className="font-medium">
              Servicios de Sincronización
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">syncService</h3>
                <p className="text-muted-foreground">
                  Gestiona la sincronización de datos entre el almacenamiento local y la base de datos en la nube.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>syncTickets</code>: Sincroniza tickets</li>
                  <li><code>syncClients</code>: Sincroniza clientes</li>
                  <li><code>syncFeedback</code>: Sincroniza feedback</li>
                  <li><code>syncAll</code>: Sincroniza todos los datos</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/data/syncService.ts</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">syncStatusService</h3>
                <p className="text-muted-foreground">
                  Gestiona el estado de sincronización y los registros de sincronización.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>getLastSyncDate</code>: Obtiene fecha de última sincronización</li>
                  <li><code>updateSyncStatus</code>: Actualiza estado de sincronización</li>
                  <li><code>logSyncEvent</code>: Registra evento de sincronización</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/data/sync/syncStatusService.ts</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="analytics-services">
            <AccordionTrigger className="font-medium">
              Servicios de Análisis
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <h3 className="font-medium">analyticsService</h3>
                <p className="text-muted-foreground">
                  Proporciona funciones para el análisis de datos y generación de informes.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>getRevenueByDate</code>: Obtiene ingresos por fecha</li>
                  <li><code>getTicketCountByStatus</code>: Cuenta tickets por estado</li>
                  <li><code>getPopularServices</code>: Identifica servicios populares</li>
                  <li><code>getCustomerRetentionRate</code>: Calcula tasa de retención</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/analyticsService.ts</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">metricsService</h3>
                <p className="text-muted-foreground">
                  Calcula métricas clave para el dashboard y reportes.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Funciones principales:</strong>
                </p>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li><code>getDailyMetrics</code>: Obtiene métricas diarias</li>
                  <li><code>getMonthlyMetrics</code>: Obtiene métricas mensuales</li>
                  <li><code>calculateGrowthRate</code>: Calcula tasas de crecimiento</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ubicación:</strong> <code>/lib/services/metricsService.ts</code>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
);

const DatabaseSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-6 h-6 mr-2 text-blue-500" />
          Estructura de la Base de Datos
        </CardTitle>
        <CardDescription>
          Tablas principales y sus relaciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tickets-table">
            <AccordionTrigger className="font-medium">
              Tabla: tickets
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena la información de todos los tickets de servicio.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>ticket_number</code>: Número único de ticket (8 dígitos)</li>
                <li><code>customer_id</code>: Relación con la tabla customers</li>
                <li><code>status</code>: Estado del ticket (pending, ready, delivered, cancelled)</li>
                <li><code>total_price</code>: Precio total del servicio</li>
                <li><code>created_at</code>: Fecha de creación</li>
                <li><code>delivery_date</code>: Fecha estimada de entrega</li>
                <li><code>delivered_date</code>: Fecha real de entrega</li>
                <li><code>payment_method</code>: Método de pago</li>
                <li><code>dry_cleaning_items</code>: JSON con items de tintorería</li>
                <li><code>laundry_kg</code>: Kilogramos de lavandería</li>
                <li><code>valet_quantity</code>: Cantidad de servicios a domicilio</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Relaciones:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li>customers (customer_id → id)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="customers-table">
            <AccordionTrigger className="font-medium">
              Tabla: customers
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena la información de los clientes.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>name</code>: Nombre del cliente</li>
                <li><code>phone_number</code>: Número de teléfono (único)</li>
                <li><code>email</code>: Correo electrónico (opcional)</li>
                <li><code>address</code>: Dirección (opcional)</li>
                <li><code>created_at</code>: Fecha de creación</li>
                <li><code>last_visit</code>: Fecha de última visita</li>
                <li><code>valets_count</code>: Contador de servicios a domicilio</li>
                <li><code>free_valets</code>: Cantidad de valets gratis disponibles</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Relaciones:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li>tickets (id → customer_id)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="users-table">
            <AccordionTrigger className="font-medium">
              Tabla: users
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena la información de los usuarios del sistema.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>name</code>: Nombre del usuario</li>
                <li><code>phone_number</code>: Número de teléfono (único)</li>
                <li><code>password</code>: Contraseña cifrada</li>
                <li><code>email</code>: Correo electrónico (opcional)</li>
                <li><code>role</code>: Rol del usuario (admin, operator, client)</li>
                <li><code>created_at</code>: Fecha de creación</li>
                <li><code>updated_at</code>: Fecha de última actualización</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="expenses-table">
            <AccordionTrigger className="font-medium">
              Tabla: expenses
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena la información de los gastos del negocio.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>description</code>: Descripción del gasto</li>
                <li><code>amount</code>: Monto del gasto</li>
                <li><code>category</code>: Categoría del gasto</li>
                <li><code>date</code>: Fecha del gasto</li>
                <li><code>created_at</code>: Fecha de creación del registro</li>
                <li><code>created_by</code>: ID del usuario que creó el registro</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="inventory-table">
            <AccordionTrigger className="font-medium">
              Tabla: inventory
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena la información del inventario de productos.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>name</code>: Nombre del producto</li>
                <li><code>description</code>: Descripción del producto</li>
                <li><code>quantity</code>: Cantidad en inventario</li>
                <li><code>min_quantity</code>: Cantidad mínima deseada</li>
                <li><code>unit_price</code>: Precio unitario</li>
                <li><code>category</code>: Categoría del producto</li>
                <li><code>last_updated</code>: Fecha de última actualización</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="feedback-table">
            <AccordionTrigger className="font-medium">
              Tabla: feedback
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Almacena comentarios y retroalimentación de clientes.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Columnas principales:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li><code>id</code>: UUID, clave primaria</li>
                <li><code>customer_id</code>: Relación con la tabla customers</li>
                <li><code>ticket_id</code>: Relación con la tabla tickets (opcional)</li>
                <li><code>rating</code>: Calificación numérica (1-5)</li>
                <li><code>comments</code>: Comentarios del cliente</li>
                <li><code>created_at</code>: Fecha de creación</li>
                <li><code>source</code>: Origen del feedback (app, web, in-store)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Relaciones:</strong>
              </p>
              <ul className="list-disc pl-5 text-muted-foreground text-sm">
                <li>customers (customer_id → id)</li>
                <li>tickets (ticket_id → id)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
);

const AuthenticationSection = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-500" />
          Sistema de Autenticación
        </CardTitle>
        <CardDescription>
          Cómo funciona el sistema de autenticación y roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Arquitectura de Autenticación</h3>
            <p className="text-muted-foreground">
              La aplicación utiliza un sistema de autenticación basado en Supabase con almacenamiento
              local para permitir el funcionamiento sin conexión. La autenticación se gestiona a través del
              contexto <code>AuthContext</code> que proporciona funciones y estado a toda la aplicación.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Roles de Usuario</h3>
            <p className="text-muted-foreground">
              La aplicación define tres roles principales de usuario:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground mt-2">
              <li>
                <strong>admin:</strong> Acceso completo a todas las funciones, incluyendo configuración
                del sistema, gestión de usuarios, análisis y todas las operaciones.
              </li>
              <li>
                <strong>operator:</strong> Acceso a operaciones diarias como creación de tickets,
                gestión de clientes, inventario y recogida/entrega.
              </li>
              <li>
                <strong>client:</strong> Acceso limitado a sus propios tickets y perfil.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Proceso de Autenticación</h3>
            <ol className="list-decimal pl-5 text-muted-foreground mt-2 space-y-1">
              <li>El usuario introduce su número de teléfono y contraseña en la página de inicio de sesión.</li>
              <li>La solicitud se envía a Supabase a través de una función RPC <code>get_user_by_phone</code>.</li>
              <li>La contraseña se verifica utilizando bcrypt para comparar hashes.</li>
              <li>Si es correcto, se crea un objeto de usuario con su información y rol.</li>
              <li>La sesión se almacena en <code>sessionStorage</code> con un tiempo de expiración.</li>
              <li>El estado de autenticación se comparte a través del contexto <code>AuthContext</code>.</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Protección de Rutas</h3>
            <p className="text-muted-foreground">
              Las rutas protegidas utilizan el componente <code>ProtectedRoute</code> que:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground mt-2">
              <li>Verifica si el usuario está autenticado</li>
              <li>Comprueba si el rol del usuario tiene permiso para acceder</li>
              <li>Redirige a la página de inicio de sesión si no está autenticado</li>
              <li>Redirige a una página apropiada si no tiene permisos suficientes</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Archivos Clave de Autenticación</h3>
            <ul className="list-disc pl-5 text-muted-foreground mt-2">
              <li><code>src/contexts/AuthContext.tsx</code>: Contexto principal de autenticación</li>
              <li><code>src/components/ProtectedRoute.tsx</code>: Componente para proteger rutas</li>
              <li><code>src/pages/Auth.tsx</code>: Página de inicio de sesión</li>
              <li><code>src/lib/auth.ts</code>: Funciones auxiliares de autenticación</li>
              <li><code>src/lib/types/auth.ts</code>: Tipos de datos para autenticación</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CodeDocumentation;
