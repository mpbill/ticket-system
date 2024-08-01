import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import { App } from "./App";
import LoginPage from "./Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "./RegisterPage";
import { OrganizationPage } from "./org/Org";
import TicketDetail from "./TicketDetails";
import { AuthProvider } from "./Auth";
import { PrivateRoute } from "./PrivateRoute";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 } } });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "org",
        element: <PrivateRoute><OrganizationPage /></PrivateRoute>,
      },
      {
        path: "tickets/:id",
        element: <PrivateRoute><TicketDetail /></PrivateRoute>,
      }

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
