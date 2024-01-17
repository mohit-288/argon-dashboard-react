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
/*eslint-disable*/
import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import { MDBIcon } from 'mdb-react-ui-kit';
import {
  Button,
  Collapse,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  NavbarText,
  Col,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";


const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input) const [storedData, setStoredData] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [balance, setBalance] = useState("0.0");
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const dataFromLocalStorage = localStorage.getItem("apiData");
    let AgentID = "";
    let key = "";
    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      const parentList = parsedData.parentList;
      AgentID = parsedData.agentId;
      key = parsedData.txn_key;
      setAgentData(parsedData);
      setStoredData(parentList);
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
      console.log(res);
      if (res.status === "0") {
        setBalance(res.balance);
      }
    } catch (error) {
      // Set error state if there's an error
    }
  };
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes, storedData) => {
    return routes.map((prop, key) => {
      return storedData.some((v) => v.dispName === prop.name) ? (
        <NavItem size="sm" key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            {/* <img style={{width:"32px", height:"32px", borderRadius:"50%" , 
            backgroundColor:"#31304D", marginBottom:"12px"}}src={prop.icon} /> */}

            <NavbarText
              style={{
                paddingLeft: "10px",
                marginBlock: "-5px",
                fontWeight: "bold",
                
              }}
            >
              {prop.name}
            </NavbarText>
          </NavLink>
        </NavItem>
      ) : null;
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="sm"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
       
       <Button outline onClick={fetchData}><MDBIcon className='ms-1' size="1x" icon="coins"> &nbsp; {balance}</MDBIcon></Button>
        <Button color="secondary" ><MDBIcon className='ms-1' size="2x" fas icon="user-circle" /></Button>
   
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>

          {/* Navigation */}
          
          <Nav navbar>
          
          {createLinks(routes, storedData)}
          
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
