import apiClient from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/constants";
import { useAuthStore } from "../store/auth.store";

export const orderApi = {
  // Get Orders
  getOrders: async (payload: {
    limit?: string;
    offset?: string;
    start?: string;
    end?: string;
    sent?: string;
    delivered?: string;
    paid?: string;
  }) => {
    const token = useAuthStore.getState().token;

    const response = await apiClient.post(
      API_ENDPOINTS.GET_ORDER,
      payload,
      {
        headers: {
          "X-auth-token": token || "",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Set AWB (No Resi)
  setAwb: async (orderId: string, awb: string) => {
    const token = useAuthStore.getState().token;

    const formData = new URLSearchParams();
    formData.append("awb", awb);

    const response = await apiClient.post(
      `${API_ENDPOINTS.SET_NO_RESI}${orderId}`,
      formData.toString(),
      {
        headers: {
          "X-auth-token": token || "",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },
};
