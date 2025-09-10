"use client";
import { useEffect, useState } from "react";
import ItemModal from "@/components/modal/item-modal";
import BulkAddItemModal from "@/components/modal/bulk-add-item-modal";
import { toast } from "sonner";
import {
  getItems,
  syncItemProfit,
  updateItemInStore,
  deleteItem,
  deleteItemInStore,
} from "@/services/item";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Carousel from "@/components/ui/Carousel";
import { formatRupiah, formatJakartaTime } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/lib/ConfirmDialogContext";
import { Pagination } from "@/components/Pagination";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import IconButton from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Save, X, Trash, Upload } from "lucide-react";

export default function Item() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [displayDataCustom, setDisplayDataCustom] = useState(null);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");

  const { confirm } = useConfirm();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const result = await getItems(currentPage, q);
      setItems(result.data);
      setTotalPages(result.meta.total_page);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      toast("Fetch Failed", {
        description: "Unable to load items. Please try again later.",
      });
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    const confirmStatus = await confirm({
      title: "Are you sure?",
      description: "This will change the active status",
    });
    if (!confirmStatus) return;

    try {
      await updateItemInStore(id, { is_active: currentStatus ? 0 : 1 });
      await fetchItems();
      toast(currentStatus ? "Deactivated" : "Activated", {
        description: `The item has been successfully ${
          currentStatus ? "deactivated" : "activated"
        }.`,
      });
    } catch (err) {
      toast("Update Failed", {
        description:
          "There was an error changing the status. Please try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await confirm({
      title: "Are you sure?",
      description: "This will permanently delete the item.",
    });
    if (!confirmDelete) return;
    try {
      await deleteItem(id);
      await fetchItems();
      toast("Item Deleted", {
        description: "The item has been successfully deleted.",
      });
    } catch (err) {
      toast("Deletion Failed", {
        description: "Failed to delete the item. Please try again.",
      });
    }
  };

  const handleUpdateCustom = async (id) => {
    try {
      await updateItemInStore(id, {
        custom_stock:
          !editData.custom_stock || editData.custom_stock === ""
            ? null
            : editData.custom_stock,
        custom_price:
          !editData.custom_price || editData.custom_price === ""
            ? null
            : editData.custom_price,
      });

      await fetchItems();
      setDisplayDataCustom(null);

      toast("Item Updated", {
        description: "The item's custom data has been successfully updated.",
      });
    } catch (err) {
      toast("Update Failed", {
        description:
          err.message || "Failed to update item custom data. Please try again.",
      });
    }
  };

  const handleShowDataCustom = async (data) => {
    if (displayDataCustom && data.sku === displayDataCustom.sku) {
      setDisplayDataCustom(null);
      return;
    }

    setDisplayDataCustom(data);
  };

  const handleSyncProfit = async (sku) => {
    const confirmSync = await confirm({
      title: "Are you sure?",
      description: "This will syncEe data from profit",
    });
    if (!confirmSync) return;

    try {
      await syncItemProfit({ sku });
      await fetchItems();

      toast("Sync Successful", {
        description: "The item has been successfully synced.",
      });
    } catch (err) {
      toast("Sync Failed", {
        description: "Failed to sync the item. Please try again.",
      });
    }
  };

  const handleEditCustom = (storeId, customStock, customPrice) => {
    setIsEditingCustom(true);
    setEditData({
      id: storeId,
      custom_stock: customStock ?? null,
      custom_price: customPrice ?? null,
    });
  };

  const handleCancelEdit = () => {
    setIsEditingCustom(false);
    setEditData({});
  };

  const handleDeleteItemInStore = async (id) => {
    const confirmDelete = await confirm({
      title: "Are you sure?",
      description: "This will permanently delete the store.",
    });
    if (!confirmDelete) return;

    try {
      await deleteItemInStore(id);
      await fetchItems();
      setDisplayDataCustom(null);

      toast("Item Deleted", {
        description: "The item has been successfully removed from the store.",
      });
    } catch (err) {
      toast("Deletion Failed", {
        description: "Failed to delete the item. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, [q,currentPage]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between border-b mb-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Items Management
          </h1>
          <div className="flex flex-row gap-2 mb-5">
            <Button
              className="bg-gray-100 text-black border border-gray-500 hover:bg-gray-500 hover:text-white"
              onClick={() => {
                setOpenBulkModal(true);
              }}
            >
              <Upload size={18} /> Bulk New Item
            </Button>
            <Button
              onClick={() => {
                setEditId(null);
                setOpenModal(true);
              }}
            >
              <Plus size={18} /> Add New Item
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full border p-4 rounded-lg gap-3 bg-gray-50 border-gray-200">
          <Input
            className="w-full md:w-[80%] bg-white"
            placeholder="Search by name / sku / barcode"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="w-full md:w-[20%]" onClick={() => setQ(search)}>
            Search
          </Button>
        </div>
      </CardHeader>

      {loading ? (
        // Skeleton Loading State
        <CardContent className="flex flex-col md:flex-row w-full h-screen md:h-[250px] min-h-screen md:min-h-[250px] rounded-lg">
          {/* Left Side (Image and Details) */}
          <div className="flex w-full md:w-[25%] rounded-l-lg">
            <div className="w-full border border-gray-200 p-4 h-full overflow-y-auto rounded-none md:rounded-l-lg bg-white transition-all duration-300">
              <div className="relative">
                {/* Skeleton for Image Carousel */}
                <Skeleton className="w-full h-[200px] rounded-lg" />
                {/* Skeleton for Stock and Price Badges */}
                <Skeleton className="absolute bottom-4 left-4 w-16 h-6 rounded-none md:rounded-lg" />
                <Skeleton className="absolute top-4 right-4 w-20 h-6 rounded-lg" />
              </div>
              <div className="mt-4 space-y-2">
                {/* Skeleton for SKU, Barcode, Name, and Description */}
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-16 w-full" />
                {/* Skeleton for More Info Button */}
                <Skeleton className="h-4 w-20" />
              </div>
              {/* Skeleton for Category/Subcategory Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              {/* Skeleton for Buttons */}
              <Skeleton className="w-full h-10 mt-5" />
              <Skeleton className="w-full h-10 mt-2" />
              <Skeleton className="w-full h-10 mt-2" />
            </div>
          </div>
          {/* Right Side (Table) */}
          <div className="flex w-full md:w-[75%] rounded-none md:rounded-l-lg">
            <div className="border w-full p-2 h-full overflow-y-auto bg-white rounded-none md:rounded-r-lg md:w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Skeleton for Table Headers */}
                    <TableHead>
                      <Skeleton className="h-6 w-20" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-6 w-20" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Skeleton for Table Rows (e.g., 3 rows) */}
                  {[...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      ) : (
        items.map((item) => (
          <CardContent
            className="flex flex-col md:flex-row w-full h-screen md:h-[250px] min-h-screen md:min-h-[250px] rounded-lg"
            key={item.id}
          >
            <div className="flex w-full md:w-[25%] rounded-l-lg">
              <div className="w-full border border-gray-200 p-4 h-full overflow-y-auto rounded-none md:rounded-l-lg bg-white transition-all duration-300">
                <div className="relative">
                  {displayDataCustom && displayDataCustom.sku === item.sku && (
                    <span className="absolute bottom-4 left-4 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-none md:rounded-lg z-20">
                      {displayDataCustom.stock} Qty
                    </span>
                  )}
                  {displayDataCustom && displayDataCustom.sku === item.sku && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-20">
                      {formatRupiah(displayDataCustom.price)}
                    </span>
                  )}
                  <div className="rounded-lg overflow-hidden">
                    <Carousel images={item.url_image} />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {item.sku}
                  </h3>
                  <h3 className="font-medium text-sm text-red-600">
                    {item.barcode}
                  </h3>
                  <h3 className="text-base font-semibold">
                    <span className="text-gray-800">{item.name}</span>{" "}
                    <span className="text-gray-500">
                      ({item.weight} {item.unit})
                    </span>
                  </h3>
                  <div>
                    <p
                      className={`text-gray-600 text-sm mt-1 transition-all duration-300 ease-in-out ${
                        expandedItems[item.id] ? "" : "line-clamp-2"
                      }`}
                      style={{ lineHeight: "1.5" }}
                    >
                      {item.description}
                    </p>
                    <button
                      className="text-blue-600 text-xs font-medium mt-2 hover:text-blue-800 hover:underline focus:outline-none cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedItems[item.id] ? "Show Less" : "More Info"}
                    </button>
                  </div>
                </div>
                {(item.category?.name || item.sub_category?.name) && (
                  <ul className="flex flex-wrap text-sm gap-2 mt-3">
                    {item.category?.name && (
                      <li className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {item.category.name}
                        </span>
                      </li>
                    )}
                    {item.sub_category?.name && (
                      <li className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {item.sub_category.name}
                        </span>
                      </li>
                    )}
                  </ul>
                )}
                <Button
                  onClick={() => {
                    handleSyncProfit(item.sku);
                  }}
                  className="w-full mt-5 border border-black bg-white text-black hover:bg-black hover:text-white"
                >
                  Sync Profit
                </Button>
                <Button
                  className="w-full mt-2 border border-black bg-white text-black hover:bg-black hover:text-white"
                  onClick={() => {
                    setEditId(item.id);
                    setOpenModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="w-full mt-2 border bg-red-700 border-red-700 text-white hover:bg-red-600  hover:border hover:border-red-600"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="flex w-full md:w-[75%] rounded-none md:rounded-l-lg">
              <div className="border w-full p-2 h-full overflow-y-auto bg-white rounded-none md:rounded-r-lg md:w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Store Code</TableHead>
                      <TableHead className="font-bold">Stock</TableHead>
                      <TableHead className="font-bold">Price</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">
                        Latest Sync At
                      </TableHead>
                      <TableHead className="font-bold">Custom Stock</TableHead>
                      <TableHead className="font-bold">
                        Custom Price
                      </TableHead>
                      <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.item_in_store.map((store) => {
                      const isCurrentEditing =
                        isEditingCustom && editData.id === store.id;
                      return (
                        <TableRow
                          className="cursor-pointer"
                          key={store.store_code}
                          onClick={() =>
                            handleShowDataCustom({
                              sku: item.sku,
                              price: store.custom_price ?? store.price,
                              stock: store.custom_stock ?? store.stock,
                            })
                          }
                        >
                          <TableCell>{store.store_code}</TableCell>
                          <TableCell>{store.stock} Qty</TableCell>
                          <TableCell>{formatRupiah(store.price)}</TableCell>
                          <TableCell>
                            <Switch
                              status={store.is_active}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActiveStatus(store.id, store.is_active);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {formatJakartaTime(store.updated_at)}
                          </TableCell>
                          <TableCell>
                            <Input
                              disabled={!isCurrentEditing}
                              type="number"
                              onClick={(e) => e.stopPropagation()}
                              className={`rounded-lg h-[30px] w-[100px] ${
                                isCurrentEditing
                                  ? " bg-white border border-black"
                                  : ""
                              }`}
                              value={
                                isCurrentEditing
                                  ? String(editData.custom_stock ?? "")
                                  : String(store.custom_stock ?? "")
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  custom_stock: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              disabled={!isCurrentEditing}
                              type="number"
                              onClick={(e) => e.stopPropagation()}
                              className={`rounded-lg h-[30px] w-[100px] ${
                                isCurrentEditing
                                  ? " bg-white border border-black"
                                  : ""
                              }`}
                              value={
                                isCurrentEditing
                                  ? String(editData.custom_price ?? "")
                                  : String(store.custom_price ?? "")
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  custom_price: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                gap: "2px",
                                alignItems: "center",
                              }}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isCurrentEditing) {
                                    handleUpdateCustom(store.id);
                                  } else {
                                    handleEditCustom(
                                      store.id,
                                      store.custom_stock,
                                      store.custom_price
                                    );
                                  }
                                }}
                                tooltip={
                                  isCurrentEditing
                                    ? "Save Changes"
                                    : "Edit Custom Data"
                                }
                              >
                                {isCurrentEditing ? (
                                  <Save size={14} />
                                ) : (
                                  <Pencil size={14} />
                                )}
                              </IconButton>
                              {isCurrentEditing ? (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                  tooltip="Cancel Edit"
                                >
                                  <X size={14} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItemInStore(store.id);
                                  }}
                                  tooltip="Delete"
                                >
                                  <Trash size={14} />
                                </IconButton>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        ))
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(e) => setCurrentPage(e)}
      />
      <ItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        id={editId}
        onSuccess={fetchItems}
      />

      <BulkAddItemModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        fetchItems={fetchItems}
      />
    </Card>
  );
}
