import React, { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLogin";
import { UserContext } from "./UserContext";
import Chat from "./Chat";


function Routes() {
  const { username, id } = useContext(UserContext);
  if (username) {
    return <Chat />;
  }
  return <RegisterAndLoginForm />;
}

export default Routes;
