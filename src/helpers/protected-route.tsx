import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PROPS {
  user: object;
  loggedInPath: string;
  children: ReactNode;
}

const IsUserLoggedIn: React.FC<PROPS> = ({ user, loggedInPath, children, ...rest }) => (
  <Route
    {...rest}
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

export default IsUserLoggedIn;
