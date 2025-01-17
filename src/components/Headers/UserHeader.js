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

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

const UserHeader = () => {
  return (
    <>
      <div
        className="header  pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "250px",
          // backgroundImage:
          //   "url(" + require("../../assets/img/theme/utility_bg_img.jpg") + ")",
          // backgroundSize: "cover",
          // backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" style={{height:'40%'}}/>
        {/* Header container */}
        
      </div>
    </>
  );
};

export default UserHeader;
