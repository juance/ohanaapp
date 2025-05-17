
import React from 'react';
import { SyncTester } from '@/components/admin/SyncTester';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTools() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <header className="mb-8">
          <div>
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Herramientas de Administración</h1>
            <p className="text-gray-500">Utilidades para mantenimiento y pruebas</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SyncTester />
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Información de Sistema</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  localStorage: Object.keys(localStorage).length,
                  navigator: {
                    onLine: navigator.onLine,
                    userAgent: navigator.userAgent
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
