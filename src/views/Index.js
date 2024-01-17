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
import React, { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)

import {
  Card,
  CardBody,
  Container,
  CardTitle,
  Row,
  Col,
  Spinner,
} from "reactstrap";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [bankList, setBankList] = useState(null);
  const [data, setData] = useState(null);
  

  const baseUrl = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem("apiData");
    let AgentID = "";

    if (dataFromLocalStorage) {
      const agentData = JSON.parse(dataFromLocalStorage);
      //alert(agentData);
      AgentID = agentData.agentId;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + "/GetBankList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AgentID }),
        });

        const json = await response.json();
        const bankList = json.BankList;
        localStorage.setItem("bankList", JSON.stringify(bankList));
        setBankList(bankList);
      } catch (error) {
        // Set error state if there's an error
      }

      try {
        const response = await fetch(baseUrl + "/dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Key: "9df96bb80bdb81a65648ccae348d60d6f54ea887",
            AgentID: "26898",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const dash = data.dashBoardData;
        setData(dash);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setData, baseUrl]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container
        style={{
          background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
        }}
        className="mt--8"
        fluid
      >
        {!data ? (
          <div
            style={{
              textAlign: "center",
              height: "25rem",
            }}
          >
            <Spinner color="secondary" ></Spinner>
          </div>
        ) : (
          <div>
            {/* Card stats */}
            <Row>
              {data &&
                data.map((key) => (
                  <Col lg="6" xl="4">
                    <Card className="card-stats mb-4 mb-xl-4">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {key.service}
                            </CardTitle>
                            This month
                            <span className="h2 font-weight-bold mb-0">
                              {" "}
                              {key.currentMonthAmount}
                            </span>
                            <br />
                            Last month
                            <span className="h4 font-weight-bold mb-0">
                              {" "}
                              {key.previousMonthAmount}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                              <i className="fas fa-chart-bar" />
                            </div>
                          </Col>
                        </Row>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          {key.businessVolumegrowth.startsWith("-") ? (
                            <span className="text-danger mr-2">
                              <i className="fa fa-arrow-down" />{" "}
                              {key.businessVolumegrowth} %
                            </span>
                          ) : (
                            <span className="text-success mr-2">
                              <i className="fa fa-arrow-up" />{" "}
                              {key.businessVolumegrowth} %
                            </span>
                          )}{" "}
                          <span className="text-nowrap"> in current month</span>
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};

export default Index;
