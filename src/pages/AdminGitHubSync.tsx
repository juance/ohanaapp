
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { GitHubSyncButton } from '@/components/admin/GitHubSyncButton';
import { getLatestCommits, GitHubCommit } from '@/lib/githubService';

const AdminGitHubSync = () => {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);
  
  useEffect(() => {
    loadCommits();
    const lastSyncTime = localStorage.getItem('lastGitHubSync');
    setLastSync(lastSyncTime);
  }, []);
  
  const loadCommits = async () => {
    setLoading(true);
    try {
      const latestCommits = await getLatestCommits(10);
      setCommits(latestCommits);
    } catch (error) {
      console.error('Error loading commits:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los commits de GitHub"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSyncCompleted = () => {
    loadCommits();
    setLastSync(localStorage.getItem('lastGitHubSync'));
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Sincronización con GitHub</CardTitle>
          <CardDescription>
            Sincroniza los últimos cambios desde el repositorio de GitHub
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              {lastSync && (
                <p className="text-sm text-muted-foreground">
                  Última sincronización: {new Date(lastSync).toLocaleString('es-ES')}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <GitHubSyncButton onSyncCompleted={handleSyncCompleted} />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadCommits}
                disabled={loading}
                className="text-xs h-8"
              >
                {loading ? 'Cargando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="ml-2">Cargando commits...</span>
                    </td>
                  </tr>
                ) : commits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                      No se encontraron commits
                    </td>
                  </tr>
                ) : (
                  commits.map((commit) => (
                    <tr key={commit.sha}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a 
                          href={commit.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                        >
                          {commit.sha.substring(0, 7)}
                        </a>
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-sm text-gray-900">
                          {commit.commit.message.split('\n')[0]}
                        </p>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {commit.commit.author.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commit.commit.author.date).toLocaleString('es-ES')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGitHubSync;
