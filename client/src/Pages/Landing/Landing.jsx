// import React, { useContext, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Login from "../../Components/Login/Login";
// import SignUp from "../../Components/Signup/Signup";
// import About from "../../Components/About/About";
// import LayOut from "../../Components/Layout/Layout";
// import styles from "./landing.module.css";
// import { UserContext } from "../../Components/Context/userContext";
// import { toast } from "react-toastify";

// function Landing() {
//   const [userData, setUserData] = useContext(UserContext);
//   const location = useLocation();
//   const message = location.state?.message;
//   const navigate = useNavigate()
//   const isSignupPage = location.pathname === "/sign-up";



//   useEffect(() => {
//     // If user data found, redirect to home page
//     if (userData?.userid) {
//       navigate("/home");
//       return;
//     }
//   }, [userData?.userid]);

//   useEffect(() => {
//     console.log("Message from navigation state:", message);
//     if (message) {
//       toast.info(message, {
//         style: {
//           marginTop: "70px",
//           padding: "8px 12px", // reduce padding
//           fontSize: "1.5rem", // smaller font
//           fontWeight: "bold",
//           borderRadius: "8px",
//           minHeight: "unset", // override default height
//         },
//       });
//     }
//   }, [message]);



//   return (
//     <LayOut>
//       <div className={styles.landingPageContainer}>
//         <div className={styles.login}>
//           <div
//             className={styles.sliderWrapper}
//             style={{
//               transform: isSignupPage ? "translateX(-50%)" : "translateX(0)",
//             }}
//           >
//             <div className={`${styles.formPane} ${styles.shrink}`}>
//               <Login />
//             </div>
//             <div className={`${styles.formPane} ${styles.shrink}`}>
//               <SignUp />
//             </div>
//           </div>
//         </div>
//         <div className={`${styles.about} ${styles.shrinkAbout}`}>
//           <About />
//         </div>
//       </div>
//     </LayOut>
//   );
// }

// export default Landing;



import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../../Components/Login/Login";
import SignUp from "../../Components/SignUp/SignUp";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";
import styles from "./landing.module.css";
import { UserContext } from "../../Components/Context/UserContext";
import { toast } from "react-toastify";

function Landing() {
  const { userData, setUserData } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const message = location.state?.message;

  const isSignupPage = location.pathname === "/sign-up";

  useEffect(() => {
    if (userData?.userid) {
      navigate("/home");
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (message) {
      toast.info(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [message]);

  return (
    <LayOut>
      <div className={styles.landingPageContainer}>
        <div className={styles.login}>
          <div
            className={styles.sliderWrapper}
            style={{
              transform: isSignupPage ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <Login />
            </div>
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <SignUp />
            </div>
          </div>
        </div>
        <div className={`${styles.about} ${styles.shrinkAbout}`}>
          <About />
        </div>
      </div>
    </LayOut>
  );
}

export default Landing;