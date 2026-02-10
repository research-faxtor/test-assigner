"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = async () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="flex w-full font-bold text-sm">
            OOPS! Event Not Found.
          </CardTitle>
        </CardHeader>
        <CardContent>
          You must entered the wrong event code. Try entering correct event id.
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex w-full justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="default" onClick={handleClick}>
                    Enter New Event Code
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to Home</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
