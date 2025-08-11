import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicPaths = ["/auth/login"];
    const path = router.pathname;

    if (!publicPaths.includes(path)) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login"); // Use replace to avoid back button loop
        return;
      }
    }
    setLoading(false);
  }, [router.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}
