import React, { useContext, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "theme-ui";
import { swiss } from "@theme-ui/presets";
import { Link } from "@reach/router";
import { IdentityContext } from "../cognitoIdentity/IdentityProvider";
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Modal } from "react-bootstrap";

export default function Home() {
  const { user, addUser } = useContext(IdentityContext);
  
  const [userData, setUserData] = useState<any>(null)
  const [authState, setAuthState] = useState<AuthState>()
  const [show, setShow] = useState(false)

  const handleShow = () => { setShow(true) }
  const handleClose = () => { 
    setShow(false)
  }
    useEffect(() => {
    if (sessionStorage.getItem("user"))
      addUser(sessionStorage.getItem("user"))

    onAuthUIStateChange((nextAuthState, authData: any) => {
      setAuthState(nextAuthState);
      setUserData(authData)
      addUser(authData?.username.toString())
      if (authData !== undefined)
        sessionStorage.setItem("user", authData?.username);
      else
        sessionStorage.clear() 

    })
  }, [])
  return (
    <div>
      <Navbar />
      <div className="centered">
        <p
          style={{
            textAlign: "center",
            margin: "0 auto",
            fontSize: "40px",
            width: "70%",
            fontWeight: "bold",
            color: swiss.colors.primary,
          }}
        >
          Bookmarking Application
        </p>
        <p
          style={{
            textAlign: "center",
            margin: "0 auto",
            fontSize: "25px",
            width: "50%",
          }}
        >
          An App for saving your bookmarks for free
        </p>
        {!user ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Button
              onClick={handleShow}
              sx={{
                padding: "10px 30px",
                backgroundColor: swiss.colors.secondary,
              }}
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Button
              as={Link}
              to="/bookmark/"
              sx={{
                padding: "10px 30px",
                backgroundColor: swiss.colors.secondary,
              }}
            >
              Go To Dashboard
            </Button>
          </div>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {user ? <AmplifySignOut /> : <AmplifyAuthenticator />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
