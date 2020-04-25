import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  hasLoggedInUser,
  logoutCurrentUser,
  getCurrentUser,
  getUserName,
  signupUser,
  loginUser,
  sendResetPasswordEmail,
  resetPassword,
} from "./../stitch/authentication";

// Create a React Context that lets us expose and access auth state
// without passing props through many levels of the component tree
const StitchAuthContext = React.createContext();

// Create a React Hook that lets us get data from our auth context
export function useStitchAuth() {
  const context = React.useContext(StitchAuthContext);
  if (!context) {
    throw new Error(`useStitchAuth must be used within a StitchAuthProvider`);
  }
  return context;
}

// Create a component that controls auth state and exposes it via
// the React Context we created.
export function StitchAuthProvider(props) {

  const [authState, setAuthState] = React.useState({
    isLoggedIn: hasLoggedInUser(),
    currentUser: getCurrentUser(),
    currentUserName: '',
  });

  // Authentication Actions
  const handleLogout = async () => {
    const { isLoggedIn } = authState;
    if (isLoggedIn) {
      await logoutCurrentUser();
      setAuthState({
        ...authState,
        isLoggedIn: false,
        currentUser: null,
      });
    } else {
      console.log(`can't handleLogout when no user is logged in`);
    }
  };

  const handleSignup = async (email, password, groupID) => {
    const signupStatus = await signupUser(email, password);
  }

  const handleEmailPasswordLogin = async (email, password) => {
    const loggedInUser = await loginUser(email, password);
    //console.log(loggedInUser);
    setAuthState({
        ...authState,
        isLoggedIn: true,
        currentUser: loggedInUser,
    });

  }

  const handleResetPasswordSend = async (email) => {
    const status = await sendResetPasswordEmail(email);
  }

  const handleResetPassword = async (token, tokenId, newPassword) => {
    const status = await resetPassword(token, tokenId, newPassword);
  }

  // custom user data can be retrieved as follows:
  useEffect(()=>{
    getUserName().then((userName)=>{
      setAuthState({
        ...authState,
        currentUserName: userName,
      });
    });
  }, []);

  // We useMemo to improve performance by eliminating some re-renders
  const authInfo = React.useMemo(
    () => {
      const { isLoggedIn, currentUser, currentUserName } = authState;
      const value = {
        isLoggedIn,
        currentUser,
        currentUserName,
        actions: { 
                  handleLogout,
                  handleSignup,
                  handleEmailPasswordLogin,
                  handleResetPasswordSend,
                  handleResetPassword,
                },
      };
      return value;
    },
    [authState.isLoggedIn, authState.currentUserName],
  );
  return (
    <StitchAuthContext.Provider value={authInfo}>
      {props.children}
    </StitchAuthContext.Provider>
  );
}
StitchAuthProvider.propTypes = {
  children: PropTypes.element,
};
