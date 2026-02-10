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
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    event_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

    if (!formData.event_id) {
      setError("Please fill event ID");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${formData.event_id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      router.push(`/event/${formData.event_id}`);
    } catch (error) {
      console.log(error);
      setError("Kode tidak valid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-50">
      <Card className="w-full max-w-[435px] border-8 rounded-3xl bg-white border-sky-100 p-6 flex flex-col gap-6">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex flex-col w-full font-semibold text-2xl">
              <div className="text-2xl text-gray-800">
                Masukkan Kode Akses Event
              </div>
              <div className="flex font-medium text-sm text-gray-500">
                Sistem akan mengarahkan anda pada halaman tes yang sesuai
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex font-medium text-sm py-1">
              Kode Akses Event
            </div>
            <Input
              name="event_id"
              placeholder="Masukkan Kode Tes Anda"
              value={formData.event_id}
              className="flex text-sm shadow-none"
              onChange={handleInputChange}
              disabled={isLoading}
            ></Input>
          </CardContent>
          <CardFooter className="flex w-full flex-col">
            <div className="flex w-full justify-end">
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
                      <div>{isLoading ? "Mohon Tunggu..." : "Selanjutnya"}</div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Kirim Kode Event</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {error && (
              <div className="flex w-full text-red-600 font-semibold mt-4 justify-center text-center">
                {error}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
