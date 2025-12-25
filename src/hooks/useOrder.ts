import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { orderApi } from "../services/order.api";

interface GetOrdersPayload {
  limit?: string;
  offset?: string;
  start?: string;
  end?: string;
  sent?: string;
  delivered?: string;
  paid?: string;
}

// Get Orders Hook
export function useOrders(
  payload: GetOrdersPayload = {}
): UseQueryResult<any, Error> {
  const defaultPayload = {
    limit: "120",
    offset: "0",
    start: "",
    end: "",
    sent: "",
    delivered: "",
    paid: "",
    ...payload,
  };

  return useQuery({
    queryKey: ["orders", JSON.stringify(defaultPayload)],
    queryFn: () => orderApi.getOrders(defaultPayload),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

// Set AWB (No Resi) Hook
export function useSetAwb(): UseMutationResult<
  any,
  Error,
  { orderId: string; awb: string }
> {
  return useMutation({
    mutationFn: async ({ orderId, awb }) => {
      try {
        return await orderApi.setAwb(orderId, awb);
      } catch (error) {
        throw error;
      }
    },
  });
}
