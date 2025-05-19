
import React from 'react';
import { AlertTriangle, Check, X, Code, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SystemError } from '@/lib/types/error.types';

interface ErrorLogItemProps {
  error: SystemError;
  onResolve: (errorId: string) => void;
  onDelete: (errorId: string) => void;
}

export const ErrorLogItem: React.FC<ErrorLogItemProps> = ({ error, onResolve, onDelete }) => {
  return (
    <div
      className={`border rounded-md p-3 ${error.resolved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
    >
      <div className="flex items-start">
        {error.resolved ? (
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${error.resolved ? 'text-green-800' : 'text-red-800'}`}>
              {error.message || error.error_message || "Error desconocido"}
            </h3>
            <div className="flex space-x-1">
              {error.component && (
                <Badge variant="outline" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  {error.component}
                </Badge>
              )}
              {error.user_id && (
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Usuario
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(error.timestamp).toLocaleString()}
          </p>

          {error.error_stack && (
            <pre className={`mt-2 text-xs p-2 rounded overflow-x-auto ${error.resolved ? 'bg-green-100' : 'bg-red-100'}`}>
              {error.error_stack}
            </pre>
          )}

          {error.browser_info && (
            <div className="mt-2 text-xs text-gray-600">
              <details>
                <summary className="cursor-pointer hover:text-gray-800">Información del navegador</summary>
                <div className="p-2 mt-1 bg-gray-50 rounded">
                  {typeof error.browser_info === 'object' && (
                    <pre>{JSON.stringify(error.browser_info, null, 2)}</pre>
                  )}
                </div>
              </details>
            </div>
          )}

          <div className="mt-3 flex justify-end space-x-2">
            {!error.resolved && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(error.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Marcar como resuelto
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este error?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente este registro de error.
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(error.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
