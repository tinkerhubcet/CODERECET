import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const extractInfo = (token) => {
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    return {
      token: token,
      userId: userId,
    };
  };

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? extractInfo(token) : null;
  });

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      //request filter

      config.headers.authorization =
        !config._retry && auth
          ? `Bearer ${auth.token}`
          : config.headers.authorization;

      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [auth]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error?.response?.status === 401 &&
          (error?.response?.data.message === "Token Error" ||
            error?.response?.data?.message === "TokenExpiredError")
        ) {
          //if token expired ,status is 401

          try {
            const response = await api.post("/refresh");

            localStorage.setItem("token", response.data.data);

            setAuth(extractInfo(response.data.data));

            originalRequest.headers.Authorization = `Bearer ${response.data.data}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch (refreshError) {
            setAuth(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuth(extractInfo(token));
  };

  const logout = () => {
    setAuth(null);
    navigate("/signin");
    localStorage.clear();
  };

  return (
    <authContext.Provider value={{ auth, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export function useUser() {
  return useContext(authContext);
}