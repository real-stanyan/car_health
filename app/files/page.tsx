"use client";
import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useGlobalContext } from "@/components/GlobalContextProvider";

const Files: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { currentCar } = useGlobalContext();

  const storage = getStorage();
  const db = getFirestore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("请选择要上传的文件");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      toast.error("请先登录后再上传");
      return;
    }
    if (!currentCar?.id) {
      toast.error("未选择当前车辆，请先选择车辆");
      return;
    }

    // 上传到 Cloud Storage
    const fileRef = ref(
      storage,
      `users_data/${user.uid}/garages/${currentCar.id}/${Date.now()}_${
        file.name
      }`
    );
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(prog));
      },
      (error) => {
        console.error(error);
        toast.error("上传失败，请重试");
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          // 保存到 Firestore 子集合 currentCar.id 下的 files
          const garageDocRef = doc(
            db,
            "users_data",
            user.uid,
            "garages",
            String(currentCar.id)
          );
          const filesColRef = collection(garageDocRef, "files");
          await addDoc(filesColRef, {
            fileName: file.name,
            downloadURL: url,
            createdAt: Date.now(),
          });

          toast.success("CSV 文件上传并保存成功");
          setProgress(0);
          setFile(null);
        } catch (err) {
          console.error(err);
          toast.error("保存文件信息失败");
        }
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">上传 CSV 文件</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      {progress > 0 && (
        <div className="mb-4">
          <Progress value={progress} className="w-full" />
          <p>{progress}%</p>
        </div>
      )}
      <Button
        onClick={handleUpload}
        disabled={!file}
        variant="outline"
        size="lg"
        className="text-lg"
      >
        上传文件
      </Button>
    </div>
  );
};

export default Files;
