import {React, useState, useEffect} from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Spinner
} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader.js';
import RegisterBank from 'components/SubComponents/RegisterBank';
import Settlement  from 'components/SubComponents/Settlement';
import DeleteBank  from 'components/SubComponents/DeleteBank';


const SettlementPage = () => {
 
  const [selected,setSelected]= useState('RegisterBank');

  const [bankList, setBankList] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("running again in settlement");
    let dataFromLocalStorage = localStorage.getItem('bankList');
  
    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      setBankList(parsedData);
    }

    dataFromLocalStorage = localStorage.getItem('apiData');

    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      setAgentData(parsedData);
      setIsLoading(false);
    }
    
  }, []);
  


  return (
    <>
      <UserHeader />
      {/* Page content */}
      {isLoading && <Spinner></Spinner>}
      {!isLoading && (
        <Container className="mt--9" fluid style={{ width: '90%'}}>
        <Row>
          <Col className="order-xl-1" >
            <Card className="bg-secondary shadow" >
              <CardHeader className="bg-white border-0" style={{boxShadow: '5px 0px 18px #888888'}}>
                <Row className="align-items-center">
                  
                    <div class="container text-center">
                      <div
                        style={{ color:"blue" ,cursor: 'pointer' , fontWeight: 'bold' }}
                      >
                        <Button style={{ backgroundColor: (selected === "RegisterBank") ? '#5e72e4' : 'white' ,
                        color: (selected === "RegisterBank") ? 'white' : 'black' ,
                          marginInline:"4rem"}} class="col" onClick={()=>setSelected("RegisterBank")}>REGISTER BANK</Button>
                        <Button style={{backgroundColor: (selected === "Settlement") ? '#5e72e4' : 'white' ,
                        color: (selected === "Settlement") ? 'white' : 'black' ,
                          marginInline:"4rem"}} class="col" onClick={()=>setSelected("Settlement")}> SETTLEMENT </Button>
                        <Button style={{backgroundColor: (selected === "DeleteBank") ? '#5e72e4' : 'white' ,
                        color: (selected === "DeleteBank") ? 'white' : 'black' ,
                          marginInline:"4rem"}} class="col" onClick={()=>setSelected("DeleteBank")}> DELETE BANK</Button>
                      </div>
                    </div>
              
                </Row>
              </CardHeader>
              <CardBody style={{ boxShadow: '5px 10px 18px #888888'}}>
              {
  selected === "RegisterBank" ? <RegisterBank bankList={bankList} agentData = {agentData} /> : 
  selected === "Settlement" ? <Settlement agentData = {agentData} /> :
   selected === "DeleteBank" ? <DeleteBank agentData = {agentData} /> :null
}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      )
        
      }
    </>
  );
};

export default SettlementPage;
