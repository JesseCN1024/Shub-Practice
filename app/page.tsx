'use client'
import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

interface TransactionRow {
  date: string;
  time: string;
  station: string;
  pump: string;
  product: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  paymentStatus: string;
  customerId: string;
  customerName: string;
  customerType: string;
  paymentDate: string;
  employee: string;
  licensePlate: string;
  invoiceStatus: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file || !startTime || !endTime) {
      alert("Please upload a file and enter a valid time range.");
      return;
    }
    if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return
    }
    const reader = new FileReader(); 
    reader.onload = (e) => {
      const data = e.target?.result;
      // if (typeof data === "string" || !data) return;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json<TransactionRow>(workbook.Sheets[sheetName], {
        header: 1,
      });

      calculateTotalAmount(worksheet);
    };

    reader.readAsBinaryString(file);
  };

  const calculateTotalAmount = (worksheet: any[]) => {
    let total = 0;
    console.log(startTime, endTime);
    worksheet.forEach((row) => {
      const [stt ,date, time, , , , , ,amount] = row;
      console.log(time, time > startTime, time < endTime);
      // console.log(time, amount);
      // Kiểm tra xem thời gian có nằs trong khoảng yêu cầu không
      if (time && amount && time >= startTime && time <= endTime) {
        // const formattedAmount = parseFloat(amount.replace(/,/g, ""));
        const formattedAmount = parseFloat(amount);
        total += formattedAmount;
      }
    });

    setTotalAmount(total);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-900">
      <div className="relative modal max-w-screen-lg bg-white p-12 rounded-lg shadow-lg">
          {/* Button chuyen huong */}
        <Link href="/input" className="absolute top-2 right-2 text-blue-600 px-2 py-1 rounded-md hover:opacity-70 underline"> {"Nhập giao dịch"}</Link>
        <h1 className="text-center font-bold my-2 mb-4 text-3xl">DATA REPORT </h1>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label>Upload file data:</label>
            <input className="p-2 ms-2 border-blue-200 border" type="file" accept=".xlsx" onChange={handleFileChange} />
          </div>
          <div className="my-2">
            <label>Thời gian bắt đầu (HH:MM:SS):</label>
            <input
              className="p-2 ms-2 bg-blue-100 shadow-md rounded-md "
              type="time"
              value={startTime}
              onChange={(e) => {
                setTotalAmount(0);
                setStartTime(e.target.value);
              }}
              required
            />
          </div>
          <div className="my-2">
            <label>Thời gian kết thúc (HH:MM:SS):</label>
            <input
              className="p-2 ms-2 bg-blue-100 shadow-md rounded-md "
              type="time"
              value={endTime}
              onChange={(e) => {
                setTotalAmount(0);
                setEndTime(e.target.value);
              }}
              required
            />
          </div>
          <button disabled={!file || !startTime || !endTime} className="w-full text-center p-2 mt-5 bg-blue-800 rounded-md text-white hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">Tính toán</button>
        </form>

        {!!totalAmount && (
          <div>
            <h2 className="font-medium mt-3">
              Tổng thành tiền trong khoảng thời gian từ {startTime} đến {endTime} là: <span className="font-bold">{totalAmount.toLocaleString()}</span> VND
            </h2>
          </div>
        )}
      </div>
      
    </div>
  );
}
