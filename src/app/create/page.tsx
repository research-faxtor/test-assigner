"use client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";

export default function Home() {
  //   const [formData, setFormData] = useState([
  //     {
  //       token: "",
  //       id: 1,
  //     },
  //   ]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [error, setError] = useState<string | null>(null);

  //   const handleAdd = () => {
  //     const _formData = [...formData];
  //     _formData.push({
  //       token: "",
  //       id: formData.length + 1,
  //     });
  //     setFormData(_formData);
  //   };

  //   const handlePaste = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const splittedPasted = e.clipboardData
  //       .getData("text/plain")
  //       .replace(/\r?\n$/, "")
  //       .split(/\r?\n/);
  //     const _formData = splittedPasted.map((data, index) => ({
  //       token: data,
  //       id: index + 1,
  //     }));
  //     console.log(JSON.stringify(_formData));
  //     setFormData(_formData);
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //   };

  //   const handleInputChange = () => {};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* <form onSubmit={handleSubmit}>
        <Card className="">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex w-full font-bold text-sm">
              Create Token For Tepok Nyamuk
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {formData.map((data) => (
              <Input
                name="token"
                key={data.id}
                value={data.token}
                onPaste={handlePaste}
              ></Input>
            ))}
          </CardContent>
        </Card>
      </form> */}
    </div>
  );
}
