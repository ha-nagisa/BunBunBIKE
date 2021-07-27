/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../../store/slices/loggedInUserSlice';
import { getSuggestedProfiles } from '../../../utils/firebase';
import Header from '../../components/block/header';

const Dashboard: React.FC = () => {
  useEffect(() => {
    document.title = 'Bun Bun Bike';
  }, []);

  return (
    <div className="bg-gray-background  relative">
      <Header />
      <p>Dashboardです。</p>
    </div>
  );
};
export default Dashboard;
