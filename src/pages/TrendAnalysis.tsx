
import React from 'react';
import Layout from '@/components/Layout';
import TicketAnalysis from '@/pages/TicketAnalysis';

const TrendAnalysis = () => {
  return (
    <Layout>
      <TicketAnalysis embedded={true} />
    </Layout>
  );
};

export default TrendAnalysis;
