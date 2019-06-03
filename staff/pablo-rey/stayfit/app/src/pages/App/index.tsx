import '@ionic/core';
// import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import { IonApp, IonContent } from '@ionic/react';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '../../style.css';
import Home from '../Home';
import Landing from '../Landing';
import Login from '../Login';
import Register from '../Register';
import Admin from '../Admin';
import Superadmin from '../Superadmin'
import Temp from '../temp';

import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { SERVER_URL } from '../../config';
import logic from '../../logic';
import { MainProvider, MainContext } from '../../logic/contexts/main-context';

const gqlClient = new ApolloClient({
  uri: SERVER_URL + '/graphql',
  fetchOptions: {
    credentials: 'include',
  },
});

logic.gqlClient = gqlClient;

const App: React.SFC = () => {
  return (
    <ApolloProvider client={gqlClient}>
      <Router>
        <MainProvider gqlClient={gqlClient}>
          <IonApp>
            <IonContent>
              <MainContext.Consumer>
                {({ role }) => (
                  <Switch>
                    <Route
                      path="/"
                      exact
                      render={() => {
                        switch (role) {
                          case 'SUPERADMIN_ROLE':
                            return <Redirect to="/superadmin" />;
                          case 'ADMIN_ROLE':
                          case 'STAFF_ROLE':
                            return <Redirect to="/admin" />
                          case 'USER_ROLE':
                          case 'GUEST_ROLE':
                            return <Redirect to="/home" />
                          default:
                            return <Landing />;
                        }
                      }}
                    />
                    <Route path="/login" render={() => <Login />} />
                    <Route path="/register" render={() => <Register />} />
                    <Route path="/temp" render={() => <Temp client={gqlClient} />} />
                    <Route path="/home" render={() => (['USER_ROLE','GUEST_ROLE'].includes(role) ? <Home />: <Redirect to="/"/>)} />
                    <Route path="/admin" render={() => (['ADMIN_ROLE','STAFF_ROLE'].includes(role) ? <Admin />: <Redirect to="/"/>)} />
                    <Route path="/superadmin" render={() => (role === 'SUPERADMIN_ROLE') ? <Superadmin />: <Redirect to="/"/>} />
                    <Route
                      path="/logout"
                      render={() => {
                        // logic.logout();
                        return <Redirect to="/" />;
                      }}
                    />
                    <Route path="*" render={() => <Redirect to="/" />} />
                  </Switch>
                )}
              </MainContext.Consumer>
            </IonContent>
          </IonApp>
        </MainProvider>
      </Router>
    </ApolloProvider>
  );
};

export default App;
