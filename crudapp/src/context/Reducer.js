export const reducer = (state, action) => {

  switch (action.type) {
    case "USER_LOGIN": {

      if (action.payload?.firstName
        && action.payload?.lastName
        && action.payload?.email) {

        const role = (action.payload.isAdmin) ? "admin" : "user"
        const user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
        }
        return { ...state, isLogin: true, role: role, user: user }
      }
    }
    case "USER_LOGOUT": {
      return { ...state, isLogin: false, role: null, user: {} }
    }
    case "CHANGE_THEME": {
      return { ...state, darkTheme: !state.darkTheme }
    }
    case "CHANGE_NAME": {
      console.log("Changing name")
      if (typeof action.payload === "string"
        && action.payload.trim().length > 3
        && action.payload.trim().length < 20) {
        return { ...state, name: action.payload }
      }
    }
    default: {
      return state
    }
  }
}