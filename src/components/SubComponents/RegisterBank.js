import { React, useState, useEffect } from "react";

import {
  FormGroup,
  Form,
  Input,
  Col,
  Label,
  FormText,
  Button,
} from "reactstrap";

export default function RegisterBank(props) {
  const bankList = props.bankList;
  const agentData = props.agentData;
  const [settlementDetails, setSettlementDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState({
    show: false,
    refresh: false,
    status: "",
    message: "",
  });
  const [digitCount, setDigitCount] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const initialFormData = {
    accountType: "",
    mobileNum: "",
    accHolderName: "",
    accNum: "",
    cnfAccNum: "",
    bankName: "SELECT",
    ifscCode: "",
  };
  const [verifiedData, setVerifiedData] = useState({
    verifiedMessage: "",
    verifiedAccNo: "",
    verifiedBankName: "",
    verifiedBeneName: "",
    verifiedHolderName: "",
    isButtonDisabled: false,
  });
  const [formData, setFormData] = useState(initialFormData);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      console.log("inside register bank useEffect");
      try {
        const response = await fetch(baseUrl + "/settlementdetail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: agentData.agentId,
            Key: agentData.txn_key,
          }),
        });

        const parsedData = await response.json();
        setSettlementDetails(parsedData);
      } catch (error) {
        // Set error state if there's an error
      }
    };
    fetchData();
  }, [agentData.agentId,agentData.txn_key,baseUrl, setSettlementDetails, errorMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "cnfAccNum") {
      setDigitCount(value.length);
    }
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    if (value === "-1") {
      setFormData({ ...formData, ifscCode: "", [name]: value });
      return;
    }
    handleInputChange(e);
    const results = bankList.filter((item) => {
      return item.bname.toLowerCase() === value.toLowerCase();
    });
    if (results) {
      setFormData({
        ...formData,
        ifscCode: results[0].ifscCode,
        [name]: value,
      });
    }
  };

  const clearAll = () => {
    setFormData(initialFormData);
  };

  const validateFormData = () => {
    const mobileRegex = /^[6-9]\d{9}$/;

    if (formData.accountType === "" || formData.accountType === "-1") {
      alert("Please Select Settlement Account Type");
      document.registerBankForm.accountType.focus();
      //   document.walletLoadForm.routingVendor.style.border = '1px solid red';
      return false;
    }
    if (formData.mobileNum === null || formData.mobileNum === "") {
      alert("Please Enter Mobile Number");
      document.registerBankForm.mobileNum.focus();
      return false;
    }
    if (!mobileRegex.test(formData.mobileNum)) {
      alert("Please Enter Valid Mobile number");
      document.registerBankForm.mobileNum.focus();
      return false;
    }
    if (formData.accHolderName === null || formData.accHolderName === "") {
      alert("Please Enter Account Holder Name");
      document.registerBankForm.accHolderName.focus();
      return false;
    }
    if (formData.accNum === null || formData.accNum === "") {
      alert("Please Enter Bank Account Number");
      document.registerBankForm.accNum.focus();
      return false;
    }
    if (formData.cnfAccNum === null || formData.cnfAccNum === "") {
      alert("Please Confirm Your Bank Account Number");
      document.registerBankForm.cnfAccNum.focus();
      return false;
    }
    if (formData.cnfAccNum !== formData.accNum) {
      alert("Account Number Mismatch");
      document.registerBankForm.cnfAccNum.focus();
      return false;
    }
    if (formData.bankName === "" || formData.bankName === "-1") {
      alert("Please Select Bank Name");
      document.registerBankForm.bankName.focus();
      return false;
    }
    return true;
  };

  const handleVerifyBeneficiary = async (e) => {
    if (!validateFormData) {
      alert("Please check all Input data");
      e.preventDefault();
    }
    console.log("validated :", formData);
    const url = baseUrl + "/account-verification";
    const reqObj = {
      bankAccount: formData.cnfAccNum,
      beneMobileNo: formData.mobileNum,
      agentId: agentData.agentId,
      beneName: formData.accHolderName,
      agentMobileNo: agentData.mobileNumber,
      agentName: agentData.agentName,
      bankName: formData.bankName,
      ifsc: formData.ifscCode,
      key: agentData.txn_key,
    };
    const res = await apiCall(e, url, reqObj);

    if (res.status === "0") {
      console.log("status 0");
      setDialogOpen(true);
      setVerifiedData({
        verifiedMessage: res.message,
        verifiedAccNo: "",
        verifiedBankName: res.data.bankName,
        verifiedBeneName: res.data.nameAtBank,
        verifiedHolderName: res.data.nameAtBank,
      });
    } else if (res.status === "1") {
      setDialogOpen(true);
      setVerifiedData({
        isButtonDisabled: true,
        verifiedMessage: res.message,
        verifiedAccNo: "",
      });
    } else {
      setErrorMessage(res.message);
    }
    console.log(verifiedData);

    //const data1 = {status:"0", message:"Bank Register Successfully."};
  };

  const apiCall = async (e, url, reqObj) => {
    e.preventDefault();
    console.log("inside api call" + url + " | " + JSON.stringify(reqObj));
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      });

      const res = await response.json();
      console.log(res);
      return res;
    } catch (error) {
      return alert("error");
    }
  };

  const addBeneficiary = async (e) => {
    if (!validateFormData) {
      alert("Please check all Input data");
      e.preventDefault();
    }

    const url = baseUrl + "/addsettlementacount";
    const reqObj = {
      accountno: formData.cnfAccNum,
      mobileNo: formData.mobileNum,
      AgentID: agentData.agentId,
      holdername: formData.accHolderName,
      Settlement_type: formData.accountType,
      bankName: formData.bankName,
      ifsccode: formData.ifscCode,
      key: agentData.txn_key,
    };
    const res = await apiCall(e, url, reqObj);

    if (res) {
      if (res.status === "0") {
        setErrorMessage({
          show: true,
          refresh: !errorMessage.refresh,
          status: res.status,
          message: res.message,
        });
        setDialogOpen(false);
      } else if (res.status === "1") {
        setDialogOpen(false);
        setErrorMessage({
          show: true,
          refresh: !errorMessage.refresh,
          status: res.status,
          message: res.message,
        });
      } else {
        setErrorMessage({
          show: true,
          refresh: !errorMessage.refresh,
          status: res.status,
          message: res.message,
        });
      }
    } else {
      alert("Technical Error");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Form id="registerBankForm" name="registerBankForm">
        {errorMessage.show && (
          <FormGroup row>
            <Col lg="10" style={{ textAlign: "center" }}>
              {errorMessage.status === "0" ? (
                <h4 style={{ color: "green" }}>{errorMessage.message}</h4>
              ) : (
                <h4 style={{ color: "red" }}>{errorMessage.message}</h4>
              )}
            </Col>
          </FormGroup>
        )}
        {!isDialogOpen && (
          <div id="beneInfoDiv">
            <FormGroup row>
              <Col>
                <Label>
                  Settlement AccountType<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  type="select"
                  name="accountType"
                  id="accountType"
                  onChange={handleInputChange}
                >
                  <option>SELECT </option>
                  {settlementDetails &&
                    settlementDetails.data.map((key) => {
                      return (
                        <option value={key.mode}>{key.Display_name}</option>
                      );
                    })}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>
                  Contact No.<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  name="mobileNum"
                  id="mobileNum"
                  value={formData.mobileNum}
                  type="text"
                  onChange={handleInputChange}
                  className=""
                  maxLength={10}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>
                  A/C Holder Name<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  className=""
                  value={formData.accHolderName}
                  name="accHolderName"
                  id="accHolderName"
                  type="text"
                  onChange={handleInputChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>
                  Bank A/C No.<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  className=""
                  value={formData.accNum}
                  name="accNum"
                  id="accNum"
                  onChange={handleInputChange}
                  maxLength={20}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label style={{ marginBottom: "-100px" }}>
                  Confirm Bank A/C No.<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  style={{ marginBottom: "-20px" }}
                  className=""
                  value={formData.cnfAccNum}
                  name="cnfAccNum"
                  id="cnfAccNum"
                  type="text"
                  maxLength={20}
                  onChange={handleInputChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label></Label>
              </Col>
              <Col>
                <FormText>Number Of Digits : {digitCount}</FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>
                  Bank Name<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  type="select"
                  onChange={handleSelect}
                  name="bankName"
                  className=""
                  id="bankName"
                >
                  {" "}
                  value={formData.bankName}
                  <option selected value="-1">
                    SELECT{" "}
                  </option>
                  {bankList &&
                    bankList.map((key) => {
                      return (
                        key.accVerAvailabe === "Y" && (
                          <option>{key.bname}</option>
                        )
                      );
                    })}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Label>
                  IFSC Code<span style={{ color: "red" }}> *</span>
                </Label>
              </Col>
              <Col>
                <Input
                  name="ifscCode"
                  id="ifscCode"
                  maxLength={11}
                  className=""
                  type="text"
                  onChange={handleInputChange}
                  value={formData.ifscCode}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col>
                <Button
                  style={{ paddingInline: "4rem" }}
                  color="primary"
                  className="btn btn-primary"
                  type="button"
                  onClick={clearAll}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  style={{ width: "12rem" }}
                  color="primary"
                  className="btn btn-primary"
                  type="button"
                  onClick={addBeneficiary}
                >
                  Register Beneficiary
                </Button>
              </Col>
              <Col>
                <Button
                  color="primary"
                  class="btn btn-primary"
                  type="button"
                  onClick={handleVerifyBeneficiary}
                >
                  Verify Beneficiary
                </Button>
              </Col>
            </FormGroup>
          </div>
        )}
        {isDialogOpen && (
          <div className="">
            <FormGroup>
              <table style={{ textAlign: "center", alignContent: "center" }}>
                <tr>
                  <td style={{ paddingInline: "30px" }}>
                    <strong>Message</strong>
                    <tr style={{ color: "#004d6d" }}>
                      {verifiedData.verifiedMessage}
                    </tr>
                  </td>

                  <td style={{ paddingInline: "30px" }}>
                    <strong>Account Number</strong>
                    <tr style={{ color: "#004d6d" }} id="">
                      {formData.cnfAccNum}
                    </tr>
                  </td>

                  <td style={{ paddingInline: "30px" }}>
                    <strong>Bank Name</strong>
                    <tr style={{ color: "#004d6d" }} id="">
                      {verifiedData.verifiedBankName}
                    </tr>
                  </td>

                  <td style={{ paddingInline: "30px" }}>
                    <strong>Recipient Name</strong>
                    <tr style={{ color: "#004d6d" }} id="">
                      {verifiedData.verifiedHolderName}
                    </tr>
                  </td>
                </tr>
                <br></br>
                <tr style={{ paddingTop: "50px" }} id="addBeneficiaryLinkTr">
                  <td colSpan="4">
                    Do you want to register this bank in Settlement &nbsp;
                    &nbsp;
                    <Button
                      color="primary"
                      type="button"
                      onClick={addBeneficiary}
                      disabled={verifiedData.isButtonDisabled}
                      className="btn btn-primary"
                      id=""
                      style={{ textAlign: "center" }}
                    >
                      ADD
                    </Button>
                  </td>
                </tr>
              </table>
            </FormGroup>
          </div>
        )}
      </Form>
    </div>
  );
}
