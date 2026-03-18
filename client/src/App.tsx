import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/dashboard/Home";
import Signup from "./pages/auth/Signup";
import AddOrganization from "./pages/AddOrganization";
import Landing from "./pages/Landing";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyNotice from "./pages/auth/VerifyNotice";
import RequestReset from "./pages/auth/RequestReset";
import ResetPassword from "./pages/auth/ResetPassword";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { setUser } from "./reducers/loggedUserReducer";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/project/Projects";
import ProjectPage from "./pages/project/Project";
import Tasks from "./pages/task/Tasks";
import Comments from "./pages/comment/Comments";
import Users from "./pages/Users";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  //this is used for page refreshment
  //when page is refershed without looging out 
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser) //parse when you get local storage items
      dispatch(setUser(user));
    }
    setLoading(false);
  },[dispatch])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <p>Initializing app...</p>
    </div>
  }
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/addOrg" element={<AddOrganization />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-notice" element={<VerifyNotice />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protect routes which requires logging in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/project/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comments"
          element={
            <ProtectedRoute>
              <Comments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
    
  );
}

export default App;
