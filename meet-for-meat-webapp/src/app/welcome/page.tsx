"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const backgrounds = [
  "/derektibs.jpg",
  "/kitifo1.jpg",
  "/wet.jpg",
  "/goredgored.webp",
  "/meat3.jpg",
];

export default function LandingSplash() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (backgrounds.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    router.push("/authentication/signin");
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('${backgrounds[index]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1/1 bg-black opacity-60  pointer-events-none"></div>

      <div className="absolute left-1/2 top-8 transform -translate-x-1/2 z-20 flex flex-col items-center select-none">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}    
          height={100}  
          priority       
        />
        <span className="mt-2 text-red-100 font-extrabold text-2xl md:text-3xl tracking-wider uppercase leading-tight text-center drop-shadow-lg">
         
        </span>
      </div>
      <div
        className="absolute left-1/2"
        style={{ top: "60%", transform: "translateX(-50%)" }}
      >
        <button
          onClick={handleGetStarted}
          className="bg-red-700 text-white  rounded-lg font-bold text-2xl py-5 px-30 z-20 shadow hover:bg-red-800 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
