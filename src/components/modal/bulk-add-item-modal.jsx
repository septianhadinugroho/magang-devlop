"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { saveItem } from "@/services/item";

export default function ItemBulkModal({ open, onClose, fetchItems }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const [fileData, setFileData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [failedData, setFailedData] = useState([]);
  const [successData, setSuccesData] = useState([]);

  useEffect(() => {
    if (!open) {
      reset();
      setFileData(null);
      setValidationErrors([]);
      setFailedData([]);
      setSuccesData([]);
    }
  }, [open, reset]);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const result = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || "";
      });
      return obj;
    });

    return result;
  };

  const isValidSKU = (sku) => /^\d{14}$/.test(sku);

  const onSubmit = async () => {
    if (!fileData) {
      toast.error("Please upload a CSV file first.");
      return;
    }

    try {
      const text = await fileData.text();
      const json = parseCSV(text);

      const requiredFields = [
        "parent_category",
        "sub_category",
        "sku",
        "description",
        "url_image",
      ];

      const processedData = [];
      const errors = [];

      json.forEach((row, index) => {
        const rowErrors = [];

        requiredFields.forEach((field) => {
          if (!row[field]?.trim()) {
            rowErrors.push(`Missing field: ${field}`);
          }
        });

        if (row.sku && !isValidSKU(row.sku)) {
          rowErrors.push("Invalid SKU (must be 14 digits)");
        }

        if (rowErrors.length > 0) {
          errors.push({
            line: index + 2,
            row,
            errors: rowErrors,
          });
        } else {
          processedData.push({
            category_code: row.parent_category,
            sub_category_code: row.sub_category,
            sku: row.sku,
            description: row.description,
            url_image: row.url_image
              .split("|")
              .map((url) => url.trim())
              .filter(Boolean),
          });
        }
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error("Validation failed. See details below.");
        return;
      }

      const response = await saveItem(processedData);
      const failed = response.data.failed || [];
      const success = response.data.success || [];
      setFailedData(failed);
      setSuccesData(success);
      await fetchItems();

      toast.success("Upload complete.");
    } catch (error) {
      console.error("CSV Parse Error:", error);
      toast.error("Failed to parse CSV.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-2xl p-6 overflow-y-auto"
        style={{ maxWidth: "80%", maxHeight: "80%" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            Bulk Add Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          {/* File Upload */}
          <div>
            <Label className="font-bold mb-3" htmlFor="csvFile">
              Upload CSV
            </Label>
            <Input
              type="file"
              accept=".csv"
              {...register("csvFile")}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFileData(file);
                setValidationErrors([]);
                setSuccesData([]);
                setFailedData([]);
              }}
            />
          </div>

          {/* CSV Template Info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="mb-1 font-medium text-black">CSV Template Example:</p>
            <pre className="whitespace-pre-wrap">
              parent_category, sub_category, sku, description, url_image
              <br />
              12345, 6789, 12345678901234, test desc,
              https://images1.jpg|https://images2.jpg
            </pre>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-md text-sm space-y-2">
              <p className="font-bold">Validation Errors:</p>
              {validationErrors.map((err) => (
                <div key={err.line}>
                  <p>
                    <strong>Line {err.line}:</strong> {err.errors.join("; ")}
                  </p>
                  <pre className="bg-red-100 text-xs p-2 mt-1 rounded">
                    {JSON.stringify(err.row, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Success Data */}
          {successData.length > 0 && (
            <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-md text-sm space-y-2">
              <p className="font-bold">Data Success:</p>
              {successData.map((item, index) => (
                <pre
                  key={index}
                  className="bg-green-100 text-xs p-2 rounded overflow-auto"
                >
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))}
            </div>
          )}

          {/* Failed Data */}
          {failedData.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-md text-sm space-y-2">
              <p className="font-bold">Data Failed:</p>
              {failedData.map((item, index) => (
                <pre
                  key={index}
                  className="bg-yellow-100 text-xs p-2 rounded overflow-auto"
                >
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Close
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
