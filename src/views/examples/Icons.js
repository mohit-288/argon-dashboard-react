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
import { useState , useEffect} from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const Icons = () => {
 
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem('apiData');
  
    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      const menuItems = parsedData.data;
      setMenuItems(menuItems);
    }
  }, []); 

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Icons</h3>
              </CardHeader>
              <CardBody>
              {menuItems && menuItems.map((category) => (      
                <Col lg="2" md="6" key={category.category}>
                  
                  <Row className="icon-examples">
                  <h2>{category.category}</h2>
                    {category.subMenueList.map((menuItem) => (
                      <button  key={menuItem.actionEvent}>
                        <a style={{ color:"black"}} href={menuItem.tagImage}>{menuItem.tagName}</a>
                        <img style={{width:"32px" , backgroundColor:"skyblue"}} src={menuItem.tagImage} alt={menuItem.tagName} />
                      </button>
                    ))}
                  </Row>
                </Col>
              ))}
              </CardBody>        
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Icons;
