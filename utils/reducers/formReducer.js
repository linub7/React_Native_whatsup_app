export const formReducer = (state, action) => {
  const { validationResult, inputId } = action;

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
  };

  let updatedFormIsValid = true;

  for (let key in updatedValidities) {
    if (updatedValidities[key] !== undefined) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValidities: updatedValidities,
    isFormValid: updatedFormIsValid,
  };
};
