
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ErrorLogsHeader } from './error-logs/ErrorLogsHeader';
import { ErrorLogsTabs } from './error-logs/ErrorLogsTabs';
import { ErrorLogsList } from './error-logs/ErrorLogsList';
import { useErrorLogs } from './error-logs/useErrorLogs';

export const ErrorLogs = () => {
  const {
    errors,
    isLoading,
    activeTab,
    isClearing,
    isClearingResolved,
    setActiveTab,
    loadErrors,
    handleClearErrors,
    handleClearResolvedErrors,
    handleResolveError,
    handleDeleteError,
  } = useErrorLogs();

  return (
    <Card>
      <CardHeader>
        <ErrorLogsHeader
          errors={errors}
          isLoading={isLoading}
          isClearing={isClearing}
          isClearingResolved={isClearingResolved}
          onRefresh={loadErrors}
          onClearAll={handleClearErrors}
          onClearResolved={handleClearResolvedErrors}
        />
      </CardHeader>
      <CardContent>
        <ErrorLogsTabs 
          errors={errors} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        >
          <ErrorLogsList
            errors={errors}
            activeTab={activeTab}
            isLoading={isLoading}
            onResolveError={handleResolveError}
            onDeleteError={handleDeleteError}
          />
        </ErrorLogsTabs>
      </CardContent>
    </Card>
  );
};

export default ErrorLogs;
