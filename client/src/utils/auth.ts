//helper to add a token for authorization services

export const authHeader = () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    if (!loggedUser.token) return {};
    return { headers: { Authorization: `Bearer ${loggedUser.token}` } };
  };
  