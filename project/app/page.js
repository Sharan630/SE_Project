'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      SE PROJECT
    </div>
  );
}
