/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { React, useState } from "react";
import SignIn from "components/Login/SignIn";
import ForgotPass from "components/Login/ForgotPass";
import ForgotPin from "components/Login/ForgotPin";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  CardFooter,
} from "reactstrap";

const Login = () => {
  const [selected, setSelected] = useState("SignIn");
  const openLinkInNewTab = () => {
    const linkUrl = "https://www.bankit.in/";
    window.open(linkUrl, "_blank");
  };

  return (
    <>
      <Col lg="6">
        <Card className="bg-secondary border-20">
          {selected === "SignIn" ? (
            <SignIn></SignIn>
          ) : selected === "ForgotPass" ? (
            <ForgotPass></ForgotPass>
          ) : selected === "ForgotPin" ? (
            <ForgotPin></ForgotPin>
          ) : null}

          <CardFooter style={{textAlign:"center"}}>
            <p>
              <Button color="link" onClick={openLinkInNewTab}>
                <small>SignUp</small>
              </Button>
              <span>{"|"}</span>
              <Button color="link" onClick={(e) => setSelected(selected === "CreatePin" ? "SignIn" : "CreatePin")}>
                <small>Create Pin</small>
              </Button>
              <span>{"|"}</span>
              <Button color="link" onClick={(e) => setSelected(selected === "ForgotPass" ? "SignIn" : "ForgotPass")}>
                <small>Forgot Password?</small>
              </Button>
              <span>{"|"}</span>
              <Button color="link" onClick={(e) => setSelected(selected === "ForgotPin" ? "SignIn" : "ForgotPin")}>
                <small>Forgot Pin?</small>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </Col>
    </>
  );
};

export default Login;
