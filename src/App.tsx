import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import * as ROUTES from './constants/routes';

import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIn from './helpers/is-user-logged-in';

import useAuthListener from './hooks/use-auth-listener';
import useUser from './hooks/use-user';
import useActiveUserPhotos from './hooks/use-photos-activeUser';
import Loading from './views/components/block/loading';
import { selectUser } from './store/slices/userSlice';

const Login = lazy(() => import('./views/pages/login'));
const SignUp = lazy(() => import('./views/pages/sign-up'));
const Dashboard = lazy(() => import('./views/pages/dashboad'));
const Profile = lazy(() => import('./views/pages/profile'));
const ProfileEdit = lazy(() => import('./views/pages/profile-edit'));
const Post = lazy(() => import('./views/pages/post'));
const NotFound = lazy(() => import('./views/pages/not-found'));

const App: React.FC = () => {
  useAuthListener();
  const user = useSelector(selectUser);
  useUser(user.uid);
  useActiveUserPhotos(user.uid);

  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>
            <IsUserLoggedIn loggedInPath={ROUTES.DASHBOARD} path={ROUTES.LOGIN}>
              <Login />
            </IsUserLoggedIn>
            <IsUserLoggedIn loggedInPath={ROUTES.DASHBOARD} path={ROUTES.SIGN_UP}>
              <SignUp />
            </IsUserLoggedIn>
            <ProtectedRoute path={ROUTES.PROFILE} exact>
              <Profile />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.PROFILE_EDIT} exact>
              <ProfileEdit />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.POST} exact>
              <Post />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.DASHBOARD} exact>
              <Dashboard />
            </ProtectedRoute>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 8000,
          success: {
            duration: 5000,
          },
        }}
      />
    </>
  );
};

export default App;
