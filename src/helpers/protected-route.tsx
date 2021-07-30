import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectUser } from '../store/slices/userSlice';
import * as ROUTES from '../constants/routes';

interface PROPS {
  children: React.ReactElement;
  path: string;
  exact: boolean;
}

const IsUserLoggedIn: React.FC<PROPS> = ({ children, path, exact }) => {
  const user = useSelector(selectUser);
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if (user) {
          return React.cloneElement(children, { user });
        }
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: ROUTES.LOGIN,
                state: { from: location },
              }}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default IsUserLoggedIn;
