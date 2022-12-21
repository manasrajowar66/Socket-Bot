import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";
import { UserContext } from "./state/context";
import { userMachine } from "./state/machine";
import { useInterpret } from "@xstate/react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MachineDefination from "./components/MachineDefination/MachineDefination";

const App = () => {
  const userService = useInterpret(userMachine);
  return (
    <UserContext.Provider value={{ userService }}>
      <Router>
        <Switch>
          <Route exact path="/" component={Join}></Route>
          <ProtectedRoute>
            <Switch>
              <Route path="/machine-defination" component={MachineDefination} />
              <Route path="/chat" component={Chat} />
            </Switch>
          </ProtectedRoute>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
