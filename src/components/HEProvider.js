import React from "react";
import PropTypes from "prop-types";

const HEContext = React.createContext();

// Create a React Hook that lets us get data from our auth context
export function useHE() {
  const context = React.useContext(HEContext);
  if (!context) {
    throw new Error(`useHE must be used within a GADMProvider`);
  }
  return context;
}

// Create a component that controls auth state and exposes it via
// the React Context we created.
export function HEProvider(props) {

  const [pageState, setPageState] = React.useState({
    selectedTable: {},
    selectedVariable: {},
    selectedCounty: {},
    fetchedData:[],
  });

  const handlePageStateChange = (doc) => {
    setPageState({...pageState, ...doc});
  };


  // We useMemo to improve performance by eliminating some re-renders
  const pageInfo = React.useMemo(
    () => {
      const { selectedTable, selectedVariable, selectedCounty, fetchedData } = pageState;
      const value = {
        selectedTable,
        selectedVariable,
        selectedCounty,
        fetchedData,
        actions: { handlePageStateChange },
      };
      return value;
    },
    [pageState],
  );
  return (
    <HEContext.Provider value={pageInfo}>
      {props.children}
    </HEContext.Provider>
  );
}
HEProvider.propTypes = {
  children: PropTypes.element,
};