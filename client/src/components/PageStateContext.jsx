import { createContext, useReducer } from 'react';

export const PageStateContext = createContext();

// Define a reducer function to update state
const pageStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAGE_STATE':
      return { ...state, [action.page]: action.state };
    default:
      return state;
  }
};

// Define a provider component
export const PageStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pageStateReducer, {});

  const setPageState = (page, state) => {
    dispatch({ type: 'SET_PAGE_STATE', page, state });
  };

  return (
    <PageStateContext.Provider value={{ state, setPageState }}>
      {children}
    </PageStateContext.Provider>
  );
};