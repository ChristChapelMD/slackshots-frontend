import { ToastStatus, ToastSeverity, ToastColor } from "@/types/toasts";

export const toastConfig = {
  GlobalStyle: {},

  statusMap: {
    info: { severity: "primary", color: "primary" },
    success: { severity: "success", color: "success" },
    warning: { severity: "warning", color: "warning" },
    error: { severity: "danger", color: "danger" },
    default: { severity: "default", color: "default" },
  } as Record<ToastStatus, { severity: ToastSeverity; color: ToastColor }>,
};
