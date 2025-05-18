
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { GitBranch, DownloadCloud } from "lucide-react";
import { getLatestCommits } from "@/lib/githubService";

interface GitHubSyncButtonProps {
  onSyncCompleted?: () => void;
}

export const GitHubSyncButton: React.FC<GitHubSyncButtonProps> = ({ onSyncCompleted }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    toast.info('Iniciando sincronización desde GitHub...');
    
    try {
      // Get latest commits from GitHub
      const commits = await getLatestCommits(5);
      
      if (commits && commits.length > 0) {
        // Store the latest commit information locally
        localStorage.setItem('lastGitHubSync', new Date().toISOString());
        localStorage.setItem('latestCommit', JSON.stringify(commits[0]));
        
        toast.success('Sincronización desde GitHub completada');
        console.log('Synced with GitHub. Latest commit:', commits[0]);
        
        if (onSyncCompleted) {
          onSyncCompleted();
        }
      } else {
        toast.warning('No se encontraron commits nuevos para sincronizar');
      }
    } catch (error) {
      console.error('Error during GitHub sync:', error);
      toast.error('No se pudo conectar con el repositorio de GitHub');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className="text-xs h-8 gap-1"
    >
      {isSyncing ? (
        <>
          <DownloadCloud className="h-3.5 w-3.5 animate-bounce" />
          Sincronizando...
        </>
      ) : (
        <>
          <GitBranch className="h-3.5 w-3.5" />
          Sincronizar desde GitHub
        </>
      )}
    </Button>
  );
};
