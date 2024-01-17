import { React, useState, useEffect } from "react";
import Header from "components/Headers/Header";

import {
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Spinner,
  Button,
  Card,
  CardHeader,
  Container,
  CardBody,
} from "reactstrap";

const Bbps = () => {
  const [formData, setFormData] = useState({
    showBiller : false,
    showParam : false,
    paramList : null,
    showBill: false,
    showFetch : false,
  });
  const [fetching, setFetching] = useState(false);
  const [vendor, setVendor] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [billerList, setBillerList] = useState([]);
  const [agentData, setAgentData] = useState(null);
  const [billData , setBillData] = useState({});
  const [errorMessage, setErrorMessage] = useState({show:false, refresh:false, status:"", message : ""});
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData1 = async () => {
      const dataFromLocalStorage = localStorage.getItem("apiData");
      let AgentID = "";
      let key = "";

      if (dataFromLocalStorage) {
        const data = await JSON.parse(dataFromLocalStorage);
        setAgentData(data);
        AgentID = data.agentId;
        key = data.txn_key;
      }
      console.log("inside BBPS useEffect");
      try {
        const response = await fetch(baseUrl + "/getVendorName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AgentID, key }),
        });

        const parsedData = await response.json();
        console.log(parsedData);
        if (parsedData.status === "0") {
            setVendor(parsedData.vendor);
        }
      } catch (error) {
        // Set error state if there's an error
      }
    };

    const fetchData2 = async () => {
        
        console.log("inside BBPS useEffect");
        try {
          const response = await fetch(baseUrl + "/billerCategoryList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ AgentID : agentData.agentId, key : agentData.txn_key, Vendor : vendor }),
          });
  
          const parsedData = await response.json();
          console.log(parsedData);
          if (parsedData.status === "0") {
            setCategoryList(parsedData.categoryList);
          }
        } catch (error) {
          // Set error state if there's an error
        }
      };

    fetchData1();
    fetchData2();
  }, [baseUrl, vendor]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getBillers = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, showBiller: true, showParam : false, showFetch : false, showBill : false });

    console.log("inside getBillers");
    try {
      const response = await fetch(baseUrl + "/billerList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: agentData.agentId,
          key: agentData.txn_key,
          categoryName: value,
          Vendor: vendor,
        }),
      });

      const parsedData = await response.json();
      console.log(parsedData);
      if (parsedData.status === "0") {
        setBillerList(parsedData.billerList);
      }
    } catch (error) {
      // Set error state if there's an error
    }
  };

  const handleBiller = async (e) => {
    const { name, value } = e.target;
    console.log(billerList[value]);

    console.log("inside handleBiller");
    try {
      const response = await fetch(baseUrl + "/billerDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AgentID: agentData.agentId,
          key: agentData.txn_key,
          operatorMasterId: billerList[value].operatorMasterId,
          Vendor: vendor,
        }),
      });

      const parsedData = await response.json();
      console.log(parsedData);
      if (parsedData.status === "0") {
        setFormData({
            ...formData,
            billerId: parsedData.billerId,
            showParam: true,
            showFetch : true,
            showBill : false ,
            paramList: parsedData.paramList,
          });
      }
    } catch (error) {
      // Set error state if there's an error
    }

  };

  const fetchBill = async () => {
    console.log(formData);
    setFetching(true);
    try {
        const response = await fetch(baseUrl + "/billfetchNew", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: agentData.agentId,
            key: agentData.txn_key,
            // mobile: formData.mobile,
            channel : "Web",
            billerId : formData.billerId,
            customerId : formData.param,
          }),
        });
  
        const res = await response.json();
        if(res.status === "0"){
            console.log(res);
            setFormData({...formData, showBill : true, showFetch:false});
            setBillData(res);
            
        }
        else{
          setErrorMessage({show:true,refresh:!errorMessage.refresh, status:res.status, message:res.message});
            setTimeout(() => {
                setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
              }, 8000);
        }
        setFetching(false);
    } catch (error){

    }
  };


  const handleBillPay = async (e) => {
    console.log(formData);
    setFetching(true);
    try {
        const response = await fetch(baseUrl + "/bbpsbillpayNew", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: agentData.agentId,
            key: agentData.txn_key,
            // mobile: formData.mobile,
            channel : "Web",
            billerId : formData.billerId,
            customerId : formData.param,
            amount : billData.amount,
          }),
        });
  
        const res = await response.json();
        if(res.status === "0"){
            console.log(res);
            setErrorMessage({show:true,refresh:!errorMessage.refresh, status:res.status, message:res.message});
            setFetching(false);
            setTimeout(() => {
              setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
            }, 10000);
        }
        else{
          setErrorMessage({show:true,refresh:!errorMessage.refresh, status:res.status, message:res.message});
          setFetching(false);
            setTimeout(() => {
                setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
              }, 10000);
        }
        
    } catch (error){

    }
  };

  return (
    <>
      <Header />
      <Container className="mt--9" fluid>
        <Card style={{ minHeight: "33rem" }} className="bg-secondary shadow">
          <CardHeader
            style={{ textAlign: "right", backgroundColor: "#9cc8ec" }}
          >
            <Row className="justify-content-center">
              <Col className="">
                <div>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className=""
                      src="https://portal.bankit.in:9090/RO/images/bbps-logo.png"
                    />
                  </a>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <div style={{paddingInline:"10%"}} className="justify-content-center">
              <Form>
              {errorMessage.show && ( <FormGroup row>
                        <Col lg="10" style={{textAlign:"center"}}>
                            {errorMessage.status === '0' ? 
                                <h4 style={{color:'green'}}>{errorMessage.message}</h4> : 
                                <h4 style={{color:'red'}}>{errorMessage.message}</h4>
                            }
                        </Col> 
                    </FormGroup>
                )}
                <FormGroup row>
                  <Col>
                    <Label>
                      Biller Category<span style={{ color: "red" }}> *</span>
                    </Label>
                  </Col>
                  <Col>
                    <Input
                      type="select"
                      id="category"
                      name="category"
                      onChange={getBillers}
                    >
                      <option value="-1">--Select--</option>
                      {categoryList &&
                        categoryList.map((key) => {
                          return <option value={key}>{key}</option>;
                        })}
                    </Input>
                  </Col>
                </FormGroup>
                {formData.showBiller && (
                  <FormGroup row>
                    <Col>
                      <Label>
                        Biller Name<span style={{ color: "red" }}> *</span>
                      </Label>
                    </Col>
                    <Col>
                      <Input type="select" onChange={handleBiller} id="biller" name="biller"> 
                        <option value="-1">--Select--</option>
                        {billerList &&
                          billerList.map((key, index) => {
                            return (
                              <option value={index}>{key.billerName}</option>
                            );
                          })}
                      </Input>
                    </Col>
                  </FormGroup>
                )}
                {formData.showParam && (
                  <>
                    {/* <FormGroup row>
                      <Col>
                        <Label>
                          My Mobile Number
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Input minLength={10} maxLength={10}></Input>
                      </Col>
                    </FormGroup> */}
                    {formData.paramList.map((key, index) => {
                        return <>
                            <FormGroup row>
                                <Col>
                                    <Label>
                                    {key.paramName}
                                    <span style={{ color: "red" }}> *</span>
                                    </Label>
                                </Col>
                                {formData.showBill ? 
                                  <Col className="mb-3">
                                      <Input id="param" name="param" readOnly onChange={handleInput}></Input>
                                  </Col> : 
                                  <Col className="mb-3">
                                      <Input id="param" name="param" onChange={handleInput}></Input>
                                  </Col>
                                }
                            </FormGroup>
                        </>
                    })}
                    </>
                )}
                {formData.showFetch && (
                    <FormGroup>
                        <Col style={{ textAlign: "center" }}>
                        {!fetching ? 
                            <Button onClick={fetchBill} color="primary">Fetch Bill</Button>
                            : <Button color="primary" disabled>
                                <Spinner size="sm">
                                    Loading...
                                </Spinner>
                                <span>
                                    {' '}Fetching
                                </span>
                            </Button>
                        }
                            
                        </Col>
                    </FormGroup> 
                )}
                {formData.showBill && (
                    <>
                    <FormGroup row>
                      <Col>
                        <Label>
                            Customer Name
                            <span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Input readOnly value={billData.customerName}></Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                            Due Date
                            <span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Input readOnly value={billData.dueDate}></Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                            Amount
                            <span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Input readOnly id="amount" name="amount" value={billData.amount}></Input>
                      </Col>
                    </FormGroup>
                    
                    <FormGroup>
                      <Col style={{ textAlign: "center" }}>
                        {!fetching ? 
                            <Button onClick={handleBillPay} color="primary">Pay Bill</Button>
                            : <Button color="primary" disabled>
                                <Spinner size="sm">
                                    Loading...
                                </Spinner>
                                <span>
                                    {' '}Paying
                                </span>
                            </Button>
                        }
                      </Col>
                    </FormGroup> 
                 
                    </>
                )}
              </Form>
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Bbps;
