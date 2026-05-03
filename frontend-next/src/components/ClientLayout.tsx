'use client';

import React, { useState, useMemo, ReactNode } from "react";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import AuthProvider from "@/context/AuthProvider";
import styles from "./ClientLayout.module.css";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [xAxis, setXAxis] = useState(0);
  const [yAxis, setYAxis] = useState(0);

  const cursorProps = useMemo(() => ({ x: xAxis, y: yAxis }), [xAxis, yAxis]);

  return (
    <AuthProvider>
      <CustomCursor {...cursorProps} />
      <div
        onMouseMove={(e) => {
          setXAxis(e.clientX);
          setYAxis(e.clientY);
        }}
        className={styles.appContainer}
      >
        {children}
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default ClientLayout;
