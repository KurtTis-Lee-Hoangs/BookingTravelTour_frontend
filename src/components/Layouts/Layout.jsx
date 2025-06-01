// import React from "react";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
// import Routers from "../../router/Routers";

// const Layout = () => {
//   return (
//     <>
//       <Header />
//       <Routers />
//       <Footer />
//     </>
//   );
// };

// export default Layout;


import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../router/Routers";
import ChatBot2 from "../../shared/ChatBot2";
import ScrollButton from "../../shared/ScrollButton";

const Layout = () => {
  const location = useLocation();

  // Kiểm tra nếu đường dẫn hiện tại là "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routers />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatBot2 />}
      {!isAdminRoute && <ScrollButton />}
    </>
  );
};

export default Layout;
