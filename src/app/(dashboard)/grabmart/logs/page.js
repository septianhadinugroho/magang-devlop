// src/app/(dashboard)/grabmart/logs/page.js

"use client";

import { useEffect, useState } from "react";
import { getGrabMartLogs, updateGrabMartLog, getPartnerMerchants } from "@/services/grabmart_log";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pagination } from "@/components/Pagination";
import { formatJakartaTime } from "@/lib/utils";

export default function GrabMartLogs() {
  const [logs, setLogs] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerMerchants, setPartnerMerchants] = useState([]); // State untuk daftar filter
  const [selectedPartner, setSelectedPartner] = useState(""); // State untuk filter yang dipilih

  // Ambil data filter saat komponen dimuat
  useEffect(() => {
    const fetchFilterOptions = async () => {
        try {
            const merchants = await getPartnerMerchants();
            setPartnerMerchants(merchants);
        } catch (error) {
            toast.error("Failed to fetch filter options.");
        }
    };
    fetchFilterOptions();
  }, []);

  // Fetch logs setiap kali halaman, pencarian, atau filter berubah
  useEffect(() => {
    setCurrentPage(1); // Kembali ke halaman pertama setiap kali filter atau search berubah
    fetchLogs(1, searchTerm, selectedPartner);
  }, [searchTerm, selectedPartner]);

  useEffect(() => {
    fetchLogs(currentPage, searchTerm, selectedPartner);
  }, [currentPage]);

  const fetchLogs = async (page, search = "", partnerId = "") => {
    try {
      const data = await getGrabMartLogs(page, 10, search, partnerId);
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error caught in component:", error);
      toast.error("Failed to fetch logs.");
    }
  };

  const handleEdit = (log) => {
    setEditingRowId(log.id);
    setEditedData({
      short_order_number: log.short_order_number,
      pos_terminal_status: log.pos_terminal_status,
    });
  };

  const handleSave = async (id) => {
    try {
      await updateGrabMartLog(id, editedData);
      setEditingRowId(null);
      toast.success("Log updated successfully.");
      fetchLogs(currentPage, searchTerm, selectedPartner);
    } catch (error) {
      toast.error("Failed to update log.");
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setEditedData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-4">
            <CardTitle>GrabMart Logs</CardTitle>
            <div className="flex gap-2 w-2/3">
                {/* Dropdown Filter */}
                <select 
                    className="border border-gray-300 rounded-md p-2 text-sm"
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                >
                    <option value="">All Partner Merchants</option>
                    {partnerMerchants.map(merchant => (
                        <option key={merchant.partner_merchant_id} value={merchant.partner_merchant_id}>
                            {merchant.partner_merchant_id}
                        </option>
                    ))}
                </select>
                {/* Input Pencarian */}
                <Input
                    placeholder="Search Order ID, Merchant ID, etc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Merchant ID</TableHead>
              <TableHead>Partner Merchant ID</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Short Order Number</TableHead>
              <TableHead>POS Terminal Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatJakartaTime(log.created_on)}</TableCell>
                <TableCell>{log.order_id}</TableCell>
                <TableCell>{log.merchant_id}</TableCell>
                <TableCell>{log.partner_merchant_id}</TableCell>
                <TableCell>{log.payment_type}</TableCell>
                <TableCell>
                  {editingRowId === log.id ? (
                    <Input
                      name="short_order_number"
                      value={editedData.short_order_number}
                      onChange={handleChange}
                    />
                  ) : (
                    log.short_order_number
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === log.id ? (
                    <Input
                      name="pos_terminal_status"
                      value={editedData.pos_terminal_status}
                      onChange={handleChange}
                    />
                  ) : (
                    log.pos_terminal_status
                  )}
                </TableCell>
                <TableCell>
                  {editingRowId === log.id ? (
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(log.id)}>
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => handleEdit(log)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </CardContent>
    </Card>
  );
}