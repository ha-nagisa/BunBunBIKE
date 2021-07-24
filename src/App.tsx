import React, { lazy, Suspense, useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import * as ROUTES from './constants/routes';

const App: React.FC = () => (
  <div className="App">
    <p className="text-red-500">テストです。</p>
  </div>
);

export default App;
