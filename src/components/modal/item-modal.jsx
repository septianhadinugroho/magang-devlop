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
import { useForm, useFieldArray } from "react-hook-form";
import { getItemById, saveItem, updateItem } from "@/services/item";
import { getCategories, getCategoryById } from "@/services/category";
import { CATEGORIES_STATUS } from "@/lib/constants";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function ItemModal({ open, onClose, id, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      url_image: [{ value: "" }],
      category_id: "",
      sub_category_id: "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "url_image",
  });

  const fetchCategories = async () => {
    try {
      const response = await getCategories(CATEGORIES_STATUS.ACTIVE);
      setCategories(response);
    } catch (error) {
      toast("Fetch Failed", {
        description:
          error.message || "Failed to fetch categories. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [id]);

  useEffect(() => {
    setSubCategories([]);
    if (id) {
      (async () => {
        const result = await getItemById(id);
        const subCategoryData = await getCategoryById(result.category_id);
        setSubCategories(subCategoryData.sub_category);
        reset({
          sku: result.sku,
          name: result.name,
          description: result.description,
          category_id: result.category_id,
          sub_category_id: result.sub_category_id ?? "",
          url_image: result.url_image?.map((url) => ({ value: url })) || [
            { value: "" },
          ],
        });
      })();
    } else {
      reset();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    const urlValues = data.url_image.map((item) => item.value.trim());
    const filled = urlValues.filter((url) => url !== "");

    if (!id) {
      delete data.name;
    }

    const payload = {
      ...data,
      url_image: filled,
    };

    try {
     
      if (id) {
       await updateItem(id, payload);
      } else {
        const body =[
          payload
        ]
      await saveItem(body);
      }
      reset({
        sku: "",
        name: "",
        description: "",
        url_image: [{ value: "" }],
        category_id: "",
        sub_category_id: "",
      });

      // Success Toast
      toast("Item saved successfully", {
        description: "The item has been successfully saved.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      // Error Toast
      toast("Submission Failed", {
        description:
          error.message ||
          "There was an error while submitting the item. Please try again.",
      });
    }
  };

  const changeCategory = async (e) => {
    const selectedCategory = e.target.value;
    const valueSelectedCategory =
      selectedCategory === "" ? null : selectedCategory;
    setValue("category_id", valueSelectedCategory);
    setValue("sub_category_id", "");
    setSubCategories([]);
    if (valueSelectedCategory) {
      const data = categories.filter(
        (category) => category.id === valueSelectedCategory
      );
      setSubCategories(data[0].sub_category ?? []);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full p-6"
        style={{ maxWidth: "80%", maxHeight: "90vh" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            {id ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Side */}
            <div className="flex-1 grid gap-4 min-w-[300px]">
              {/* Category */}
              <div className="grid gap-1">
                <Label htmlFor="category_id" className="font-semibold mb-1">
                  Category
                </Label>
                <select
                  id="category_id"
                  {...register("category_id", {
                    required: "Category is required",
                  })}
                  onChange={changeCategory}
                  className="border border-input rounded-md p-2 text-sm"
                >
                  <option value="">-- Choose --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-sm text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              {/* Sub Category */}
              <div className="grid gap-1">
                <Label htmlFor="sub_category_id" className="font-semibold mb-1">
                  Sub Category
                </Label>
                <select
                  id="sub_category_id"
                  {...register("sub_category_id")}
                  className="border border-input rounded-md p-2 text-sm"
                  value={watch("sub_category_id")}
                >
                  <option value="">None</option>
                  {subCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU (only create) */}

              <div className="grid gap-1">
                <Label htmlFor="sku" className="font-semibold mb-1">
                  SKU
                </Label>
                <Input
                  id="sku"
                  disabled={id}
                  placeholder="Enter SKU"
                  {...register("sku", {
                    required: "This field is required",
                    minLength: {
                      value: 14,
                      message: "SKU must be exactly 14 characters long",
                    },
                    maxLength: {
                      value: 14,
                      message: "SKU must be exactly 14 characters long",
                    },
                  })}
                />

                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
              </div>

              {/* Name (only edit) */}
              {id && (
                <div className="grid gap-1">
                  <Label htmlFor="name" className="font-semibold mb-1">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter Item Name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex-1 grid gap-4 min-w-[300px]">
              <div className="grid gap-1">
                <Label htmlFor="description" className="font-semibold mb-1">
                  Description
                </Label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "This field is required",
                  })}
                  className="border p-2 rounded-md focus:ring-3 focus:ring-gray-300 min-h-[100px]"
                  placeholder="Enter Description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* URL Images */}
              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold mb-1">URL Images</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-black hover:bg-black hover:text-white"
                    onClick={() => append({ value: "" })}
                    size="sm"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <Input
                        placeholder="Enter image URL"
                        {...register(`url_image.${index}.value`, {
                          required: "This field is required",
                        })}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="destructive"
                          size="sm"
                          className="self-center bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.url_image && (
                    <p className="text-sm text-red-500">
                      {errors.url_image.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
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
