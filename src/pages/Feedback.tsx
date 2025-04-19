
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import FeedbackHeader from '@/components/feedback/FeedbackHeader';
import { useFeedback } from '@/hooks/useFeedback';

const Feedback = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>(
    localStorage.getItem('lastFeedbackCheckTime') || new Date().toISOString()
  );

  const { newClientFeedbackCount, error, isLoading } = useFeedback(lastCheckTime);

  useEffect(() => {
    setIsComponentMounted(true);
    return () => setIsComponentMounted(false);
  }, []);

  useEffect(() => {
    const now = new Date().toISOString();
    setLastCheckTime(now);
    localStorage.setItem('lastFeedbackCheckTime', now);
  }, [refreshTrigger]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleFeedbackAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isComponentMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-4 md:p-6">
          <FeedbackHeader
            newClientFeedbackCount={newClientFeedbackCount}
            onGoBack={handleGoToHome}
          />

          {error ? (
            <ErrorMessage
              title="Error al cargar comentarios"
              message={error.message}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
              {isLoading ? (
                <div className="flex justify-center p-6"><Loading /></div>
              ) : (
                <FeedbackList refreshTrigger={refreshTrigger} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
