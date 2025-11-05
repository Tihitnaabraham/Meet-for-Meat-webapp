"use client";
import { useState, useEffect } from "react";

export function useRegisterDate() {
  const [groupName, setGroupName] = useState("");
  const [slaughterDate, setSlaughterDate] = useState("");
  const [slaughterTime, setSlaughterTime] = useState("");
  const [slaughterMethod, setSlaughterMethod] = useState("self-slaughter");
  const [privacy, setPrivacy] = useState("private");

  const [kirchaType, setKirchaType] = useState<string | null>(null);
  const [selectedLivestockId, setSelectedLivestockId] = useState<number | null>(null);
  const [priceHalf, setPriceHalf] = useState<number | null>(null);
  const [priceFull, setPriceFull] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setKirchaType(localStorage.getItem("selectedKirchaType"));

      const livestock = localStorage.getItem("selectedLivestock");
      if (livestock) {
        try {
          const obj = JSON.parse(livestock);
          if (Array.isArray(obj.ids) && obj.ids.length) {
            setSelectedLivestockId(obj.ids[obj.ids.length - 1]);
          }
          if (Array.isArray(obj.prices) && obj.prices.length) {
            setPriceHalf(Number(obj.prices[obj.prices.length - 1]));
            setPriceFull(Number(obj.prices[obj.prices.length - 1]));
          }
        } catch {
        }
      }
    }
  }, []);

  return {
    groupName,
    setGroupName,
    slaughterDate,
    setSlaughterDate,
    slaughterTime,
    setSlaughterTime,
    slaughterMethod,
    setSlaughterMethod,
    privacy,
    setPrivacy,
    kirchaType,
    selectedLivestockId,
    priceHalf,
    priceFull,
  };
}
