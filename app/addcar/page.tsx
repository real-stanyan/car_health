"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, RotateCcw } from "lucide-react";
import { useGlobalContext } from "@/components/GlobalContextProvider";

import { Button } from "@/components/ui/button";

const AddCar = () => {
  const { car, setCar } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  return (
    <div className="w-full min-h-full flex flex-col relative">
      <h1 className="text-center w-full text-3xl font-bold">Add a Car</h1>

      {/* brand */}
      <div className="py-4">
        <h1 className="text-center font-bold text-lg">Select Car Brand:</h1>
        <div className="grid grid-cols-4 px-8 py-4 gap-4">
          {/* bmw */}
          <div
            onClick={() => setBrand("BMW")}
            className={`
                border border-foreground flex flex-col justify-center items-center
                rounded-md text-3xl font-bold p-4
                ${
                  brand === "BMW"
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground hover:bg-foreground/50 hover:text-background/50 duration-200 transition-colors ease-in-out"
                }
            `}
          >
            <Image
              src="/images/brand/bmw.webp"
              width={200}
              height={200}
              alt=""
            />
            <h1>BMW</h1>
          </div>
        </div>
      </div>

      {/* model */}
      <div className="py-4">
        <h1 className="text-center font-bold text-lg">Select Car Model:</h1>
        <div className="grid grid-cols-4 px-8 py-4 gap-4">
          {/* 320i */}
          <div
            onClick={() => setModel("320i")}
            className={`
                border border-foreground flex flex-col justify-center items-center
                rounded-md text-3xl font-bold p-4
                ${
                  model === "320i"
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground hover:bg-foreground/50 hover:text-background/50 duration-200 transition-colors ease-in-out"
                }
            `}
          >
            <h1>320i</h1>
          </div>
          {/* 330i */}
          <div
            onClick={() => setModel("330i")}
            className={`
                border border-foreground flex flex-col justify-center items-center
                rounded-md  text-3xl font-bold p-4
                ${
                  model === "330i"
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground hover:bg-foreground/50 hover:text-background/50 duration-200 transition-colors ease-in-out"
                }
            `}
          >
            <h1>330i</h1>
          </div>
        </div>
      </div>

      {/* Add This Car */}
      <div
        className={`
            w-full flex justify-center items-center border-t absolute bottom-0 left-0
            p-4 gap-4
        `}
      >
        <Button
          variant="outline"
          size="lg"
          className="text-lg"
          onClick={() => {
            setCar((prev) => [...prev, { brand, model }]);
          }}
        >
          <Plus /> Add This Car
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-lg"
          onClick={() => {
            setBrand("");
            setModel("");
          }}
        >
          <RotateCcw /> Reset
        </Button>
      </div>
    </div>
  );
};

export default AddCar;
