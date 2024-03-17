const initialState = {
  eventsStatus: [],
  cowStatus: [],
};
const UtilsReducer = (state = initialState, action) => {
  switch(action.type) {
    case "EVENTSTATUS_CHANGE": return {
      ...state,
      eventsStatus:action.payload
    }
    case "COWSTATUS_CHANGE" : return {
      ...state,
      cowStatus:action.payload
    }
  }
  return state;
}
export default UtilsReducer;