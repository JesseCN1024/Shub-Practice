'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { set } from "react-hook-form";


interface Query {
  type: "1" | "2"; 
  range: [number, number]; // pham vi [l, r]
}

interface ApiResponse {
  token: string;
  data: number[];
  query: Query[];
}

const Task4: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type?: "success" | "warning" | "error";
    content?: string;
  }>({}); 
  const [result, setResult] = useState<number[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // config the api in next.config.mjs already to handle CORS preventing from fetching data from the server
        // test-share.shub.edu.vn -> /api
        await fetch("/api/intern-test/input", {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()).then(dat => {
            setToken(dat?.token);
            setQueries(dat?.query);
            setData(dat?.data);
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  
  const processQueries = (data: number[], queries: Query[]): number[] => {
    const n = data.length;

    // tao mang cong don prefixSum dung de tinh toan tong [l,r] phia sau
    const prefixSum: number[] = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      prefixSum[i] = prefixSum[i - 1] + data[i - 1];
    }

    // tao mang evenoddsum 
    const evenPrefixSum: number[] = new Array(n + 1).fill(0);
    const oddPrefixSum: number[] = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      if (i % 2 === 1) { // le
        evenPrefixSum[i] = evenPrefixSum[i - 1] + data[i - 1]; 
        oddPrefixSum[i] = oddPrefixSum[i - 1]; 
      } else { // chan
        evenPrefixSum[i] = evenPrefixSum[i - 1] ; 
        oddPrefixSum[i] = oddPrefixSum[i - 1] + data[i - 1]; 
      }
    }
    return queries.map((query) => {
      const [l, r] = query.range;

      if (query.type === "1") {
        return prefixSum[r + 1] - prefixSum[l]; // loai 1, tinh truoc mang prefix sum
      } else if (query.type === "2") {
        // tổng phần tử chẵn - tổng phần tử lẻ trong khoảng [l, r]
        return (evenPrefixSum[r + 1] - evenPrefixSum[l]) - (oddPrefixSum[r + 1] - oddPrefixSum[l]);
      }

      return 0; // khong co cau truy van phu hop
    });
  };

  // Ham gui ket qua toi API
  const sendResult = async (results: number[]) => {
    try {
      setLoading(true);
      // Posting result to the server
      const response = await fetch("/api/intern-test/output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
        body: JSON.stringify(results), // Send the results as JSON
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.json());
       setMessage({
         type: "success",
         content: "Success sending results",
       });
    } catch (error) {
      console.error("Error sending results", error);
      setMessage({
        type: "error",
        content: "Error sending results",
      })
    }
    finally{
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setMessage({})
    const results = processQueries(data, queries);
    setResult(results);
    console.log("Results: ", results);
    sendResult(results);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-900">
      <div className=" p-6 relative modal min-w-[768px] max-w-screen-md bg-white rounded-lg shadow-lg">
        <h1 className="my-2 mb-4 text-xl font-bold">
          Task 4: Data Structure & Algorithm
        </h1>
        <button
          disabled={loading}
          className="w-full text-center p-2 mt-5 bg-blue-800 rounded-md text-white hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          Process Queries and Send Results {loading && " ..."}
        </button>
        {message?.content && (
          <p className={`font-bold my-2 ${message.type==="success" ? "text-green-400" : message.type==="error" ?  "text-red-500" : "text-yellow-400"}`}>{message.content}</p>
        )}
        {/* Result board */}
        <div className="flex space-x-2 mt-3">
          <div className="w-1/2 bg-gray-200 text-wrap rounded-md p-2 h-[300px] overflow-scroll">
            <p className="font-bold *: ">Received Data: </p>
            <p className="">
              Arrays: 
              {data.join(" ")}
            </p>
            <p className="">
              Queries: 
              {queries.map((query, index) => {
                return (
                  <span key={index}>
                    {query.type}-[{query.range.join(",")}],{" "}
                  </span>
                );
              })}
            </p>
            <p>Token: ? </p>
          </div>
          <div className="w-1/2 bg-gray-200 rounded-md p-2 h-[300px] overflow-scroll">
            <p className="font-bold">Output</p>
            <p>
              {
                result.map((res, index) => {
                  return (
                    <div key={index}>
                      {index} {res},{" "}
                    </div>
                  );
                })
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task4;
