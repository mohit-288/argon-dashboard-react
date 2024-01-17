import {React, useState, useEffect} from 'react';
import {
    FormGroup,
    Form,
    Input,
    Col,
    Button,
    Label, 
  } from 'reactstrap';
export default function DeleteBank(props) {
    const [settlementDetails, setSettlementDetails] = useState(null);
    const agentData = props.agentData;
    const [bankAccOptions, setBankAccOptions] = useState([]);
    const initialFormData = {accountType:"",bankAccNo:"",mobile : "", bankName : "", ifscCode : "", accName:""};
    const [details, setDetails] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState({show:false, refresh:false, status:"", message : ""});

    const baseUrl = process.env.REACT_APP_BASE_URL;

    useEffect(()=>{
      
        const fetchData = async () => {
            console.log("inside Delete bank use Effect")
            try{
              const response = await fetch(baseUrl + '/settlementdetail', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({AgentID:agentData.agentId , Key:agentData.txn_key})
              });
          
              const parsedData = await response.json();
              console.log(parsedData);
              setSettlementDetails(parsedData);
            } catch (error) {
            // Set error state if there's an error
          }
        }
        fetchData();
    },[agentData.agentId, agentData.txn_key, baseUrl, setSettlementDetails, errorMessage]);

    const clearAll = () => {
        setDetails(initialFormData);
    }
    const handleTypeSelect = (e) =>{
        const { name, value } = e.target;
        
        setDetails({...initialFormData, [name]:value});
        const beneAccounts = settlementDetails.settlementDetails;
        
        const results = beneAccounts.filter((item) => {
            return item.settlementType.toLowerCase() === (value.toLowerCase());
        });  
        setBankAccOptions(results); 
    };

    const handleAccSelect = (e) =>{
        const val = e.target.value;
        if(val === '-1'){
            setDetails(initialFormData);
            return false;
        }
        setDetails({...details,
            bankAccNo : bankAccOptions[val].accountNo,
            mobile : bankAccOptions[val].mobileNo,
             bankName : bankAccOptions[val].bankName,
              ifscCode : bankAccOptions[val].ifscCode,
               accName:bankAccOptions[val].accountName});
    };

    const validateForm = () => {
        const newErrors = {};
    
        Object.entries(details).forEach(([key, value]) => {
          if (!value.trim()) {
            newErrors[key] = `Please Enter ${key}`;
          }
        });
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateForm()){
            console.log('form is Valid');
            console.log("validated");
            const url = baseUrl + "/deleteSettlementAccount";
            const reqObj = {
                "Account_no":details.bankAccNo,
                "settlementType":details.accountType,
                "AgentID":agentData.agentId,
                "Key":agentData.txn_key
            };
            const res = await apiCall(e, url, reqObj);
            if(res.status === '1'){
                setDetails(initialFormData);
                setErrorMessage({show:true, refresh:!errorMessage.refresh, status:res.status, message:res.message});
                setTimeout(() => {
                    setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
                  }, 8000);
            }
            else{
                setErrorMessage({show:true, status:res.status, message:res.message});
            }
            console.log(res);
        }
        else{
            const firstErrorField = Object.keys(errors)[0];
            const errorFieldElement = document.getElementsByName(firstErrorField)[0];
            if(errorFieldElement === undefined){
                alert('Please Fill All Input Fields');
                return;
            }
            alert('Please Select Account Type')
            errorFieldElement.focus();
        }
    };

    const apiCall = async (e, url, reqObj) => {
        e.preventDefault();
        console.log("inside api call" + url + " | " +  JSON.stringify(reqObj));
        try{
          const response = await fetch(url , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqObj)
          });
      
          const json = await response.json();
          return json;
          
        } catch (error) {
        return alert("error");
      }
    };

    return (
        <div className="d-flex justify-content-center">
            
            <Form id="deleteBankForm" name="deleteBankForm">
                {errorMessage.show && ( <FormGroup row>
                        <Col lg="10" style={{textAlign:"center"}}>
                            {errorMessage.status === '1' ? 
                                <h4 style={{color:'green'}}>{errorMessage.message}</h4> : 
                                <h4 style={{color:'red'}}>{errorMessage.message}</h4>
                            }
                        </Col> 
                    </FormGroup>
                )}
                <FormGroup row>
                   <Col>
                        <Label>
                            Settlement Account Type<span style={{ color: 'red' }}> *</span>
                        </Label>
                    </Col>
                    <Col>
                        <Input onChange={handleTypeSelect}
                            type="select" name="accountType" id="accountType">

                            <option value="">SELECT </option>
                            {settlementDetails && settlementDetails.data.map((key)=>{
                                    return <option value={key.mode}>{key.Display_name}</option>
                                })}

                        </Input>
                    </Col>       
                </FormGroup>   
                      

                    
                <FormGroup row>
                    <Col>
                        <Label>
                            Bank A/C No.<span style={{ color: 'red' }}> *</span>        
                        </Label>        
                    </Col>
                    <Col>
                        <Input className="" name="bankAccNo" id="bankAccNo" type="select" onChange={handleAccSelect}>
                                <option value='-1'>Select Bank A/C No./Beneficiary name/Bank Name</option>
                                {bankAccOptions && bankAccOptions.map((key, index)=>{
                                return <option value={index}>{key.accountNo} - {key.accountName} - {key.bankName}</option>
                            })}
                        </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col>
                        <Label>
                            Contact No.         
                        </Label>
                    </Col>
                    <Col>
                        <Input
                        className="" value={details.mobile}
                        id="mobile" name="mobile" readOnly
                        type="AMOUNT" maxLength={10}
                        />
                    </Col>
                </FormGroup>
                   

                <FormGroup row> 
                    <Col>
                        <Label>
                            Bank Name                 
                        </Label>
                    </Col>
                    <Col>
                        <Input
                        className="" value={details.bankName}
                        id="bankName" name="bankName"
                        type="AMOUNT" readOnly
                        />
                    </Col> 
                </FormGroup>

                <FormGroup row>
                    <Col>
                        <Label>
                        IFSC Code.                     
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={details.ifscCode}
                            id="ifscCode" name="ifscCode"
                            type="AMOUNT" readOnly
                        />
                    </Col>
                </FormGroup>

                    
                <FormGroup row>
                    <Col>
            
                        <Label>
                        A/C Holder Name                       
                        </Label>
                    </Col>
                    <Col>
                        <Input
                        className="" value={details.accName}
                        id="accName" name="accName"
                        type="AMOUNT" readOnly
                        />
                    </Col>
                </FormGroup>
                    
                <br></br>
                <FormGroup row>
                    <Col style={{textAlign:"right"}}>
                        <Button
                        color='primary' 
                        class="btn btn-primary" 
                        type="button"
                        onClick={clearAll}
                        >
                        Cancel
                        </Button>   
                    </Col>
                    <Col>
                        <Button
                            color='primary'
                            class="btn btn-primary"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Delete
                        </Button>
                    </Col>
                    
                </FormGroup>
                  

                
            </Form>
        </div>
    )
}
