
import { React, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  CardHeader,
  CardBody,
  CardText,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Form,
  Button,
  FormGroup,
  FormText,
  Col,
} from "reactstrap";

export default function ForgotPass(props) {
  const [otp, setOtp] = useState({ value: "", isSent: false });
  const [message, setMessage] = useState({
    show: false,
    status: "",
    message: "",
  });
  const [isVerified, SetIsVerified] = useState(true);
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState({ password: "", confirmPassword: "" });
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp.isSent) {
        if(mobile === ""){
            toast.error("Please Enter Your Registered Email ID/Mobile Number")
            return;
        }
      sendOtp(e);
    } else {
      validateOtp(e);
    }
  };

  const sendOtp = (e) => {
    fetch(baseUrl + "/forgetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Mobile: mobile }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "0") {
          setMessage({
            show: true,
            status: data.status,
            message: data.message,
          });
          setOtp({ isSent: true });
        } else {
          setMessage({
            show: true,
            status: data.status,
            message: data.message,
          });
        }
        console.log(data);
      })
      .catch((error) => {
        setMessage({
          show: true,
          status: "1",
          message: "Technical Error Occurred.",
        });
        setOtp({ otp: "", isSent: false });
        setTimeout(() => {
          setMessage({
            show: false,
            status: "",
            message: "",
          });
        }, 8000);
      });
  };
  const validateOtp = (e) => {
    fetch(baseUrl + "/verifyOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Mobile: mobile, OTP: otp.value }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "0") {
          SetIsVerified(true);
          setOtp({ isSent: false });
          setMessage({
            show: false,
            status: "",
            message: "",
          });
        } else {
          setMessage({
            show: true,
            status: data.status,
            message: data.message,
          });
        }
      })
      .catch((error) => {
        setMessage({
          show: true,
          status: "1",
          message: "Technical Error Occurred.",
        });
        setOtp({ otp: "", isSent: false });
        setTimeout(() => {
          setMessage({
            show: false,
            status: "",
            message: "",
          });
        }, 8000);
      });
  };

  const changePass = (e) => {
    if(pass.password === ""){
        toast.error("Please enter your New Password.");
        return false;
    }
    if(pass.confirmPassword === ""){
        toast.error("Please Confirm your New Password.");
        return false;
    }
    if(pass.password !== pass.confirmPassword){
        toast.error("New Password and Confirm Password did not match.");
        return false;
    }
    console.log(pass);
    return true;
  };
  return (
    <>
<ToastContainer theme="colored" />
                   
      {!isVerified ? (
        <>
          <CardHeader className="bg-transparent ">
            <div className="text-muted text-center">
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                Forgot Password
              </span>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              {message.show && (
                <FormGroup row>
                  <Col lg="10" style={{ textAlign: "center" }}>
                    {message.status === "0" ? (
                      <h4 style={{ color: "green" }}>{message.message}</h4>
                    ) : (
                      <h4 style={{ color: "red" }}>{message.message}</h4>
                    )}
                  </Col>
                </FormGroup>
              )}
              {!otp.isSent && (
                <FormGroup>
                  <InputGroup className="input-group-alternative ">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Enter Your Registered Email ID/Mobile Number"
                      type="text"
                      autoComplete="off"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              )}
              {otp.isSent && (
                <FormGroup>
                  <InputGroup className="input-group-alternative ">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      outlined
                      placeholder="Enter Verification Code"
                      type="password"
                      autoComplete="off"
                      value={otp.value}
                      onChange={(e) => {
                        setOtp({ ...otp, value: e.target.value });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              )}

              <div className="text-center">
                <Button className="" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Form>
          </CardBody>
        </>
      ) : (
        <>
          <CardHeader className="bg-transparent ">
            <div className="text-muted text-center">
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                Reset Password
              </span>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              {message.show && (
                <FormGroup row>
                  <Col lg="10" style={{ textAlign: "center" }}>
                    {message.status === "0" ? (
                      <h4 style={{ color: "green" }}>{message.message}</h4>
                    ) : (
                      <h4 style={{ color: "red" }}>{message.message}</h4>
                    )}
                  </Col>
                </FormGroup>
              )}

              <FormGroup>
                <InputGroup className="input-group-alternative ">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Enter Your New Password"
                    type="password"
                    autoComplete="off"
                    value={pass.password}
                    onChange={(e) => {
                      setPass({ ...pass, password: e.target.value });
                    }}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className="input-group-alternative ">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    outlined
                    placeholder="Confirm Your New Password"
                    type="password"
                    autoComplete="off"
                    value={pass.confirmPassword}
                    onChange={(e) => {
                      setPass({ ...pass, confirmPassword: e.target.value });
                    }}
                  />
                </InputGroup>
              </FormGroup>

              <Card
                style={{
                    backgroundColor:"lightGrey",
                    paddingLeft:"1rem",
                    paddingBlock:"0.5rem",
                    marginBottom: "1rem",
                }}
              >
                
                  <CardText tag="h5">Password Requirement</CardText>
                  <FormText color="dark">
                  <span style={{ color: 'red' }}> *</span> MINIMUM 6 CHARACTERS , <span style={{ color: 'red' }}> *</span> ONE UPPER CASE LETTER,
                  </FormText>
                  <FormText color="dark">
                  <span style={{ color: 'red' }}> *</span> ONE LOWER CASE LETTER, <span style={{ color: 'red' }}> *</span> ONE NUMERIC DIGIT,
                  </FormText>
                  <FormText color="dark"><span style={{ color: 'red' }}> *</span> ONE SPECIAL CHARACTER</FormText>
                
              </Card>
              <div className="text-center">
                <Button className="" color="primary" onClick={changePass}>
                  Submit
                </Button>
              </div>
            </Form>
          </CardBody>
        </>
      )}
    </>
  );
}
