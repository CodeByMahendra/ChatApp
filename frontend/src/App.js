

import React, { useEffect } from 'react';
import Signup from './components/Signup'; 
import Login from './components/Login';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setOnlineUsers } from './redux/userSlice';
import HomePage from './components/HomePage';
import Final from './components/Final';

function App() { 
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();

  const url = "https://chatapp-backend-ny29.onrender.com";
  useEffect(() => {
    let socketio;

    if (authUser) {
      socketio = io(url, {
        query: {
          userId: authUser._id
        }
      });

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
      };
    }

  }, [authUser, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser ? <Navigate to="/chat" /> : <Navigate to="/login" />
    },
    {
      path: "/login",
      element: authUser ? <Navigate to="/chat" /> : <Login url={url}/>
    },
    {
      path: "/signup",
      element: <Signup url={url} />
    },
    {
      path: "/chat",
      element: authUser ? <HomePage /> : <Navigate to="/login" />
    },
    {
      path: "/msg",
      element: authUser ? <Final /> : <Navigate to="/login" />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
