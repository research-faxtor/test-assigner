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

export default function Home({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    event_id: params.id,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      setError("Invalid token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="">
        <form onSubmit={handleSubmit}>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex w-full font-bold text-sm">
              Enter Event Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex font-medium text-sm py-1">Event Code</div>
            <Input
              name="event_id"
              placeholder="Type your ID here"
              value={formData.event_id}
              className="text-xs"
              onChange={handleInputChange}
            ></Input>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex w-full justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      asChild
                      variant="default"
                      disabled={isLoading}
                      type="submit"
                    >
                      <div>{isLoading ? "Waiting..." : "Submit"}</div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Submit Event Code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {error && (
              <div className="flex w-full justify-end text-red-500 mt-4">
                {error}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
