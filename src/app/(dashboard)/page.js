"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Store, Component } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { countStore } from "@/services/store";
import { countCategory } from "@/services/category";
import { countItem } from "@/services/item";
import { fetchSummaryOrders } from "@/services/order";
import { fetchListJob } from "@/services/job";


const COLORS = [
  "#2563eb", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

const currentYear = new Date().getFullYear();

export default function Home() {
  const [countData, setCountData] = useState({
    category: 0,
    item: 0,
    store: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [listjob, setListJob] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  const getListJob = async () => {
    const result = await fetchListJob();
    setListJob(result);
  };

  function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatDateTime(new Date()));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchSummary = async () => {
    try {
      const [resultCategory, resultItem, resultStore] = await Promise.all([
        countCategory(),
        countItem(),
        countStore(),
      ]);

      setCountData({
        category: resultCategory.data.total_data,
        item: resultItem.data.total_data,
        store: resultStore.data.total_data,
      });
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      // Pass start_date and end_date as query parameters
      const response = await fetchSummaryOrders({
        start_date: startDate,
        end_date: endDate,
      });
      const apiData = response.data;

      // Extract unique store codes
      const storeCodes = [
        ...new Set(
          apiData.flatMap((item) =>
            Object.keys(item).filter((key) => key !== "date")
          )
        ),
      ];

      // Generate chartConfig dynamically
      const newChartConfig = storeCodes.reduce((config, code, index) => {
        config[code] = {
          label: `Store Code : ${code}`,
          color: COLORS[index % COLORS.length],
        };
        return config;
      }, {});

      // Normalize data to include all store codes for each date
      const normalizedData = apiData
        .map((item) => {
          const normalizedItem = { date: item.date };
          storeCodes.forEach((code) => {
            normalizedItem[code] = item[code] || 0; // Fill missing values with 0
          });
          return normalizedItem;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

      setChartConfig(newChartConfig);
      setChartData(normalizedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    getListJob();
  }, []);

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row gap-4 px-3">
          <div className="w-full border flex flex-row bg-black text-white px-4 py-2 rounded-md">
            <div className="w-[40%]">
              <Component size={"70px"} />
            </div>
            <div className="w-[60%] flex flex-col gap-1 px-2">
              <div className="w-full">
                <h2 className="font-bold text-right text-4xl">
                  {countData.category}
                </h2>
              </div>
              <div className="w-full text-right text-xl">TOTAL CATEGORY</div>
            </div>
          </div>
          <div className="w-full border flex flex-row bg-black text-white px-4 py-2 rounded-md">
            <div className="w-[40%]">
              <Store size={"70px"} />
            </div>
            <div className="w-[60%] flex flex-col gap-1 px-2">
              <div className="w-full">
                <h2 className="font-bold text-right text-4xl">
                  {countData.store}
                </h2>
              </div>
              <div className="w-full text-right text-xl">TOTAL STORE</div>
            </div>
          </div>
          <div className="w-full border flex flex-row bg-black text-white px-4 py-2 rounded-md">
            <div className="w-[40%]">
              <Package size={"70px"} />
            </div>
            <div className="w-[60%] flex flex-col gap-1 px-2">
              <div className="w-full">
                <h2 className="font-bold text-right text-4xl">
                  {countData.item}
                </h2>
              </div>
              <div className="w-full text-right text-xl">TOTAL ITEM</div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="mt-5">
        <CardHeader>
        <div className="flex justify-between items-center w-full">
  <h1 className="text-xl font-bold">Job Monitoring</h1>
  <h1 className="text-md text-gray-800 font-bold">{currentTime}</h1>
</div>
          
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">Schedule</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Schedule</TableHead>
                <TableHead className="font-bold">previous Schedule</TableHead>
                <TableHead className="font-bold">Next Schedule</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {listjob.map((job, index) => {
                return (
                  <TableRow key={job.job_name}>
                    <TableCell>{job.job_name}</TableCell>
                    <TableCell>{job.schedule}</TableCell>
                    <TableCell>
                      {job.status ? (
                        <Badge size="sm" variant="default">
                          Actice
                        </Badge>
                      ) : (
                        <Badge size="sm" variant="outline">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.running ? (
                        <Badge size="sm" variant="default">
                          Running
                        </Badge>
                      ) : (
                        <Badge size="sm" variant="outline">
                          Stoped
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{job.previous_run}</TableCell>
                    <TableCell>{job.next_run}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader className="flex flex-col items-center gap-2 space-y-0 border-b py-5 md:flex-row">
          <div className="flex flex-col  gap-4 text-center sm:text-left w-full">
            <CardTitle>Area Chart - Orders</CardTitle>
            <CardDescription>
              Showing total orders from {startDate} to {endDate}
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md-gap-10 w-full">
            <div className="w-full flex flex-row gap-2">
              <label htmlFor="startDate" className="font-bold mt-1 w-full">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="w-full flex flex-row">
              <label htmlFor="endDate" className="mr-2 font-bold mt-1 w-full">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  {Object.keys(chartConfig).map((code) => (
                    <linearGradient
                      key={code}
                      id={`fill${code}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig[code].color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig[code].color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={16}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                {Object.keys(chartConfig).map((code) => (
                  <Area
                    key={code}
                    dataKey={code}
                    type="natural"
                    fill={`url(#fill${code})`}
                    stroke={chartConfig[code].color}
                    stackId="a"
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-4">No data available</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
