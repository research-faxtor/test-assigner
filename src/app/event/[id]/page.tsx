"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { FaMale, FaFemale } from "react-icons/fa";
import React from "react";
import EventBiroFatiya from "@/components/welcome/eventbirofatiya";
import EventBiroDewati from "@/components/welcome/eventbirodewati";
import NormingFTPI2 from "@/components/welcome/normingftpi2";
import UjiCobaFLSI from "@/components/welcome/ujicobaflsi";

const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [formData, setFormData] = useState({
    user_id: "",
    gender: "",
    event_id: resolvedParams.id,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/events/${resolvedParams.id}`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(resolvedParams.id),
        });
        const data = await response.json();
        const tokenUrl = data.message.replace(/['"]+/g, "");
        if (tokenUrl != "valid") {
          throw new Error("Failed to fetch event");
        }
      } catch (error) {
        setError("Failed to load event.");
        router.push("/not_found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, router]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse({ email: formData.user_id });
    if (!result.success) {
      setError("Masukan e-mail dengan format yang sesuai");
      return;
    }

    if (!formData.user_id) {
      setError("Masukkan e-mail Anda");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/tokens/${formData.user_id}?gender=${formData.gender}&event_id=${resolvedParams.id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json();
      const tokenUrl = data.message.replace(/['"]+/g, "");
      console.log(tokenUrl);
      router.push(tokenUrl);
    } catch (error) {
      console.log(error);
      setError("Mohon maaf kamu kehabisan token, coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage((step) => step - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== 2) {
      setCurrentPage((step) => step + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-50">
      <Card
        className={`w-full max-w-[435px] border-8 rounded-3xl border-sky-100 p-6 flex flex-col gap-6 ${
          currentPage === 1 ? "max-w-[95vw]" : "max-w-[435px]"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex flex-col w-full font-semibold text-2xl text-gray-800">
                {/* Tambah Welcome Page untuk setiap event di sini */}
                {currentPage === 1 && resolvedParams.id === "normingftpi2" && (
                  <NormingFTPI2 />
                )}
                {currentPage === 1 && resolvedParams.id === "ujicobaflsi" && (
                  <UjiCobaFLSI />
                )}
                {/* Akhir dari bagian welcome page */}

                {currentPage === 2 && (
                  <div className="flex flex-col">
                    <div className="text-2xl text-gray-800">
                      Masukkan Identitas
                    </div>
                    <div className="flex font-medium text-sm text-gray-500">
                      Sistem akan mengarahkan anda pada halaman tes yang sesuai
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {currentPage === 2 && (
                <div className="flex flex-col">
                  <div className="flex font-medium text-sm py-1 text-gray-600">
                    E-mail
                  </div>
                  <Input
                    name="user_id"
                    placeholder="Contoh@email.co.id"
                    value={formData.user_id}
                    className="text-xs"
                    onChange={handleInputChange}
                    disabled={isLoading}
                  ></Input>
                  <div className="flex font-medium text-sm py-1 text-gray-600">
                    Jenis Kelamin
                  </div>
                  <div className="flex gap-3">
                    <label className="w-full cursor-pointer">
                      <input
                        type="radio"
                        id="gender"
                        name="gender"
                        value="L"
                        checked={formData.gender === "L"}
                        onChange={(e) => handleInputChange(e)}
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <div className="flex w-full justify-center rounded-lg bg-gray-200 p-6 text-gray-800 ring-2 ring-transparent transition-all hover:bg-sky-100 peer-checked:bg-sky-800 peer-checked:text-white">
                        <div className="flex flex-col items-center text-sm gap-1">
                          <FaMale className="text-4xl" />
                          <p>Laki-laki</p>
                        </div>
                      </div>
                    </label>
                    <label className="w-full cursor-pointer">
                      <input
                        type="radio"
                        id="gender"
                        name="gender"
                        value="P"
                        checked={formData.gender === "P"}
                        onChange={(e) => handleInputChange(e)}
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <div className="flex w-full justify-center rounded-lg bg-gray-200 p-6 text-gray-800 ring-2 ring-transparent transition-all hover:bg-sky-100 peer-checked:bg-sky-800 peer-checked:text-white">
                        <div className="flex flex-col items-center text-sm gap-1">
                          <FaFemale className="text-4xl" />
                          <p>Perempuan</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="flex flex-col gap-2 w-full justify-end">
                {currentPage !== 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex w-full">
                        <Button
                          asChild
                          variant="default"
                          disabled={isLoading}
                          type="submit"
                          className="rounded-lg bg-sky-900 hover:bg-sky-950 flex items-center justify-center gap-1.5 w-full h-[50px]"
                        >
                          <div>{isLoading ? "Mohon Tunggu..." : "Kirim"}</div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Kirim Identitas dan Dapatkan Akses Tes
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {currentPage !== 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex w-full">
                        <Button
                          asChild
                          variant="default"
                          disabled={isLoading}
                          onClick={nextPage}
                          className="rounded-lg bg-sky-900 hover:bg-sky-950 flex items-center justify-center gap-1.5 w-full h-[50px]"
                        >
                          <div>Selanjutnya</div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Kirim Identitas dan Dapatkan Akses Uji Coba
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {currentPage !== 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex w-full">
                        <Button
                          asChild
                          variant="default"
                          disabled={isLoading}
                          onClick={prevPage}
                          className="rounded-lg text-sky-900 border border-sky-200 bg-white hover:bg-sky-50 flex items-center justify-center gap-1.5 w-full h-[50px]"
                        >
                          <div>Sebelumnya</div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Kirim Identitas dan Dapatkan Akses Uji Coba
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {error && (
                <div className="flex w-full text-red-600 font-semibold mt-4 justify-center text-center">
                  {error}
                </div>
              )}
            </CardFooter>
          </div>
        </form>
      </Card>
    </div>
  );
}
