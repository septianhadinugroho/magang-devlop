"use client"

import { createContext, useContext, useState } from "react";

const ConfirmDialogContext = createContext();

export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    description: "",
  });

  const confirm = ({ title, description }) => {
    return new Promise((resolve) => {
      setDialog({
        open: true,
        title,
        description,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    dialog.resolve(true);
    setDialog({ ...dialog, open: false });
  };

  const handleCancel = () => {
    dialog.resolve(false);
    setDialog({ ...dialog, open: false });
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm, dialog, handleConfirm, handleCancel }}>
      {children}
    </ConfirmDialogContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmDialogContext);