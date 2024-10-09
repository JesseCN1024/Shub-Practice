"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { Notyf } from "notyf";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";



const mockData = {
  time: "07/10/2024 17:25:02",
  quantity: 3.03,
  column: "",
  revenue: 60000,
  price: 19800,
};
type Inputs= {
    time: string;
    quantity: number;
    column: string;
    revenue: number;
    price: number;
}

const Input = () => {
   const {
     register,
     handleSubmit,
     setValue,
     getValues,
     watch,
     formState: { errors },
   } = useForm<Inputs>();

  function convertDateTime(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0"); // 01
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 06
    const year = date.getFullYear(); // 2024
    const hours = date.getHours(); // 8 (no leading zero)
    const minutes = String(date.getMinutes()).padStart(2, "0"); // 30

    // Combine the parts into desired format
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function isFutureDate(isoString: string): boolean {
    const inputDate = new Date(isoString);
    const currentDate = new Date();

    // Compare the input date with the current date
    return inputDate > currentDate;
  }

  const handleChange = (e: any) => {
    // setFormData({
    //   ...formData,
    //   [e.target.name]: e.target.name==="time" ? convertDateTime(e.target.value) : e.target.value,
    // });
    setValue("time", convertDateTime(e.target.value));
  };
  

  
  const onsubmit:SubmitHandler<Inputs> = (data: any) => {
    // Notify of succeeding inputing the transaction
    var notyf = new Notyf();
    // Display an error notification
    notyf.success("Nhập giao dịch thành công!");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-900">
      <div className="relative modal min-w-[500px] max-w-screen-lg bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="shadow-md px-6 py-4">
          <Link
            href="/"
            className="top-2 left-2 flex space-x-2 items-center px-2 py-1 rounded-md hover:opacity-70 font-medium"
          >
            <FaArrowLeft /> <span>Đóng</span>
          </Link>
          <h1 className="text-3xl font-bold pb-2">Nhập giao dịch</h1>
        </div>

        <form className="space-y-4 p-6" onSubmit={handleSubmit(onsubmit)}>
          {/* Update button */}
          <input
            type="submit"
            value="Cập nhật"
            name="Cập nhật"
            className="bg-blue-600 py-2 px-4 rounded-2xl text-white absolute top-2 right-2"
          />
          {/* Thoi gian */}
          <div className="relative space-y-2">
            <label
              htmlFor="time"
              className="absolute top-1 left-2 block text-sm font-medium text-gray-500"
            >
              Thời gian
            </label>
            <input
              type="text"
              id="time"
              //   name="time2"
              placeholder="DD/MM/YYYY HH:MM:SS"
              value={getValues("time")}
              disabled
              className="block pt-6 pb-1 px-2 w-full rounded-md border border-gray-300 focus:border-0 focus:ring-indigo-500 sm:text-sm disabled:bg-white"
              {...register("time", {
                required: "Không được bỏ trống trường này.",
                validate: value => !isFutureDate(value) || "Không thể nhập ngày sau ngày hiện tại."
              })}
            />
            <input
              type="datetime-local"
              id="time2"
              name="time2"
              //   value={""}
              onChange={handleChange}
              className="w-5 h-6 text-white border-0 absolute top-1/2 transform -translate-y-1/2 right-2"
            />
          </div>
        <p className="text-red-500">{errors?.time?.message}</p>
          {/* Quantity */}
          <div className="relative space-y-2">
            <label
              htmlFor="quantity"
              className="absolute top-1 left-2 block text-sm font-medium text-gray-500"
            >
              Số lượng
            </label>
            <input
              type="number"
              id="quantity"
              //   name="quantity"
              //   value={formData.quantity}
              //   onChange={handleChange}
              step="0.01"
              placeholder="Nhập số lượng..."
              className="block pt-6 pb-1 px-2 w-full rounded-md border border-gray-300 focus:border-0 focus:ring-indigo-500 sm:text-sm"
              {...register("quantity", {
                required: "Không được bỏ trống trường này.",
                min: { value: 0, message: "Số lượng phải lớn hơn 0." },
                validate: value => Number.isInteger(+value) || "Số lượng phải là số nguyên."
              })}
            />
            <p className="text-red-500">{errors?.quantity?.message}</p>
          </div>

          {/* Dropdown (Trụ) */}
          <div className="relative space-y-2">
            <label className="absolute top-1 left-2 block text-sm font-medium text-gray-500">
              Trụ
            </label>
            <select
              //   name="column"
              //   value={formData.column}
              //   onChange={handleChange}
              className="block pt-6 pb-1 px-2 w-full rounded-md border border-gray-300 focus:border-0 focus:ring-indigo-500 sm:text-sm"
              {...register("column", {
                required: "Không được bỏ trống trường này.",
              })}
            >
              <option value=""></option>
              <option value="column1">Column 1</option>
              <option value="column2">Column 2</option>
            </select>
            <p className="text-red-500">{errors?.column?.message}</p>
          </div>

          {/* Revenue Input */}
          <div className="relative space-y-2">
            <label className="absolute top-1 left-2 block text-sm font-medium text-gray-500">
              Doanh thu
            </label>
            <input
              type="number"
              //   name="revenue"
              //   value={formData.revenue}
              //   onChange={handleChange}
              placeholder="Nhập doanh thu..."
              className="block pt-6 pb-1 px-2 w-full rounded-md border border-gray-300 focus:border-0 focus:ring-indigo-500 sm:text-sm"
              {...register("revenue", {
                required: "Không được bỏ trống trường này.",
                min: { value: 0, message: "Doanh thu phải lớn hơn 0." },
              })}
            />
            <p className="text-red-500">{errors?.revenue?.message}</p>
          </div>

          {/* Price Input */}
          <div className="relative space-y-2">
            <label className="absolute top-1 left-2 block text-sm font-medium text-gray-500">
              Đơn giá
            </label>
            <input
              type="number"
              //   name="price"
              //   value={formData.price}
              //   onChange={handleChange}
              placeholder="Nhập đơn giá..."
              className="block pt-6 pb-1 px-2 w-full rounded-md border border-gray-300 focus:border-0 focus:ring-indigo-500 sm:text-sm"
              {...register("price", {
                required: "Không được bỏ trống trường này.",
                min: { value: 0, message: "Đơn giá phải lớn hơn 0." },
              })}
            />
            <p className="text-red-500">{errors?.price?.message}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;
