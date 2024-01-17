import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Label,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import { DatePicker } from "reactstrap-date-picker";
import UserHeader from "components/Headers/UserHeader.js";

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const WalletUploadRecharge = (props) => {
  const date = new Date();
  const today = date.toISOString();
  const [depositDate, setDepositDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Select");
  const [agentData, setAgentData] = useState(null);
  const [wbBankList, setWbBankList] = useState(null);
  const [senderBanks, setSenderBanks] = useState(null);
  const [accDetails, setAccDetails] = useState(null);
  const [wbModeList, setWbModeList] = useState(null);
  const [wbReqList, setWbReqList] = useState(null);
  const [accAmount, setAccAmount] = useState(null);
  const [cashForm, setCashForm] = useState({});
  const [cdmForm, setCdmForm] = useState({
    depositorMobile: "",
    digitCount: 0,
  });
  const [neftForm, setNeftForm] = useState({ digitCount: 0 });
  const [errorMessage, setErrorMessage] = useState({
    show: false,
    refresh: false,
    status: "",
    message: "",
    loading: true,
  });
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    document.body.style.overflow = "auto";

    const fetchData = async () => {
      let data = null;
      const dataFromLocalStorage = localStorage.getItem("apiData");
      if (dataFromLocalStorage) {
        data = await JSON.parse(dataFromLocalStorage);
        setAgentData(data);
      }
      try {
        const response = await fetch(baseUrl + "/v1/WalletBalDepositBankList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: data.agentId,
            Key: data.txn_key,
          }),
        });

        const parsedData = await response.json();
        if (parsedData.status === "0") {
          setWbBankList(parsedData.WalletBalRequestBankList);
        }
      } catch (error) {
        // Set error state if there's an error
      }

      try {
        const response = await fetch(baseUrl + "/getAccountDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: data.agentId,
            key: data.txn_key,
          }),
        });

        const parsedData = await response.json();
        if (parsedData.status === "0") {
          setAccDetails(parsedData);
        }
      } catch (error) {
        // Set error state if there's an error
      }
      try {
        const response = await fetch(
          baseUrl + "/WalletBalRequestPaymentModeList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              AgentID: data.agentId,
              Key: data.txn_key,
            }),
          }
        );

        const parsedData = await response.json();

        if (parsedData.status === "0") {
          setWbModeList(parsedData.WalletBalRequestBankList);
        }
      } catch (error) {
        // Set error state if there's an error
      }

      try {
        const response = await fetch(baseUrl + "/WalletBalDepositerBankList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: data.agentId,
            Key: data.txn_key,
          }),
        });

        const parsedData = await response.json();
        if (parsedData.status === "0") {
          setSenderBanks(parsedData.WalletBalRequestBankList);
        }
      } catch (error) {
        // Set error state if there's an error
      }

      try {
        const response = await fetch(baseUrl + "/WalletBalRequestDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AgentID: data.agentId,
            Key: data.txn_key,
          }),
        });

        const parsedData = await response.json();
        if (parsedData.status === "0") {
          setWbReqList(parsedData.depositList);
        }
      } catch (error) {
        // Set error state if there's an error
      }
      setErrorMessage({ loading: false });
    };
    fetchData();
  }, [baseUrl, errorMessage.refresh]);

  const fetchCharges = async (bankName) => {
    fetch(baseUrl + "/WalletBalRequestServiceCharge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        AgentID: agentData.agentId,
        Key: agentData.txn_key,
        amount: amount,
        paymentMode: mode,
        ReceivingBankName: bankName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "0") {
          setAccAmount({
            acceptedAmt: data.acceptedAmt,
            charges: data.charges,
          });
        } else {
          setAccAmount({ acceptedAmt: 0, charges: 0 });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check file size (in bytes)
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (fileSizeInBytes > maxSizeInBytes) {
        event.target.value = null;
        toast.error("File size should be less than 5MB.");
      } else if (!allowedTypes.includes(file.type)) {
        event.target.value = null;
        toast.error("Only PDF/JPG/PNG file types allowed.");
      } else {
        if (mode === "CASH IN BANK") {
          setCashForm({ ...cashForm, file: file });
        } else if (mode === "CDM") {
          setCdmForm({ ...cdmForm, file: file });
        } else {
          setNeftForm({ ...neftForm, file: file });
        }
      }
    }
  };

  const handleSelfBank = (select) => {
    const value = select.value;
    let bankData = "";

    bankData = wbBankList[value];

    if (mode === "CASH IN BANK") {
      setCashForm({
        ...cashForm,
        sentToBank: bankData.bankName,
        receivingBankAcc: bankData.accountNumber,
        receivingBranchName: bankData.bankBranchName,
      });
    } else if (mode === "CDM") {
      setCdmForm({
        ...cdmForm,
        sentToBank: bankData.bankName,
        receivingBankAcc: bankData.accountNumber,
      });
    } else if (mode === "NEFT/RTGS/FT/IMPS") {
      setNeftForm({
        ...neftForm,
        sentToBank: bankData.bankName,
        sentToBankAccNo: bankData.accountNumber,
        neftBeneName: bankData.accountName,
      });
    }
    fetchCharges(bankData.bankName);
  };

  const bankOptions =
    wbBankList &&
    wbBankList.map((key, index) => ({
      value: index,
      label: key.bankName + " - " + key.accountNumber,
    }));

  const sentBankOptions =
    senderBanks &&
    senderBanks.map((key) => ({
      value: key,
      label: key,
    }));

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (mode.localeCompare("Select", "en", { sensitivity: "case" }) === 0) {
      return;
    }
    if (
      mode.localeCompare("CASH IN BANK", "en", { sensitivity: "case" }) === 0
    ) {
      setCashForm({ ...cashForm, [name]: value });
    } else if (mode.localeCompare("CDM", "en", { sensitivity: "case" }) === 0) {
      setCdmForm({ ...cdmForm, [name]: value });
    } else if (
      mode.localeCompare("NEFT/RTGS/FT/IMPS", "en", { sensitivity: "case" }) ===
      0
    ) {
      setNeftForm({ ...neftForm, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "Select") {
      toast.error("Please select payment mode.");
      return false;
    }
    if (amount === "" || amount <= 999) {
      toast.error("Amount should be greater than 999.");
      return false;
    }
    if (depositDate === null || depositDate === "" || depositDate === "0") {
      toast.error("Please Select Deposit Date.");
      return false;
    }

    let reqBody = {
      AgentID: agentData.agentId,
      Key: agentData.txn_key,
      amount: amount,
      paymentMode: mode,
      acceptedAmt: accAmount.acceptedAmt,
      charges: accAmount.charges,
    };

    if (mode === "CASH IN BANK") {
      if (validateCashForm(e)) {
        reqBody = {
          ...reqBody,
          depositorName: cashForm.depositorName,
          depostitBankBranchCode: cashForm.depositBranchCode,
          depostitBankLocation: cashForm.depositLocation,
          depostitBankName: cashForm.sentToBank,
          senderAccountNo: cashForm.receivingBankAcc,
          depositDate: depositDate,
          remark: cashForm.cashRemark,
          receiptName: cashForm.file.name,
          receipt: cashForm.file,
        };
        const url = baseUrl + "/WalletBalRequest";
        apiCall(e, url, reqBody);
        clearCashForm();
      } else {
        return false;
      }
    } else if (mode === "CDM") {
      if (validateCdmForm(e)) {
        reqBody = {
          ...reqBody,
          transferDate: depositDate,
          depositByMobile: cdmForm.depositorMobile,
          cdmBranchName: cdmForm.cdmBranchName,
          depostitBankName: cdmForm.sentToBank,
          senderAccountNo: cdmForm.receivingBankAcc,
          depositDate: depositDate,
          remark: cdmForm.cdmRemark,
          receiptName: cdmForm.file.name,
          receipt: cdmForm.file,
        };
        const url = baseUrl + "/WalletBalRequest";
        apiCall(e, url, reqBody);
        clearCdmForm();
      } else {
        return false;
      }
    } else if (mode === "NEFT/RTGS/FT/IMPS") {
      if (validateNeftForm(e)) {
        reqBody = {
          ...reqBody,
          sentDate: depositDate,
          senderAccountNo: neftForm.neftSenderAccNo,
          senderBank: neftForm.sentViaBank,
          txnNo: neftForm.transactionNum,
          receivingBank: neftForm.sentToBank,
          beneficiaryName: neftForm.neftBeneName,
          depositorActNo: neftForm.sentToBankAccNo,
          depositDate: depositDate,
          remark: neftForm.neftRemark,
          receiptName: neftForm.file.name,
          receipt: neftForm.file,
        };
        const url = baseUrl + "/WalletBalRequest";
        apiCall(e, url, reqBody);
        clearNeftForm();
      } else {
        return false;
      }
    }
    //console.log(cashForm);
  };

  const validateCashForm = (e) => {
    e.preventDefault();

    if (cashForm.depositorName === undefined || cashForm.depositorName === "") {
      toast.error("Please enter depositer name.");
      return false;
    }
    if (cashForm.sentToBank === undefined || cashForm.sentToBank === "") {
      toast.error("Please select sent to bank.");
      return false;
    }
    if (
      cashForm.receivingBankAcc === undefined ||
      cashForm.receivingBankAcc === ""
    ) {
      toast.error("");
      return false;
    }
    if (
      cashForm.receivingBranchName === undefined ||
      cashForm.receivingBranchName === ""
    ) {
      toast.error("");
      return false;
    }
    if (
      cashForm.depositLocation === undefined ||
      cashForm.depositLocation === ""
    ) {
      toast.error("Please enter depositing branch location.");
      return false;
    }
    if (
      cashForm.depositBranchCode === undefined ||
      cashForm.depositBranchCode === ""
    ) {
      toast.error("Please enter depositing branch code.");
      return false;
    }
    if (
      cashForm.file === undefined ||
      cashForm.file === null ||
      cashForm.file === ""
    ) {
      toast.error("Please upload bank receipt.");
      return false;
    }
    if (cashForm.cashRemark === undefined || cashForm.cashRemark === "") {
      toast.error("Please enter remarks.");
      return false;
    }

    return true;
  };
  const validateCdmForm = (e) => {
    e.preventDefault();

    if (
      cdmForm.transferDate === null ||
      cdmForm.transferDate === "" ||
      cdmForm.transferDate === undefined
    ) {
      toast.error("Please select transfer date.");
      return false;
    }
    if (cdmForm.sentToBank === undefined || cdmForm.sentToBank === "") {
      toast.error("Please select sent to bank.");
      return false;
    }
    if (
      cdmForm.depositorMobile === undefined ||
      cdmForm.depositorMobile === ""
    ) {
      toast.error("Please enter deposit by mobile number");
      return false;
    }
    if (cdmForm.cdmBranchName === undefined || cdmForm.cdmBranchName === "") {
      toast.error("Please enter CDM branch name as per CDM Slip.");
      return false;
    }
    if (
      cdmForm.file === undefined ||
      cdmForm.file === null ||
      cdmForm.file === ""
    ) {
      toast.error("Please upload bank receipt.");
      return false;
    }
    if (cdmForm.cdmRemark === undefined || cdmForm.cdmRemark === "") {
      toast.error("Please enter remarks.");
      return false;
    }

    return true;
  };
  const validateNeftForm = (e) => {
    e.preventDefault();

    if (
      neftForm.neftSenderName === undefined ||
      neftForm.neftSenderName === ""
    ) {
      toast.error("Please enter NEFT/RTGS/FT/IMPS sender name.");
      return false;
    }
    if (
      neftForm.neftSenderAccNo === undefined ||
      neftForm.neftSenderAccNo === ""
    ) {
      toast.error("Please enter NEFT/RTGS/FT/IMPS sender account number.");
      return false;
    }
    if (
      neftForm.neftSenderAccNo === undefined ||
      neftForm.neftSenderAccNo === ""
    ) {
      toast.error("Please enter NEFT/RTGS/FT/IMPS date.");
      return false;
    }
    if (neftForm.sentViaBank === undefined || neftForm.sentViaBank === "") {
      toast.error("Please select NEFT/RTGS/FT/IMPS sent via bank.");
      return false;
    }
    if (neftForm.neftDate === undefined || neftForm.neftDate === "") {
      toast.error("Please select NEFT/RTGS/FT/IMPS date.");
      return false;
    }
    if (
      neftForm.transactionNum === undefined ||
      neftForm.transactionNum === ""
    ) {
      toast.error("Please enter NEFT/RTGS/FT/IMPS transaction number.");
      return false;
    }
    if (neftForm.sentToBank === undefined || neftForm.sentToBank === "") {
      toast.error("Please select sent to bank name.");
      return false;
    }
    if (neftForm.neftBeneName === undefined || neftForm.neftBeneName === "") {
      toast.error("Please enter NEFT/RTGS/FT/IMPS Beneficiary Name.");
      return false;
    }
    if (
      neftForm.file === undefined ||
      neftForm.file === null ||
      neftForm.file === ""
    ) {
      toast.error("Please upload bank receipt.");
      return false;
    }
    if (neftForm.neftRemark === undefined || neftForm.neftRemark === "") {
      toast.error("Please enter remarks.");
      return false;
    }

    return true;
  };

  const apiCall = (e, url, reqBody) => {
    e.preventDefault();
    console.log(reqBody);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "0") {
          setErrorMessage({
            show: true,
            refresh: !errorMessage.refresh,
            status: data.status,
            message: data.message,
          });
          setTimeout(() => {
            setErrorMessage({
              show: false,
              refresh: !errorMessage.refresh,
              status: "",
              message: "",
            });
          }, 8000);
        } else {
          setErrorMessage({
            show: true,
            refresh: !errorMessage.refresh,
            status: data.status,
            message: data.message,
          });
          setTimeout(() => {
            setErrorMessage({
              show: false,
              refresh: !errorMessage.refresh,
              status: "",
              message: "",
            });
          }, 8000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearCashForm = () => {
    setDepositDate(null);
    setAmount("");
    setAccAmount(null);
    setMode("Select");
    setCashForm({});
  };
  const clearCdmForm = () => {
    setDepositDate(null);
    setAmount("");
    setAccAmount(null);
    setMode("Select");
    setCdmForm({ depositorMobile: "", digitCount: 0 });
  };
  const clearNeftForm = () => {
    setDepositDate(null);
    setAmount("");
    setAccAmount(null);
    setMode("Select");
    setNeftForm({ digitCount: 0 });
  };
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container
        className="mt--9 flex-container"
        fluid
        style={{ backgroundColor: "white" }}
      >
        <Row>
          <Col xl={7} className="flex-item">
            <Card className="bg-secondary shadow">
              <CardHeader
                className="bg-white border-0"
                style={{ boxShadow: "5px 0px 18px #888888" }}
              >
                <Row className="align-items-center">
                  <Col>
                    <div className="container text-center">
                      <div
                        className="row align-items-start"
                        style={{ fontWeight: "bold" }}
                      >
                        <div className="col">Amount Deposit Request</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ boxShadow: "5px 10px 18px #888888" }}>
                {!accDetails ? (
                  <div
                    style={{
                      marginTop: "10rem",
                      textAlign:"center",
                      height: "15rem",
                    }}
                  >
                    <Spinner color="primary" type="grow"></Spinner>
                  </div>
                ) : (
                  <Form>
                    {errorMessage.show && (
                      <FormGroup row>
                        <Col lg="10" style={{ textAlign: "center" }}>
                          {errorMessage.status === "0" ? (
                            <h4 style={{ color: "green" }}>
                              {errorMessage.message}
                            </h4>
                          ) : (
                            <h4 style={{ color: "red" }}>
                              {errorMessage.message}
                            </h4>
                          )}
                        </Col>
                      </FormGroup>
                    )}
                    <FormGroup>
                      <ToastContainer theme="colored" />
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                          {" "}
                          Agency Name<span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Label>{agentData && agentData.agentName}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                          Current Balance Amount{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Label>
                      </Col>
                      <Col>
                        <Label>₹ {accDetails && accDetails.balance}</Label>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                          Request for Amount{" "}
                          <span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <Input
                          type="text"
                          name="amount"
                          id="amount"
                          value={amount}
                          autoComplete="off"
                          onChange={(e) => {
                            setAmount(e.target.value);
                          }}
                        ></Input>
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col>
                        <Label>
                          Deposit Date<span style={{ color: "red" }}> *</span>
                        </Label>
                      </Col>
                      <Col>
                        <DatePicker
                          autoComplete="off"
                          name="depositDate"
                          id="depositDate"
                          placeholder="MM/DD/YYYY"
                          maxDate={today}
                          value={depositDate}
                          dateFormat="MM/DD/YYYY"
                          onChange={(v, f) => {
                            setDepositDate(f);
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col>
                        <Label>
                          Payment Mode <span style={{ color: "red" }}>*</span>
                        </Label>
                      </Col>
                      <Col>
                        <Select
                          name="mode"
                          id="mode"
                          onChange={(e) => {
                            setMode(e.value);
                          }}
                          options={
                            wbModeList &&
                            wbModeList.map((key) => {
                              return { value: key, label: key };
                            })
                          }
                        ></Select>
                      </Col>
                    </FormGroup>

                    {mode === "Select" && (
                      <FormGroup row>
                        <Col>
                          <Label></Label>
                        </Col>
                        <Col>
                          <Button color="primary" onClick={handleSubmit}>
                            Submit
                          </Button>
                        </Col>
                      </FormGroup>
                    )}

                    {mode === "CASH IN BANK" && (
                      <>
                        <FormGroup>
                          <CardHeader
                            className="bg-white border-0"
                            style={{ boxShadow: "1px 0px 6px #888888" }}
                          >
                            <Col>
                              <div className="container text-center">
                                <div
                                  className="row"
                                  style={{ fontWeight: "bold" }}
                                >
                                  <span
                                    style={{ textTransform: "capitalize" }}
                                    className="col"
                                  >
                                    {mode}
                                  </span>
                                </div>
                              </div>
                            </Col>
                          </CardHeader>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Depositor Name
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="depositorName"
                              id="depositorName"
                              onChange={handleInput}
                              autocomplete="off"
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Sent to Bank Name
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Select
                              name="sentToBank"
                              id="sentToBank"
                              onChange={handleSelfBank}
                              options={bankOptions}
                            ></Select>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Receiving Bank A/C No{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="receivingBankAcc"
                              id="receivingBankAcc"
                              value={cashForm.receivingBankAcc}
                              readOnly
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Receiving Branch Name{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="receivingBranchName"
                              id="receivingBranchName"
                              value={cashForm.receivingBranchName}
                              readOnly
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Depositing Location{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="depositLocation"
                              id="depositLocation"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Depositing Branch Code{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="depositBranchCode"
                              id="depositBranchCode"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Upload Receipt{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="file"
                              id="cashFile"
                              name="cashFile"
                              accept=".pdf, .jpg, .jpeg, .png"
                              onChange={handleFileChange}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row style={{ marginTop: "-3%" }}>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <span style={{ fontSize: "14px", color: "red" }}>
                              Note : Attachment should be PDF/JPEG/PNG/PDF &
                              size should be less then 5MB.
                            </span>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Remarks <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="textarea"
                              name="cashRemark"
                              id="cashRemark"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <Button color="primary" onClick={handleSubmit}>
                              Submit
                            </Button>
                          </Col>
                        </FormGroup>
                      </>
                    )}

                    {mode === "CDM" && (
                      <>
                        <FormGroup>
                          <CardHeader
                            className="bg-white border-0"
                            style={{ boxShadow: "1px 0px 6px #888888" }}
                          >
                            <Col>
                              <div className="container text-center">
                                <div
                                  className="row"
                                  style={{ fontWeight: "bold" }}
                                >
                                  <span
                                    style={{ textTransform: "capitalize" }}
                                    className="col"
                                  >
                                    {mode}
                                  </span>
                                </div>
                              </div>
                            </Col>
                          </CardHeader>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Transfer Date
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <DatePicker
                              name="transferDate"
                              id="transferDate"
                              placeholder="MM/DD/YYYY"
                              maxDate={today}
                              value={cdmForm.transferDate}
                              dateFormat="MM/DD/YYYY"
                              onChange={(v, f) => {
                                setCdmForm({ ...cdmForm, transferDate: f });
                              }}
                            ></DatePicker>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Sent to Bank Name
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Select
                              name="sentToBank"
                              id="sentToBank"
                              onChange={handleSelfBank}
                              options={bankOptions}
                            >
                              {bankOptions}
                            </Select>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Deposit By Mobile No.{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              style={{ marginBottom: "-20px" }}
                              name="depositorMobile"
                              id="depositorMobile"
                              type="text"
                              value={cdmForm.depositorMobile}
                              maxLength={10}
                              onChange={(e) => {
                                setCdmForm({
                                  ...cdmForm,
                                  depositorMobile: e.target.value,
                                  digitCount: e.target.value.length,
                                });
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <span>Number Of Digits:{cdmForm.digitCount}</span>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              CDM Branch Name( As per CDM Slip).{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="cdmBranchName"
                              id="cdmBranchName"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Upload Receipt{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="file"
                              id="cdmFile"
                              name="cdmFile"
                              accept=".pdf, .jpg, .jpeg, .png"
                              onChange={handleFileChange}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row style={{ marginTop: "-3%" }}>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <span style={{ color: "red" }}>
                              Note : Attachment should be PDF/JPEG/PNG & size
                              should be less then 5MB.
                            </span>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Remarks <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="textarea"
                              name="cdmRemark"
                              id="cdmRemark"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>
                        {/* ... Other form fields ... */}
                        <FormGroup row>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <Button color="primary" onClick={handleSubmit}>
                              Submit
                            </Button>
                          </Col>
                        </FormGroup>
                      </>
                    )}

                    {mode === "NEFT/RTGS/FT/IMPS" && (
                      <>
                        <FormGroup>
                          <CardHeader
                            className="bg-white border-0"
                            style={{ boxShadow: "1px 0px 6px #888888" }}
                          >
                            <Col>
                              <div className="container text-center">
                                <div
                                  className="row"
                                  style={{ fontWeight: "bold" }}
                                >
                                  <span
                                    style={{ textTransform: "capitalize" }}
                                    className="col"
                                  >
                                    {mode}
                                  </span>
                                </div>
                              </div>
                            </Col>
                          </CardHeader>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Sender Name{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="neftSenderName"
                              id="neftSenderName"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Sender A/C No{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              style={{ marginBottom: "-20px" }}
                              id="neftSenderAccNo"
                              name="neftSenderAccNo"
                              type="text"
                              onChange={(e) => {
                                setNeftForm({
                                  ...neftForm,
                                  neftSenderAccNo: e.target.value,
                                  digitCount: e.target.value.length,
                                });
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <span>Number Of Digits:{neftForm.digitCount}</span>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Sent via Bank Name
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Select
                              name="sentViaBank"
                              id="sentViaBank"
                              onChange={(select) => {
                                setNeftForm({
                                  ...neftForm,
                                  sentViaBank: select.value,
                                });
                              }}
                              options={sentBankOptions}
                            ></Select>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Date
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <DatePicker
                              name="neftDate"
                              id="neftDate"
                              placeholder="MM/DD/YYYY"
                              maxDate={today}
                              value={neftForm.neftDate}
                              dateFormat="MM/DD/YYYY"
                              onChange={(v, f) => {
                                setNeftForm({ ...neftForm, neftDate: f });
                              }}
                            ></DatePicker>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Transaction Number{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="transactionNum"
                              id="transactionNum"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Sent to Bank Name
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Select
                              name="sentToBank"
                              id="sentToBank"
                              onChange={handleSelfBank}
                              options={bankOptions}
                            ></Select>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              NEFT/RTGS/FT/IMPS Beneficiary Name{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="text"
                              name="neftBeneName"
                              id="neftBeneName"
                              value={neftForm.neftBeneName}
                              readOnly
                            ></Input>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col>
                            <Label>
                              Upload Receipt{" "}
                              <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="file"
                              id="neftFile"
                              name="neftFile"
                              accept=".pdf, .jpg, .jpeg, .png"
                              onChange={handleFileChange}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row style={{ marginTop: "-3%" }}>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <span style={{ color: "red" }}>
                              Note : Attachment should be PDF/JPEG/PNG & size
                              should be less then 5MB.
                            </span>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label>
                              Remarks <span style={{ color: "red" }}> *</span>
                            </Label>
                          </Col>
                          <Col>
                            <Input
                              autoComplete="off"
                              type="textarea"
                              name="neftRemark"
                              id="neftRemark"
                              onChange={handleInput}
                            ></Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <Label></Label>
                          </Col>
                          <Col>
                            <Button color="primary" onClick={handleSubmit}>
                              Submit
                            </Button>
                          </Col>
                        </FormGroup>
                      </>
                    )}
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col className="flex-item">
            <Card className="bg-secondary shadow">
              <CardHeader
                className="bg-white border-0"
                style={{ boxShadow: "5px 0px 18px #888888" }}
              >
                <Row className="align-items-center">
                  <Col>
                    <div className="container text-center">
                      <div
                        className="row align-items-start"
                        style={{ fontWeight: "bold" }}
                      >
                        <div className="col">Account Information</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody style={{ boxShadow: "5px 10px 18px #888888" }}>
                <div>
                  <Table style={{ width: "100%" }}>
                    {!accDetails ? (
                      <div
                        style={{
                          marginTop: "5rem",
                          textAlign:"center",
                          height: "8rem",
                        }}
                      >
                        <Spinner color="primary" type="grow"></Spinner>
                      </div>
                    ) : (
                      <tbody>
                        <tr>
                          <th style={tableCellStyle}>Total Deposit</th>
                          <td style={tableCellStyle}>₹ {accDetails.totCash}</td>
                        </tr>
                        <tr>
                          <th style={tableCellStyle}>Used</th>
                          <td style={tableCellStyle}>
                            ₹ {accDetails.usedCash}
                          </td>
                        </tr>
                        <tr>
                          <th style={tableCellStyle}>Balance</th>
                          <td style={tableCellStyle}>₹ {accDetails.balance}</td>
                        </tr>
                        <tr>
                          <th style={tableCellStyle}>Cut Off</th>
                          <td style={tableCellStyle}>
                            ₹ {accDetails.cutOffAmount}
                          </td>
                        </tr>
                        <tr>
                          <th style={tableCellStyle}>Zone</th>
                          <td style={tableCellStyle}>{agentData.zone}</td>
                        </tr>
                      </tbody>
                    )}
                  </Table>
                </div>
              </CardBody>
            </Card>
            <br />

            <Card className="bg-secondary shadow" style={{ width: "" }}>
              <CardHeader
                className="bg-white border-0"
                style={{ boxShadow: "5px 0px 18px #888888" }}
              >
                <Row className="align-items-center">
                  <Col>
                    <div className="container text-center">
                      <div
                        className="row align-items-start"
                        style={{ fontWeight: "bold" }}
                      >
                        <div className="col">Bank Account Details</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody
                style={{
                  boxShadow: "5px 10px 18px #888888",
                  overflowY: "auto",
                }}
              >
                <div style={{ overflowY: "auto", maxHeight: "15rem" }}>
                  <Table style={{ width: "100%" }}>
                    <tbody>
                      {!wbBankList ? (
                        <div
                          style={{
                            marginTop: "5rem",
                            textAlign:"center",
                            height: "8rem",
                          }}
                        >
                          <Spinner color="primary" type="grow"></Spinner>
                        </div>
                      ) : (
                        wbBankList.map((key) => {
                          return (
                            <>
                              <tr>
                                <th style={tableCellStyle}>Bank Name</th>
                                {key.is_accNo === "1" && (
                                  <td style={tableCellStyle}>{key.bankName}</td>
                                )}
                                {key.is_accNo === "0" && (
                                  <td style={tableCellStyle}>
                                    {key.bankName} (Old Account)
                                  </td>
                                )}
                              </tr>
                              <tr>
                                <th style={tableCellStyle}>
                                  Bank Account Name
                                </th>
                                <td style={tableCellStyle}>
                                  {key.accountName}
                                </td>
                              </tr>
                              <tr>
                                <th style={tableCellStyle}>
                                  Bank Account Number
                                </th>
                                <td style={tableCellStyle}>
                                  {key.accountNumber}
                                </td>
                              </tr>
                              <tr>
                                <th style={tableCellStyle}>IFSC Code</th>
                                <td style={tableCellStyle}>{key.ifscCode}</td>
                              </tr>
                              <br></br>
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              className="bg-white flex border-0"
              style={{
                boxShadow: "5px 0px 18px #888888",
                maxHeight: "35rem",
                marginLeft: "1rem",
                marginBlock: "2rem",
                overflowX:"auto"
              }}
            >
              <CardBody>
                {!wbReqList ? (<div
                          style={{
                            marginTop: "5rem",
                            textAlign:"center",
                            height: "8rem",
                          }}
                        >
                          <Spinner color="primary" type="grow"></Spinner>
                        </div>) : (
                  <Table size="sm" bordered>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Amount</th>
                        <th>Mode Of Payment</th>
                        <th>Request Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wbReqList && wbReqList.map((key, index) => {
                        return (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{key.date}</td>
                            <td>{key.time}</td>
                            <td>{key.amount}</td>
                            <td>{key.mode}</td>
                            <td>{key.status}</td>
                            <td>{key.remark}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalletUploadRecharge;
