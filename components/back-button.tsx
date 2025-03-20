"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant={"ghost"}
      className="w-fit fixed top-4 left-4"
      onClick={() => router.back()}>
      <ArrowLeft />
      Back
    </Button>
  );
}
