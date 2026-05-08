import { matchPath, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
function AppLayouts() {
  const location = useLocation();
  const path = location.pathname;
  const userId = localStorage.getItem("userId");
  const blockPaths=["/select-account-type",'/certificate/:id','/doctor-appointment-receipt/:id']
  const isBlocked = blockPaths.some((blockPath) => matchPath(blockPath, path));

  return (
    <>

      <div className="app-layout">
       { !isBlocked && <Header />}
        <div className="page-content">

          <Outlet />
        </div>
         {!isBlocked && <Footer />}
      </div>
    </>
  );
}


export default AppLayouts;
