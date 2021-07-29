import React from 'react';
import Suggestions from './suggestions';

const Sidebar: React.FC = () => (
  <div className="p-4 hidden lg:block">
    <Suggestions />
  </div>
);

export default Sidebar;
