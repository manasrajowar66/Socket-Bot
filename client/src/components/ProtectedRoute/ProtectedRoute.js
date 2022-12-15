import React, { useContext } from "react";
import { UserContext } from "../../state/context";
import { useActor } from "@xstate/react";
import { Redirect } from "react-router-dom";

const ProtectedRoute = (props) => {
  const services = useContext(UserContext);
  const [state] = useActor(services.userService);
  const { isAuthenticated } = state.context;
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return <>{props.children}</>;
};

export default ProtectedRoute;
