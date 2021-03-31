import { Link } from "gatsby";
import React, { useContext, useEffect, useState } from "react";
// import { Flex, NavLink, Button } from "theme-ui";
import { Flex, NavLink, Button } from 'theme-ui';
import logo from "../images/icon.png";
import { swiss } from "@theme-ui/presets";
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Modal } from 'react-bootstrap';
import { IdentityContext } from "../cognitoIdentity/IdentityProvider";

export const Navbar = () => {
  const state = useContext(IdentityContext)

  const [userData, setUserData] = useState<any>(null)
  const [authState, setAuthState] = useState<AuthState>()
  const [show, setShow] = useState(false)

  const handleShow = () => { setShow(true) }
  const handleClose = () => { 
    setShow(false)
  }
  useEffect(() => {
    if (sessionStorage.getItem("user"))
      state.addUser(sessionStorage.getItem("user"))

    onAuthUIStateChange((nextAuthState, authData: any) => {
      setAuthState(nextAuthState);
      setUserData(authData)
      state.addUser(authData?.username.toString())
      if (authData !== undefined)
        sessionStorage.setItem("user", authData?.username);
      else
        sessionStorage.clear()     
    })
  }, [])

  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" p={2}>
        <img src={logo} alt="logo" width="50px" />
      </NavLink>
      <div style={{ margin: "auto 0 auto auto" }}>
        <NavLink
          as={Link}
          to="/"
          p={2}
          sx={{ padding: "8px", margin: "auto 0" }}
        >
          Home
        </NavLink>
        <NavLink
          as={Link}
          to="/bookmark/"
          p={2}
          sx={{ padding: "8px", margin: "auto 0" }}
        >
          Dashboard
        </NavLink>
        <NavLink
          as={Button}
          onClick={handleShow}
          p={2}
          sx={{ padding: "8px", backgroundColor: "transparent" }}
        >
          {state.user ? "Logout" : "Login/Signup"}
        </NavLink>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {state.user ? <AmplifySignOut /> : <AmplifyAuthenticator />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Flex>
  );
};
