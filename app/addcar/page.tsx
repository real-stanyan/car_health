"use client";

// import React
import { useState } from "react";
import Image from "next/image";

// import icons
import { Plus, RotateCcw } from "lucide-react";

// import Components
import { useGlobalContext } from "@/components/GlobalContextProvider";

// import shadcn ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// import firebase
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";

const AddCar = () => {
  const { car, setCar } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

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

      {/* year */}
      {brand && (
        <div className="py-4">
          <h1 className="text-center font-bold text-lg">Select Year:</h1>
          <div className="w-full flex justify-center items-center px-8 py-4">
            <Select onValueChange={(value) => setYear(value)}>
              <SelectTrigger className="w-[60%] ">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 26 }, (_, i) => {
                  const year = 2000 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* model */}
      {year && (
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
      )}

      {/* Add This Car */}
      <div
        className={`
            w-full flex justify-center items-center border-t absolute bottom-0 left-0
            p-4 gap-4
        `}
      >
        <Button
          disabled={!brand || !model || !year}
          variant="outline"
          size="lg"
          className="text-lg"
          onClick={async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
              // Firestore 添加
              const docRef = await addDoc(
                collection(db, "users_data", user.uid, "garages"),
                {
                  brand,
                  model,
                  year,
                  createdAt: Date.now(),
                }
              );
              // 本地状态更新
              setCar((prev) => [
                ...prev,
                { brand, model, year, id: docRef.id },
              ]);
              toast.success(
                `${year} ${brand} ${model} have been added to your garage!`
              );
            } catch (error: any) {
              console.error(`adding car error: ${error}`);
              toast.error(
                `Failed to add ${year} ${brand} ${model} to your garage!`
              );
            }
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
            setYear("");
          }}
        >
          <RotateCcw /> Reset
        </Button>
      </div>
    </div>
  );
};

export default AddCar;
