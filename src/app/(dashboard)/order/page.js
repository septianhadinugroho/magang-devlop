"use client";

import { useEffect, useState } from "react";
import { getStores } from "@/services/store";
import { getOrders, finishOrder, saveOrder } from "@/services/order";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import IconButton from "@/components/ui/IconButton";
import { CheckCheck, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { formatJakartaTime } from "@/lib/utils";
import {
  ORDER_POS_STATUS,
  ORDER_STATE_STATUS,
  ORDER_POS_STATUS_NUMBER,
  ORDER_STATE_STATUS_NUMBER,
} from "@/lib/constants";

// Constants
const INITIAL_STATE = {
  stores: [],
  orders: [],
  storeSelected: "",
  inputDate: "",
  loading: true,
  error: null,
  page: 1,
  more: true,
};

// Utility Functions
const formatStatus = (status, statusMap) =>
  status !== null ? statusMap[status] : "-";

// Main Component
export default function Order() {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    stores,
    orders,
    storeSelected,
    inputDate,
    loading,
    error,
    page,
    more,
  } = state;

  // Fetch stores on mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await getStores(1);
        setState((prev) => ({ ...prev, stores: result.data, loading: false }));
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Failed to fetch stores",
          loading: false,
        }));
      }
    };
    fetchStores();
  }, []);


  const fetchOrders = async () => {
    if (!storeSelected) {
      setState((prev) => ({ ...prev, orders: [], more: true }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await getOrders({
        store_code: storeSelected,
        date: inputDate,
        page,
      });
      setState((prev) => ({
        ...prev,
        orders: result.orders,
        more: result.next,
        loading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Failed to fetch orders",
        loading: false,
      }));
    }
  };

  // Handlers
  const handleFilter = () => {
    setState((prev) => ({ ...prev, page: 1, error: null }));
    fetchOrders();
  };

  const handleSaveOrder = async (orderId, storeCode) => {
    if (!confirm("Are you sure you want to save this order?")) return;
    try {
      await saveOrder({ order_id: orderId, store_code: storeCode });
      await fetchOrders();
    } catch {
      setState((prev) => ({ ...prev, error: "Failed to save order" }));
    }
  };

  const handleFinishOrder = async (orderId) => {
    if (!confirm("Are you sure you want to finish this order?")) return;
    try {
      const body = {
        state_status: ORDER_STATE_STATUS.DELIVERED,
        pos_status: ORDER_POS_STATUS.CHECKOUT,
      };
      await finishOrder(orderId, body);
      await fetchOrders();
    } catch {
      setState((prev) => ({ ...prev, error: "Failed to finish order" }));
    }
  };

  const handlePageChange = (newPage) => {
    setState((prev) => ({ ...prev, page: newPage }));
    fetchOrders();
  };

  return (
    <Card>
      <CardHeader>
        <div className="border-b pb-4">
           <h1 className="text-3xl font-bold">Orders Management</h1>
        </div>
       
        <div className="mt-2 p-4 border rounded-md flex  flex-col md:flex-row gap-2 bg-gray-50 border-gray-200">
          <div className="w-full ">
            <Label htmlFor="store" className="font-semibold mb-1">
              Store
            </Label>
            <select
              id="store"
              className="w-full border rounded-md p-2 text-sm bg-white"
              value={storeSelected}
              onChange={(e) =>
                setState((prev) => ({ ...prev, storeSelected: e.target.value }))
              }
            >
              <option value="">-- Choose --</option>
              {stores.map((store) => (
                <option key={store.id} value={store.store_code}>
                  {store.store_code} - {store.grab_store_code} - {store.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <Label htmlFor="date" className="font-semibold mb-1">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              className="bg-white"
              value={inputDate}
              onChange={(e) =>
                setState((prev) => ({ ...prev, inputDate: e.target.value }))
              }
            />
          </div>
          <div className="w-full flex items-end mt-3 md:mt-0">
            <Button onClick={handleFilter} className="w-[100px]">
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Order ID</TableHead>
              <TableHead className="font-bold">Short Order Number</TableHead>
              <TableHead className="font-bold">Store Code</TableHead>
              <TableHead className="font-bold">State Status</TableHead>
              <TableHead className="font-bold">POS Status</TableHead>
              <TableHead className="font-bold">Order Time</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {error ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7}>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}. Please note: This action is only allowed in
                      production.
                    </AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {loading
                ? // Skeleton loading state
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[140px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-[80px]" />
                        </TableCell>
                      </TableRow>
                    ))
                : // Original table content
                  orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.short_order_number}</TableCell>
                      <TableCell>{order.store_code}</TableCell>
                      <TableCell>
                        {formatStatus(
                          order.state_status,
                          ORDER_STATE_STATUS_NUMBER
                        )}
                      </TableCell>
                      <TableCell>
                        {formatStatus(
                          order.pos_status,
                          ORDER_POS_STATUS_NUMBER
                        )}
                      </TableCell>
                      <TableCell>
                        {formatJakartaTime(order.order_time)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {!order.is_submited && (
                            <IconButton
                              tooltip="Save Order"
                              onClick={() =>
                                handleSaveOrder(
                                  order.order_id,
                                  order.store_code
                                )
                              }
                            >
                              <Save size={14} />
                            </IconButton>
                          )}
                          {order.is_submited &&
                            (order.state_status !==
                              ORDER_STATE_STATUS.DELIVERED ||
                              order.pos_status === ORDER_POS_STATUS.SUBMIT) && (
                              <IconButton
                                tooltip="Finish Order"
                                onClick={() =>
                                  handleFinishOrder(order.order_id)
                                }
                              >
                                <CheckCheck size={14} />
                              </IconButton>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          )}
        </Table>
        {orders.length !== 0 && (
          <div className="flex justify-between mt-10">
            <Button
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              size="sm"
              disabled={!more}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
