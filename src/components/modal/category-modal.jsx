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
import {
  saveCategory,
  updateCategory,
  getCategoryById,
  getCategories,
} from "@/services/category";
import { useForm } from "react-hook-form";

export default function CategoryModal({ open, onClose, id, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      is_active: "",
      parent_category_id: null,
    },
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (id) {
      (async () => {
        const result = await getCategoryById(id);
        const resultList = await getCategories();
        setCategories(resultList);
        reset({
          name: result.name,
          is_active: result.is_active,
          parent_category_id: result.parent_category_id,
        });
      })();
    } else {
      reset({
        name: "",
        is_active: "",
        parent_category_id: null,
      });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      let message;

      if (id) {
        message = await updateCategory(id, data);
      } else {
        message = await saveCategory(data); // gunakan `data` jika `payload` tidak didefinisikan
      }

      alert(message);
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="z-10">
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            {id ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
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
              <p className="text-sm text-red-500">{errors.name.message}</p>
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

          {id && (
            <div className="  py-5 px-3 rounded-md grid gap-4 shadow-sm border">
              <div className="grid gap-1">
                <Label
                  htmlFor="parent_category_id"
                  className="font-semibold mb-1"
                >
                  Parent Category
                </Label>
                <select
                  id="parent_category_id"
                  {...register("parent_category_id")}
                  defaultValue={null}
                  className="border border-input rounded-md p-2 text-sm"
                >
                  <option value={null}>None</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.is_active && (
                  <p className="text-sm text-red-500">
                    {errors.is_active.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="is_active" className="font-semibold mb-1">
                  Sub Category
                </Label>
                <select
                  id="is_active"
                  {...register("is_active", {
                    required: "This field is required",
                  })}
                  className="border border-input rounded-md p-2 text-sm"
                >
                  <option value={""}>-- Chosee --</option>
                  <option value={0}>Inactive</option>
                  <option value={1}>Active</option>
                </select>
                {errors.is_active && (
                  <p className="text-sm text-red-500">
                    {errors.is_active.message}
                  </p>
                )}
              </div>
            </div>
          )}

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
