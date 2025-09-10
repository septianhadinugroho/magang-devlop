"use client";
import { useEffect, useState } from "react";
import StoreModal from "@/components/modal/store-modal";
import {
  getStores,
  deleteStore,
  updateStatusSync,
  getMenu,
} from "@/services/store";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import copy from "copy-to-clipboard";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import {
  SYNC_GRAB_STATUS_STORE,
  SYNC_PROFIT_STATUS_STORE,
  SYNC_GRAB_STATUS_STORE_CODE,
} from "@/lib/constants";
import IconButton from "@/components/ui/IconButton";
import { useConfirm } from "@/lib/ConfirmDialogContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/Pagination";
import JsonView from "@uiw/react-json-view";

import {
  ReplaceAll,
  Repeat,
  Pencil,
  Trash2,
  ClipboardCopy,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Store() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const { confirm } = useConfirm();
  const [isOpen, setIsOpen] = useState(false);
  const [dataMenu, setDataMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalData = 10;

  const fetchStores = async () => {
    setLoading(true);
    try {
      const result = await getStores(currentPage, totalData);
      setStores(result.data);
      setTotalPages(result.meta.total_page);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      toast("Fetch Failed", {
        description: "Unable to load stores. Please try again later.",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await confirm({
      title: "Are you sure?",
      description: "This will permanently delete the store.",
    });
    if (!confirmDelete) return;

    try {
      await deleteStore(id);
      await fetchStores();

      toast("Store Deleted", {
        description: "The store has been successfully deleted.",
      });
    } catch (err) {
      toast("Deletion Failed", {
        description: "Failed to delete the store. Please try again.",
      });
    }
  };

  const displayJsonGrab = async (grabStoreCode) => {
    const result = await getMenu(grabStoreCode);
    setDataMenu(result);
    setIsOpen(true);
  };

  const handleCopy = () => {
    const success = copy(JSON.stringify(dataMenu, null, 2));
    if (success) {
      toast("Copied!");
    } else {
      toast("Copy failed");
    }
  };
  const handleResync = async (id, sync_type) => {
    try {
      const confirmSybc = await confirm({
        title: "Are you sure?",
        description: "This will Sync Data the store.",
      });
      if (!confirmSybc) return;

      await updateStatusSync(id, { sync_type });
      await fetchStores();

      toast("Sync Successful", {
        description: "The store has been successfully resynced.",
      });
    } catch (error) {
      toast("Sync Failed", {
        description: "Failed to resync the store. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchStores();
  }, [currentPage]);

  if (error) return <p>{error}</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between gap-2  border-b pb-4">
          <h1 className="text-3xl font-bold text-center md:text-left">
            Stores Management
          </h1>
          <Button
            onClick={() => {
              setEditId(null);
              setOpenModal(true);
            }}
          >
            <Plus size={18} /> Add New Store
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Grab Store Code</TableHead>
              <TableHead className="font-bold">Parent Store Code</TableHead>
              <TableHead className="font-bold">Store Code</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Active</TableHead>
              <TableHead className="font-bold">
                Daily Profit Sync Status
              </TableHead>
              <TableHead className="font-bold">
                Daily Grab Sync Status
              </TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array(5)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[40px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : stores.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <h2 className="py-5  text-gray-500 text-[16px]">
                    No store data found. Add your first store above.
                  </h2>
                </TableCell>
              </TableRow>
            ) : (
              // Actual data
              stores.map((store) => (
                <TableRow key={store.grab_store_code}>
                  <TableCell>{store.grab_store_code}</TableCell>
                  <TableCell>{store.parent_store_code}</TableCell>
                  <TableCell>{store.store_code}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge size="sm" variant="outline">
                      {SYNC_PROFIT_STATUS_STORE[store.sync_profit_status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      className={
                        store.sync_grab_status ===
                        SYNC_GRAB_STATUS_STORE_CODE.SUCCESS
                          ? "cursor-pointer hover:bg-white hover:text-black hover:border hover:border-gray-300"
                          : ""
                      }
                      variant={
                        store.sync_grab_status ===
                        SYNC_GRAB_STATUS_STORE_CODE.SUCCESS
                          ? "default"
                          : "outline"
                      }
                      onClick={
                        store.sync_grab_status ===
                        SYNC_GRAB_STATUS_STORE_CODE.SUCCESS
                          ? () => displayJsonGrab(store.grab_store_code)
                          : undefined
                      }
                    >
                      {SYNC_GRAB_STATUS_STORE[store.sync_grab_status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <IconButton
                        onClick={() =>
                          handleResync(store.id, "SYNC_PROFIT_ITEM")
                        }
                        tooltip="ReSync Profit"
                      >
                        <ReplaceAll size={14} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleResync(store.id, "SYNC_GRAB_ITEM")}
                        tooltip="ReSync Grab Menu"
                      >
                        <Repeat size={14} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditId(store.id);
                          setOpenModal(true);
                        }}
                        tooltip="Edit Store"
                      >
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton
                        className="border border-black hover:bg-black hover:text-white"
                        onClick={() => handleDelete(store.id)}
                        tooltip="Delete Store"
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(e) => setCurrentPage(e)}
        />
      </CardContent>

      <StoreModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        id={editId}
        onSuccess={fetchStores}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="z-[100] bg-white sm:max-w-md overflow-y-auto h-screen">
          <SheetHeader className="sticky top-0 bg-white z-[101] pb-4">
            <SheetTitle className="text-2xl font-bold text-black">
              <div className="flex w-full justify-between mt-4 gap-2">
                <div className="w-full">Grab Menu Sync</div>

                <div className="w-full">
                  <Button
                    size={"sm"}
                    onClick={handleCopy}
                    className="flex items-center  text-sm"
                  >
                    <ClipboardCopy size={16} /> Copy
                  </Button>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className=" border border-gray-500 bg-[#F3F4F6] mx-3 mb-3 rounded-lg">
            <div className="relative rounded-md  p-4 overflow-x-auto break-words whitespace-pre-wrap">
              {/* <pre className="text-sm  overflow-x-auto break-words whitespace-pre-wrap">
                <code>{JSON.stringify(dataMenu, null, 2)}</code>
              </pre> */}

              <JsonView
                value={dataMenu}
                displayDataTypes={false}
                enableClipboard={false}
                displayObjectSize={false}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
