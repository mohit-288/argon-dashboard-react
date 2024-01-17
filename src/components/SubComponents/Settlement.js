import {React, useEffect, useState} from 'react';
import {
    FormGroup,
    Form,
    Input,
    Col,
    Label,
  } from 'reactstrap';
import sha1 from 'js-sha1';

export default function Settlement(props) {
    const [settlementDetails, setSettlementDetails] = useState(null);
    const agentData = props.agentData;
    const [bankAccOptions, setBankAccOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState({show:false, refresh:false, status:"", message : ""});
    const [tpinData, setTpinData] = useState({});

    const initialFormData = {
        accountType:"",
        bankAccNo:"",
        mobile : "", 
        bankName : "", 
        ifscCode : "", 
        accName:"", 
        charges:"", 
        balance:"",
        amount:"",
        tPin:"",
        transferMode:"INSTANT",
        serviceAssurance:true,
        checkboxId:false
    }
    
    const [formData, setFormData] = useState(initialFormData);
   
    const baseUrl = process.env.REACT_APP_BASE_URL;

    useEffect(()=>{
        const fetchData = async () => {
            try{
              const response = await fetch(baseUrl + '/settlementdetail', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({AgentID : agentData.agentId, Key: agentData.txn_key})
              });
          
              const parsedData = await response.json();
              console.log("useEffect of Settlement");
              setSettlementDetails(parsedData);
            } catch (error) {
            // Set error state if there's an error
          }
        }
        const tpinFetch = async () => {
            try{
                const response = await fetch(baseUrl + '/tpin_changed', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({agentId : agentData.agentId})
                });

                const parsedData = await response.json();
                setTpinData(parsedData.res);


            } catch (error){

            }
        }
        
        fetchData();
        tpinFetch();
    },[agentData.agentId, agentData.txn_key, baseUrl, setSettlementDetails, errorMessage]);

    
  
  const handleTypeSelect = (e) =>{
        const updatedFormDetails = { ...initialFormData };

        const { value } = e.target;
        const modeDetails = settlementDetails.data[value];
        
        const mode = modeDetails.mode;
        
        const beneAccounts = settlementDetails.settlementDetails;
        
        const results = beneAccounts.filter((item) => {
            return item.settlementType.toLowerCase() === (mode.toLowerCase());
        });  
        setBankAccOptions(results);

        updatedFormDetails.accountType = mode;
        updatedFormDetails.balance = modeDetails.limit;
        updatedFormDetails.charges = modeDetails.charges; 

        setFormData(updatedFormDetails);
    };

    const clearAll = () => {
        setFormData(initialFormData);
    }

    const handleAccSelect = (e) =>{
        const val = e.target.value;
        
        setFormData({ ...formData,
            bankAccNo : bankAccOptions[val].accountNo,
            mobile : bankAccOptions[val].mobileNo,
            bankName : bankAccOptions[val].bankName,
            ifscCode : bankAccOptions[val].ifscCode,
            accName:bankAccOptions[val].accountName})
    };
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData({...formData, [name]:value});
    };

    const handleCheck = (e) => {
        const {name, checked} = e.target;
        setFormData({...formData, [name]:checked});
        
    }

    const validateForm = (e) => {
        e.preventDefault();
        if (formData.accountType === "" || formData.accountType === "-1") {
            alert("Please Select Settlement Account Type");
            document.settlementForm.accountType.focus();
            //   document.walletLoadForm.routingVendor.style.border = '1px solid red';
            return false;
        }
        if (formData.mobile === null || formData.mobile === "") {
            alert("Please Enter Mobile Number");
            document.settlementForm.mobile.focus();
            return false;
        }
        if (formData.bankAccNo === null || formData.bankAccNo === "") {
            alert("Please Enter Bank Account Number");
            document.settlementForm.bankAccNo.focus();
            return false;
        }
        if (formData.accName === null || formData.accName === "") {
            alert("Please Enter Account Holder Name");
            document.settlementForm.accName.focus();
            return false;
        }
        if (formData.amount === "" || formData.amount === "-1") {
            alert("Please Enter Amount");
            document.settlementForm.amount.focus();
            return false;
        }
        if (formData.amount < 1) {
            alert("Amount Should Be Greater than 1");
            document.settlementForm.amount.focus();
            return false;
        }
        if(formData.tPin === null || formData.tPin === ""){
            alert("Please Enter Correct Transaction Pin");
            document.settlementForm.tPin.focus();
            return false;
        }
        if(formData.checkboxId === false){
            alert("Please agree to terms and conditions before transaction");
            document.settlementForm.checkboxId.focus();
            return false;
        }
        createRequest(e);
        return true;
    }

    const createRequest = async (e) => {
        console.log("validated :" ,formData);
        const url = baseUrl + "/settlement";
        const reqObj = {
            "Key":agentData.txn_key,
            "AgentID":agentData.agentId,
            "amount":formData.amount,
            "transferMode":formData.transferMode,
            "accountNo":formData.bankAccNo,
            "settlementType":formData.accountType,
            "serviceAssurance":formData.serviceAssurance ? '1' : '0',
            "tpin": !tpinData.status ? tpinData.tpin : sha1(formData.tPin),
            "channel":"Web",
            "settlementAmountId":"-1"
        };

        const res = await apiCall(e, url, reqObj);

        if(res.status === '0'){
            setErrorMessage({show:true,refresh:!errorMessage.refresh, status:res.status, message:res.message});
            clearAll();
            setTimeout(() => {
                setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
              }, 8000);
        }
        else{
            setErrorMessage({show:true,refresh:!errorMessage.refresh, status:res.status, message:res.message});
            setTimeout(() => {
                setErrorMessage({show:false, refresh:!errorMessage.refresh, status:"", message : ""});
              }, 8000);
        }
    }

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
      
          const res = await response.json();
          console.log(res);
          return res;
          
        } catch (error) {
        return alert("error");
      }
    }
    

    return (
        <div className="d-flex justify-content-center">

            <Form id="settlementForm" name="settlementForm">
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
                            Settlement Type<span style={{ color: 'red' }}> *</span> 
                        </Label>
                    </Col>
                    <Col>
                            <Input
                            type="select" name="accountType" id="accountType" onChange={handleTypeSelect}> 

                            <option value="">SELECT </option>
                            {settlementDetails && settlementDetails.data.map((key, index)=>{
                                    return <option value={index}>{key.Display_name}</option>
                                })}
                        </Input>
                    </Col>
                </FormGroup>
                   
                <FormGroup row>
                    <Col>
                        <Label>
                            Balance          
                        </Label>
                   </Col>
                   <Col>
                        <Input
                        className="" value={formData.balance}
                        id="balance" name="balance"
                        readOnly
                        />
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
                                <option>Select Bank A/C No./Beneficiary name/Bank Name</option>
                                {bankAccOptions && bankAccOptions.map((key, index)=>{
                                return <option value={index}>{key.accountNo} - {key.accountName} - {key.bankName}</option>
                            })}
                        </Input>
                    </Col>
                </FormGroup>
  
                <FormGroup row>
                    <Col>
            
                        <Label>
                            Contact No. :                 
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={formData.mobile}
                            id="mobile" name="mobile"
                            readOnly
                            />
                    </Col>
                </FormGroup>
  
                <FormGroup row>
                    <Col>
                    
                        <Label>
                            Bank Name :                    
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={formData.bankName}
                            id="bankName" name="bankName"
                            readOnly
                            />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col>
                        <Label>
                            IFSC Code :                       
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={formData.ifscCode}
                            id="ifscCode" name="ifscCode"
                            readOnly
                            />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col>
                        <Label>
                            A/C Holder Name<span style={{ color: 'red' }}> *</span>                     
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={formData.accName}
                            id="accName" name="accName"
                            readOnly
                            />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col>
                        <Label>
                            Bankit Fee<span style={{ color: 'red' }}> *</span>                  
                        </Label>
                   </Col>
                   <Col>
                        <Input
                            className="" value={formData.charges}
                            name="charges"
                            id="charges"
                            readOnly
                            />
                    </Col>
                </FormGroup>
                        

                <FormGroup row>
                    <Col>
                    <Label>
                        Amount<span style={{ color: 'red' }}> *</span>                   
                    </Label>
                    </Col>
                    <Col>
                        <Input
                            className="" value={formData.amount} onChange={handleInputChange}
                            id="amount" name="amount" type="amount"
                            />
                    </Col>
                </FormGroup>

                       
                <FormGroup row>
                    <Col>
                        <Label>
                            Transfer Mode<span style={{ color: 'red' }}> *</span>                  
                        </Label>
                    </Col>
                    <Col>
                        <Input
                            className=""
                            id="transferMode" name="transferMode" type="select" onChange={handleInputChange}>
                            <option selected value="INSTANT">INSTANT</option>
                        </Input>
                    </Col>
                </FormGroup>
   
                <FormGroup row>
                    <Col>

                        <Label>
                            Transaction Pin<span style={{ color: 'red' }}> *</span>                 
                        </Label>
                    </Col>
                    <Col>
                        <Input
                        type='password' value={!tpinData.status ? tpinData.tpin : formData.tPin} onChange={handleInputChange}
                        id="tPin" name="tPin"
                        />
                    </Col>
                </FormGroup>
 
                <FormGroup>
                
                    <Col>
                        <Input type="checkbox"  name="serviceAssurance" onChange={handleCheck} id="serviceAssurance" />
                        <span style={{color:"#c11c1c", fontSize:"100%",  fontWeight: "600",  
                                textTransform: "none !important" }}>
                        <a href="https://portal.bankit.in:9090/Demo/SecurePlus.pdf">
                        <img style={{width:"62px"}} alt="Secure Plus" 
                        src='https://portal.bankit.in:9090/RO/images/icon/Secure%20Plus%20Logo.png' />
                        </a> Rs. <span id="finalServiceAssuranceFee"> 1 </span> will be charged for opting SecurePlus
                        assurance plan on this transaction.
                        </span>
                                    
                    </Col>
                    <br></br>
                    <Col>
                        <Input type="checkbox" name="checkboxId" onChange={handleCheck} id="checkboxId"></Input>
                        <span style={{color:"#5e72e4", fontSize:"100%",  fontWeight: "600",  
                                        textTransform: "none !important" }}>
                            <a href="https://portal.bankit.in:9090/Demo/Settlement/ConsentForm.pdf"> 
                            I hereby agree to the terms and conditions of this settlement transaction. </a>
                               
                        </span>
                                
                    </Col>
                    
                </FormGroup>
                   

                   
                <FormGroup row>
                    <Col style={{textAlign:"right"}}>
                        <button 
                            class="btn btn-primary"
                            type="button"
                        >
                            Cancel
                        </button>
                    </Col>
                    <Col>
                        <button
                            class="btn btn-primary"
                            type="button"
                            onClick={validateForm}
                        >
                            Submit
                        </button>
                        
                    </Col> 
                </FormGroup>
            </Form>
        </div>
    )
}
