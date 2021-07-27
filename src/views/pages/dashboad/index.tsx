/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import Header from '../../components/block/header';

const Dashboard: React.FC = () => (
  <div className="bg-gray-background  relative">
    <Header />
    <p>Dashboardです。</p>
  </div>
);

export default Dashboard;
