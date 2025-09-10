"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { formatJakartaTime } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";

import { getLogByType, getFilterLogByType } from "@/services/log";

export default function Logs() {
  const [dataSync, setDataSync] = useState([]);
  const [dataApi, setDataApi] = useState([]);
  const [apiCurrentPage, setApiCurrentPage] = useState(1);
  const [apiTotalPages, setApiTotalPages] = useState(0);
  const [syncCurrentPage, setSyncCurrentPage] = useState(1);
  const [syncTotalPages, setSyncTotalPages] = useState(0);
  const [filterListSyncLog, setFilterListSyncLog] = useState([]);
  const [filterListApiLog, setFilterListApiLog] = useState([]);
  const [filterSync, setFilterSync] = useState("");
  const [filterApi, setFilterApi] = useState("");
  const [searchSync, setSearchSync] = useState("");
  const [searchApi, setSearchApi] = useState("");

  const getAllSyncLog = async () => {
    const syncLog = await getLogByType("sync", syncCurrentPage, 10,filterSync,searchSync);
    setDataSync(syncLog.data);
    setSyncTotalPages(syncLog.meta.total_page);
  };

  const getFilterLogs = async () => {
    const filterSyncResponse = await getFilterLogByType("sync");
    const filterApiResponse = await getFilterLogByType("api");
    setFilterListApiLog(filterApiResponse);
    setFilterListSyncLog(filterSyncResponse);
  };

  const getAllApiLog = async () => {
    const apiLog = await getLogByType("api", apiCurrentPage, 10,filterApi,searchApi);
    setDataApi(apiLog.data);
    setApiTotalPages(apiLog.meta.total_page);
  };

  useEffect(() => {
    getAllSyncLog();
  }, [syncCurrentPage,searchSync,filterSync]);

  useEffect(() => {
    getAllApiLog();
  }, [apiCurrentPage,searchApi,filterApi]);

  useEffect(() => {
    getFilterLogs();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-3xl font-bold">Logs Monitoring</h1>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="SYNCLOG" className="w-full">
          <TabsList className="grid w-full grid-cols-2 px-4">
            <TabsTrigger className="cursor-pointer font-bold" value="SYNCLOG">
              Sync Log
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer font-bold" value="APILOG">
              API Log
            </TabsTrigger>
          </TabsList>

          {/* Sync Log Tab */}
          <TabsContent value="SYNCLOG" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-4">
                <CardDescription className="w-[350px] md:w-[1100px]">
                  <div className="w-full overflow-x-auto">
                    <div className="flex flex-col md:flex-row gap-4 w-full p-5 border rounded bg-gray-50">
                      <div className="w-full">
                        <select
                          className="w-full border rounded-md p-2 text-sm bg-white"
                          value={filterSync}
                          onChange={(e) => {
                            setSyncCurrentPage(1);
                            setFilterSync(e.target.value)}}
                        >
                          <option value="">-- Choose --</option>
                          {filterListSyncLog.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="Search by id / name / data"
                          className="w-full border rounded-md p-2 text-sm bg-white"
                          onChange={(e) => {
                            setSyncCurrentPage(1);
                            setSearchSync(e.target.value)}}
                          value={searchSync}
                        />
                      </div>
                    </div>
                    <Table className="w-full table-auto border mt-5 rounded">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold ">ID</TableHead>
                          <TableHead className="font-bold ">Name</TableHead>
                          <TableHead className="font-bold">
                            Identifier
                          </TableHead>
                          <TableHead className="font-bold">Data</TableHead>
                          <TableHead className="font-bold ">
                            Created At
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataSync.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.identifier}</TableCell>
                            <TableCell className="whitespace-pre-wrap break-words">
                              {JSON.stringify(item.data, null, 2)}
                            </TableCell>
                            <TableCell>
                              {formatJakartaTime(item.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Pagination
                      currentPage={syncCurrentPage}
                      totalPages={syncTotalPages}
                      onPageChange={(e) => setSyncCurrentPage(e)}
                    />
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* API Log Tab */}
          <TabsContent value="APILOG" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-4">
                <CardDescription className="w-[350px] md:w-[1100px]">
                  <div className="w-full overflow-x-auto">
                    <div className="flex  flex-col md:flex-row gap-4 w-full p-5 border rounded bg-gray-50">
                      <div className="w-full">
                        <select
                          className="w-full border rounded-md p-2 text-sm bg-white"
                          value={filterApi}
                          onChange={(e) => {
                            setApiCurrentPage(1);
                            setFilterApi(e.target.value)}}
                        >
                          <option value="">-- Choose --</option>
                          {filterListApiLog.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full">
                        <Input
                          placeholder="Search id / name / request / response"
                          className="w-full border rounded-md p-2 text-sm bg-white"
                          onChange={(e) => {
                            setApiCurrentPage(1);
                            setSearchApi(e.target.value)}}
                          value={searchApi}
                        />
                      </div>
                    </div>
                    <Table className="w-full table-auto border mt-5 rounded">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">ID</TableHead>
                          <TableHead className="font-bold">Client</TableHead>
                          <TableHead className="font-bold">Name</TableHead>
                          <TableHead className="font-bold">
                            Identifier
                          </TableHead>
                          <TableHead className="font-bold">Request</TableHead>
                          <TableHead className="font-bold">Response</TableHead>
                          <TableHead className="font-bold">
                            Created At
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataApi.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>
                              {item.response_data ? "TRI" : "GRAB"}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.identifier}</TableCell>
                            <TableCell className="whitespace-pre-wrap break-words">
                              {JSON.stringify(item.request_data, null, 2)}
                            </TableCell>
                            <TableCell className="whitespace-pre-wrap break-words">
                              {JSON.stringify(item.response_data, null, 2)}
                            </TableCell>
                            <TableCell>
                              {formatJakartaTime(item.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Pagination
                      currentPage={apiCurrentPage}
                      totalPages={apiTotalPages}
                      onPageChange={(e) => setApiCurrentPage(e)}
                    />
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
