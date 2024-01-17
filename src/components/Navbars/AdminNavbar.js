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
import { Link } from "react-router-dom";
// reactstrap components
import { React, useState, useEffect } from "react";
import { Button, Navbar, Nav, Container, Media } from "reactstrap";
import PopOp from "components/PopUp/PopUp";

const AdminNavbar = (props) => {
  const [balance, setBalance] = useState(0.0);
  const [agentData, setAgentData] = useState(null);
  const [toggle, setToggle] = useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const changeToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setToggle(true);
  };

  const handleMouseLeave = () => {
    setToggle(false);
  };

  useEffect(() => {
    fetchBalance();
  }, [baseUrl]);

  const fetchBalance = async (e) => {
	let AgentID = "";
	let key = "";
	const dataFromLocalStorage = localStorage.getItem("apiData");
      if (dataFromLocalStorage) {
        const data = await JSON.parse(dataFromLocalStorage);
		AgentID = data.agentId;
    	key = data.txn_key;
        setAgentData(data);
      }
	 
    try {
      const response = await fetch(baseUrl + "/BalanceReq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AgentID, key }),
      });

      const res = await response.json();
      if (res.status === "0") {
        setBalance(res.balance);
      }
    } catch (error) {
      // Set error state if there's an error
    }
  };
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/admin"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <Button onClick={fetchBalance}>
              <span className="ni ni-money-coins"></span> Balance &nbsp;{" "}
              {balance}
            </Button>
            <Media
              className="align-items-center"
              onClick={() => changeToggle()}
              style={{ cursor: "pointer" }}
              onMouseEnter={handleMouseEnter}
            >
              <Media className="ml-2 d-none d-lg-block">
                <span
                  className="mb-0 text-sm font-weight-bold"
                  style={{ color: "white" }}
                >
                  My Account
                </span>
              </Media>
            </Media>
            {toggle ? <PopOp onClose={handleMouseLeave} /> : null}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
