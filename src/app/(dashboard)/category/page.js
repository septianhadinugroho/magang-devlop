"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import BulkAddCategoyModal from "@/components/modal/bulk-add-category-model";
import {
  getCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/lib/ConfirmDialogContext";
import copy from "copy-to-clipboard";

import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  X,
  ClipboardCopy,
  Upload,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import IconButton from "@/components/ui/IconButton";
import { toast } from "sonner";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { confirm } = useConfirm();
  const [openBulkModal, setOpenBulkModal] = useState(false);

  const getMarginLeft = (level) => {
    return 20 + level * 20;
  };

  const handleCopy = (code) => {
    const success = copy(code);
    if (success) {
      toast("Copied!");
    } else {
      toast("Copy failed");
    }
  };

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerAddSub,
    handleSubmit: handleSubmitAddSub,
    reset: resetAddSub,
  } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      toast("Fetch Failed", {
        description:
          err.message || "Failed to fetch categories. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addCategoryHandler = async (data) => {
    if (!data.code || !data.name) return;
    const confirmAdd = await confirm({
      title: "Are you sure?",
      description: "This will add a category",
    });
    if (!confirmAdd) return;

    setLoading(true);
    try {
      const result = await saveCategory([
        {
          code: data.code,
          parent_category_id: null,
          name: data.name,
        },
      ]);
      reset();
      const failed = result.data.failed;
      if (failed.length) {
        toast("Add Category Failed", {
          description: failed[0].reason,
        });
        return;
      }
      await fetchCategories();

      toast("Category Added", {
        description: "The category has been successfully added.",
      });
    } catch (err) {
      toast("Add Category Failed", {
        description: err.message || "Failed to add category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSubCategoryHandler = async (parentId, data) => {
    if (!data.code || !data.name) return;
    const confirmAdd = await confirm({
      title: "Are you sure?",
      description: "This will add a subcategory",
    });
    if (!confirmAdd) return;

    setLoading(true);
    try {
      const result = await saveCategory([
        {
          code: data.code,
          parent_category_id: parentId,
          name: data.name,
        },
      ]);

      const failed = result.data.failed;
      if (failed.length) {
        toast("Add Category Failed", {
          description: failed[0].reason,
        });
        return;
      }

      await fetchCategories();
      setAddCategory(null);
      resetAddSub();

      toast("Subcategory Added", {
        description: "The subcategory has been successfully added.",
      });
    } catch (err) {
      toast("Add Subcategory Failed", {
        description:
          err.message || "Failed to add subcategory. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryHandler = async (id, data) => {
    if (!data.name) return;

    const confirmUpdate = await confirm({
      title: "Are you",
      description: "This will update a subcategory",
    });
    if (!confirmUpdate) return;

    setLoading(true);
    try {
      await updateCategory(id, { name: data.name, code: data.code });
      await fetchCategories();
      setEditCategory(null);
      resetEdit();

      toast("Category Updated", {
        description: "The category has been successfully updated.",
      });
    } catch (err) {
      toast("Update Failed", {
        description:
          err.message || "Failed to update category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategoryHandler = async (id) => {
    const confirmDelete = await confirm({
      title: "Are you sure?",
      description: "This will delete a category",
    });
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteCategory(id);
      await fetchCategories();

      toast("Category Deleted", {
        description: "The category has been successfully deleted.",
      });
    } catch (err) {
      toast("Deletion Failed", {
        description:
          err.message || "Failed to delete category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus, code) => {
    const confirmUpdate = await confirm({
      title: "Are you sure?",
      description: "This will update active status category",
    });
    if (!confirmUpdate) return;
    setLoading(true);
    try {
      await updateCategory(id, { is_active: currentStatus ? 0 : 1, code });
      await fetchCategories();

      toast("Status Updated", {
        description: `Category ${
          currentStatus ? "deactivated" : "activated"
        } successfully.`,
      });
    } catch (err) {
      toast("Status Update Failed", {
        description:
          err.message || "Failed to change active status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const CategoryNode = ({ category, level }) => {
    const isExpanded = expandedCategories[category.id] || false;
    const hasSubcategories = category.sub_category.length > 0;

    return (
      <div className={`my-1`}>
        <div
          style={{
            display: "inline-block",
            width: `${level * 2}%`,
            height: "2px",
            backgroundColor: "#E4E7EB",
            verticalAlign: "middle",
          }}
        />
        <div
          className={`inline-flex items-center gap-2 py-1 px-3 cursor-pointer ${
            level === 0 ? "bg-gray-50 rounded-md" : ""
          } bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200`}
          style={{
            width: `${100 - level * 2}%`,
          }}
          onClick={hasSubcategories ? () => toggleExpand(category.id) : null}
        >
          {hasSubcategories && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(category.id);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-700" />
              ) : (
                <ChevronRight size={16} className="text-gray-700" />
              )}
            </button>
          )}
          {editCategory === category.id ? (
            <form
              onSubmit={handleSubmitEdit((data) =>
                updateCategoryHandler(category.id, data)
              )}
              className="flex items-center gap-2 flex-1"
            >
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                {...registerEdit("code")}
                defaultValue={category.code}
                onChange={(e) => setValueEdit("code", e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-gray-800 w-1/3 bg-white outline-none"
                autoFocus
              />
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                {...registerEdit("name")}
                defaultValue={category.name}
                onChange={(e) => setValueEdit("name", e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-gray-800 flex-1 bg-white outline-none"
              />
              <button
                onClick={(e) => e.stopPropagation()}
                type="submit"
                className="cursor-pointer bg-black text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
              >
                <Check size={16} /> Save
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCategory(null);
                  resetEdit();
                }}
                className="cursor-pointer bg-gray-300 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-400 transition-colors flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </button>
            </form>
          ) : addCategory === category.id ? (
            <form
              onSubmit={handleSubmitAddSub((data) =>
                addSubCategoryHandler(category.id, data)
              )}
              className="flex items-center gap-2 flex-1"
            >
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                {...registerAddSub("code")}
                placeholder="Subcategory Code"
                className="border border-gray-300 rounded px-3 py-1.5 text-gray-800 w-1/3 bg-white outline-none"
                autoFocus
              />
              <input
                onClick={(e) => e.stopPropagation()}
                type="text"
                {...registerAddSub("name")}
                placeholder="New Subcategory"
                className="border border-gray-300 rounded px-3 py-1.5 text-gray-800 flex-1 bg-white outline-none"
              />
              <button
                type="submit"
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer bg-black text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
              >
                <Check size={16} /> Save
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddCategory(null);
                  resetAddSub();
                }}
                className="cursor-pointer bg-gray-300 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-400 transition-colors flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </button>
            </form>
          ) : level < 1 ? (
            <>
              <span className="text-gray-800 font-medium flex-1">
                <table className="text-gray-800 text-sm leading-tight">
                  <tbody>
                    <tr>
                      <td className="font-bold px-1 py-0.5">Code</td>
                      <td className="px-1 py-0.5">{category.code}</td>
                      <td className="px-2">
                        <ClipboardCopy
                          size={16}
                          onClick={(e) => {
                            handleCopy(category.code);
                            e.stopPropagation();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold px-1 py-0.5">Name</td>
                      <td className="px-1 py-0.5">{category.name}</td>
                    </tr>
                  </tbody>
                </table>
              </span>
              <div className="flex gap-2 items-center">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddCategory(category.id);
                    resetAddSub();
                  }}
                  tooltip="Add Subcategory"
                >
                  <Plus size={14} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setEditCategory(category.id);
                    setValueEdit("id", category.id);
                    setValueEdit("name", category.name);
                  }}
                  tooltip="Edit Category"
                >
                  <Pencil size={14} />
                </IconButton>
                <IconButton
                  onClick={() => deleteCategoryHandler(category.id)}
                  tooltip="Delete Category"
                >
                  <Trash2 size={14} />
                </IconButton>
                <Switch
                  status={category.is_active}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActiveStatus(
                      category.id,
                      category.is_active,
                      category.code
                    );
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <span className="text-gray-800 font-medium flex-1">
                <table className="text-gray-800 text-sm leading-tight">
                  <tbody>
                    <tr>
                      <td className="font-bold px-1 py-0.5">Code</td>
                      <td className="px-1 py-0.5">{category.code}</td>
                      <td className="px-2">
                        <ClipboardCopy
                          size={16}
                          onClick={(e) => {
                            handleCopy(category.code);
                            e.stopPropagation();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold px-1 py-0.5">Name</td>
                      <td className="px-1 py-0.5">{category.name}</td>
                    </tr>
                  </tbody>
                </table>
              </span>

              <div className="flex gap-2 items-center">
                <IconButton
                  onClick={() => {
                    setEditCategory(category.id);
                    setValueEdit("code", category.code);
                    setValueEdit("name", category.name);
                  }}
                  tooltip="Edit Category"
                >
                  <Pencil size={14} />
                </IconButton>
                <IconButton
                  onClick={() => deleteCategoryHandler(category.id)}
                  tooltip="Delete Category"
                >
                  <Trash2 size={14} />
                </IconButton>
                <Switch
                  status={category.is_active}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActiveStatus(category.id, category.is_active);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {isExpanded && hasSubcategories && (
          <div
            className="border-l-2 border-gray-200 mt-1"
            style={{ marginLeft: `${getMarginLeft(level)}px` }}
          >
            {category.sub_category.map((subCat) => (
              <CategoryNode
                key={subCat.id}
                category={subCat}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const Notification = ({ message, type }) => {
    const bgColor =
      type === "success"
        ? "bg-green-100 border-green-500 text-green-700"
        : "bg-red-100 border-red-500 text-red-700";
    const icon =
      type === "success" ? (
        <Check size={18} className="text-green-500" />
      ) : (
        <AlertCircle size={18} className="text-red-500" />
      );

    return (
      <div
        className={`fixed top-4 right-4 px-4 py-3 rounded-lg border shadow-md flex items-center gap-2 ${bgColor} animate-fadeIn`}
      >
        {icon}
        <span>{message}</span>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between border-b mb-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800  pb-4">
            Categories Management
          </h1>
          <Button
            className="bg-gray-100 text-black border border-gray-500 hover:bg-gray-500 hover:text-white"
            onClick={() => {
              setOpenBulkModal(true);
            }}
          >
            <Upload size={18} />    Bulk New Category
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border border-red-200 flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}

        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Add New Category
          </h2>
          <form
            onSubmit={handleSubmit(addCategoryHandler)}
            className="flex gap-2 flex-col md:flex-row"
          >
            <input
              type="text"
              {...register("code")}
              placeholder="Enter category Code"
              className="border w-full border-gray-300 rounded-md px-3 py-2 text-gray-800 md:w-1/3 focus:ring-2 bg-white outline-none"
              disabled={loading}
            />
            <input
              type="text"
              {...register("name")}
              placeholder="Enter category name..."
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 flex-1 focus:ring-2 bg-white outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-black text-white px-[50px] py-2 mt-3 md:mt-0 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-md border border-gray-200">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
            Available Categories
          </div>

          <div className="p-4 space-y-1">
            {loading && categories.length === 0 ? (
              <>
                <Skeleton className="w-full h-[50px] rounded-lg" />
                <Skeleton className="w-full h-[50px] rounded-lg" />
                <Skeleton className="w-full h-[50px] rounded-lg" />
              </>
            ) : !loading && categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories found. Add your first category above.
              </div>
            ) : (
              categories.map((category) => (
                <CategoryNode key={category.id} category={category} level={0} />
              ))
            )}
          </div>
        </div>
      </Card>

      <BulkAddCategoyModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        fetchCategories={fetchCategories}
      />
    </>
  );
};

export default App;
