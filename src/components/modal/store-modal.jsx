"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getStoreById, saveStore, updateStore } from "@/services/store";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function StoreModal({ open, onClose, id, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      grab_store_code: "",
      parent_store_code: "",
      store_code: "",
      name : "",
      is_active: "",
    },
  });

  useEffect(() => {
    if (id) {
      (async () => {
        const result = await getStoreById(id);
        reset({
          grab_store_code: result.grab_store_code,
          parent_store_code: result.parent_store_code,
          store_code: result.store_code,
          name: result.name,
          is_active: result.is_active,
        });
      })();
    } else {
      reset({
        grab_store_code: "",
        parent_store_code: "",
        store_code: "",
        is_active: "",
        name : "",
      });
    }
  }, [id, reset]);



  const onSubmit = async (data) => {
    try {
      let message;
  
      // Use data directly without payload
      if (id) {
        message = await updateStore(id, data); // Use data directly for update
      } else {
        message = await saveStore(data); // Use data directly for save
      }
  
      // Success toast
      toast("Store saved successfully", {
        description: "Your store details have been successfully saved.",
      });
  
      onSuccess();
      onClose();
    } catch (err) {
      // Error toast
      toast("Fetch Failed", {
        description: err.message || "Failed to save store details. Please try again.",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            {id ? "Edit Store" : "Add New Store"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid gap-1">
            <Label htmlFor="grab_store_code" className="font-semibold mb-1">
              Grab Store Code
            </Label>
            <Input
              id="grab_store_code"
              placeholder="Enter Grab Store Code"
              {...register("grab_store_code", {
                required: "This field is required",
              })}
            />
            {errors.grab_store_code && (
              <p className="text-sm text-red-500">
                {errors.grab_store_code.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="parent_store_code" className="font-semibold mb-1">
              Parent Store Code
            </Label>
            <Input
              id="parent_store_code"
              placeholder="Enter Parent Store Code"
              {...register("parent_store_code", {
                required: "This field is required",
              })}
            />
            {errors.parent_store_code && (
              <p className="text-sm text-red-500">
                {errors.parent_store_code.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="store_code" className="font-semibold mb-1">
              Store Code
            </Label>
            <Input
              id="store_code"
              placeholder="Enter Store Code"
              {...register("store_code", {
                required: "This field is required",
              })}
            />
            {errors.store_code && (
              <p className="text-sm text-red-500">
                {errors.store_code.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="name" className="font-semibold mb-1">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter Name"
              {...register("name", {
                required: "This field is required",
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="is_active" className="font-semibold mb-1">
              Status
            </Label>
            <select
              id="is_active"
              {...register("is_active", { required: "This field is required" })}
              className="border border-input rounded-md p-2 text-sm"
            >
              <option value={""}>-- Chosee --</option>
              <option value={0}>Inactive</option>
              <option value={1}>Active</option>
            </select>
            {errors.is_active && (
              <p className="text-sm text-red-500">{errors.is_active.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
