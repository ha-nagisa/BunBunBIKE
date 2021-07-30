import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectUser } from '../store/slices/userSlice';

interface PROPS {
  loggedInPath: string;
  children: React.ReactElement;
  path: string;
}

const IsUserLoggedIn: React.FC<PROPS> = ({ loggedInPath, children, path }) => {
  const user = useSelector(selectUser);
  return (
    <Route
      path={path}
      render={({ location }) => {
        if (!user) {
          return React.cloneElement(children, { user });
        }

        if (user) {
          return (
            <Redirect
              to={{
                pathname: loggedInPath,
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
