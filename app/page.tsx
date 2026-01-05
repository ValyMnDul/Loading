"use client";
import { useEffect, useState, useMemo, useRef, startTransition } from "react";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  speedBoost: number;
  owned: number;
  costMultiplier: number;
  icon: string;
}

interface RandomEvent {
  message: string;
  speedMultiplier: number;
  duration: number;
}

const initialUpgrades: Upgrade[] = [
  {
    id: "blow",
    name: "Blow on Router",
    description: "Classic tech support",
    cost: 5,
    speedBoost: 50,
    owned: 0,
    costMultiplier: 1.15,
    icon: "💨",
  },
  {
    id: "restart",
    name: "Restart Router",
    description: "Turn it off and on again",
    cost: 25,
    speedBoost: 200,
    owned: 0,
    costMultiplier: 1.2,
    icon: "🔄",
  },
  {
    id: "move",
    name: "Move Router 2cm Left",
    description: "Science-backed technique",
    cost: 100,
    speedBoost: 1000,
    owned: 0,
    costMultiplier: 1.25,
    icon: "⬅️",
  },
  {
    id: "disconnect",
    name: "Disconnect Other Devices",
    description: "Kick everyone off",
    cost: 500,
    speedBoost: 5000,
    owned: 0,
    costMultiplier: 1.3,
    icon: "📵",
  },
  {
    id: "call",
    name: "Call ISP Support",
    description: "Wait time: 45 minutes",
    cost: 2500,
    speedBoost: 25000,
    owned: 0,
    costMultiplier: 1.35,
    icon: "☎️",
  },
  {
    id: "threaten",
    name: "Threaten to Switch",
    description: "They'll take you seriously",
    cost: 12500,
    speedBoost: 125000,
    owned: 0,
    costMultiplier: 1.4,
    icon: "😤",
  },
  {
    id: "karen",
    name: "Scream at Customer Service",
    description: "KAREN MODE ACTIVATED",
    cost: 50000,
    speedBoost: 500000,
    owned: 0,
    costMultiplier: 1.5,
    icon: "🗣️",
  },
  {
    id: "fiber",
    name: "Upgrade to Fiber",
    description: "Actually good internet",
    cost: 250000,
    speedBoost: 2500000,
    owned: 0,
    costMultiplier: 1.6,
    icon: "🌐",
  },
  {
    id: "isp",
    name: "Become the ISP",
    description: "If you can't beat them...",
    cost: 1000000,
    speedBoost: 10000000,
    owned: 0,
    costMultiplier: 2,
    icon: "🏢",
  },
];

const loadSavedData = () => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("internetSpeedGame");
  return saved ? JSON.parse(saved) : null;
};

const TARGET_BYTES = 100 * 1024 * 1024 * 1024;

export default function Loading() {
  const lastClickTime = useRef(0);

  const CLICK_COOLDOWN = 100;

  const [isMounted, setIsMounted] = useState(false);

  const hasLoadedData = useRef(false);

  const [money, setMoney] = useState(0);

  const [clickValue, setClickValue] = useState(1);

  const [bytesPerSecond, setBytesPerSecond] = useState(100);

  const [totalBytes, setTotalBytes] = useState(0);

  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);

  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);

  const [eventTimeLeft, setEventTimeLeft] = useState(0);

  const [isGameWon, setIsGameWon] = useState(false);

  const randomEvents: RandomEvent[] = useMemo(
    () => [
      {
        message: "It's raining - Connection unstable",
        speedMultiplier: 0.5,
        duration: 10,
      },
      {
        message: "Neighbor streaming 4K - Bandwidth reduced",
        speedMultiplier: 0.3,
        duration: 15,
      },
      {
        message: "3 AM - Network congestion minimal",
        speedMultiplier: 3,
        duration: 20,
      },
      {
        message: "Perfect conditions - Speed boost",
        speedMultiplier: 2,
        duration: 12,
      },
      {
        message: "Heavy download detected - Throttling active",
        speedMultiplier: 0.1,
        duration: 8,
      },
    ],
    []
  );

  useEffect(() => {
    if (hasLoadedData.current) return;
    hasLoadedData.current = true;
    const data = loadSavedData();
    startTransition(() => {
      if (data) {
        setMoney(data.money || 0);
        setClickValue(data.clickValue || 1);
        setBytesPerSecond(data.bytesPerSecond || 100);
        setTotalBytes(data.totalBytes || 0);
        setUpgrades(data.upgrades || initialUpgrades);
      }
      setIsMounted(true);
    });
  }, []);
  useEffect(() => {
    if (!isMounted) return;
    const saveData = {
      money,
      clickValue,
      bytesPerSecond,
      totalBytes,
      upgrades,
    };
    localStorage.setItem("internetSpeedGame", JSON.stringify(saveData));
  }, [money, clickValue, bytesPerSecond, totalBytes, upgrades, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      const effectiveSpeed = activeEvent
        ? bytesPerSecond * activeEvent.speedMultiplier
        : bytesPerSecond;
      setTotalBytes((prev: number) => {
        const newTotal = prev + effectiveSpeed;
        if (newTotal >= TARGET_BYTES && !isGameWon) {
          setIsGameWon(true);
        }
        return newTotal;
      });
      setMoney((prev: number) => prev + effectiveSpeed / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [bytesPerSecond, activeEvent, isGameWon, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.1 && !activeEvent) {
        const event =
          randomEvents[Math.floor(Math.random() * randomEvents.length)];
        setActiveEvent(event);
        setEventTimeLeft(event.duration);
      }
    }, 5000);

    return () => clearInterval(eventInterval);
  }, [activeEvent, randomEvents, isMounted]);

  useEffect(() => {
    if (!activeEvent || eventTimeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setEventTimeLeft((prev: number) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setActiveEvent(null);
        }
        return newTime;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [eventTimeLeft, activeEvent]);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_COOLDOWN) {
      return;
    }
    lastClickTime.current = now;

    setMoney((prev: number) => prev + clickValue);
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (money >= upgrade.cost) {
      setMoney((prev: number) => prev - upgrade.cost);
      setBytesPerSecond((prev: number) => prev + upgrade.speedBoost);

      setUpgrades((prev: Upgrade[]) =>
        prev.map((u) =>
          u.id === upgrade.id
            ? {
                ...u,
                owned: u.owned + 1,
                cost: Math.floor(u.cost * u.costMultiplier),
              }
            : u
        )
      );
      setClickValue(
        (prev: number) => prev + Math.floor(upgrade.speedBoost / 100)
      );
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  const formatSpeed = (bytesPerSec: number): string => {
    if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`;
    if (bytesPerSec < 1024 ** 2)
      return `${(bytesPerSec / 1024).toFixed(2)} KB/s`;
    if (bytesPerSec < 1024 ** 3)
      return `${(bytesPerSec / 1024 ** 2).toFixed(2)} MB/s`;
    return `${(bytesPerSec / 1024 ** 3).toFixed(2)} GB/s`;
  };

  const formatMoney = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  const resetGame = () => {
    if (confirm("Reset game? All progress will be lost!")) {
      localStorage.removeItem("internetSpeedGame");
      setMoney(0);
      setClickValue(1);
      setBytesPerSecond(100);
      setTotalBytes(0);
      setUpgrades(initialUpgrades);
      setIsGameWon(false);
      setActiveEvent(null);
      setEventTimeLeft(0);
    }
  };

  const progressPrcent = Math.min((totalBytes / TARGET_BYTES) * 100, 100);
  const effectiveSpeed = activeEvent
    ? bytesPerSecond * activeEvent.speedMultiplier
    : bytesPerSecond;

  const timeRemaining = (TARGET_BYTES - totalBytes) / effectiveSpeed;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto pt-5">
        <div className="mb-10 mt-4">
          <h1 className="text-4xl font-bold text-white mb-2">Loading</h1>
          <p className="text-gray-400 text-lg">
            Download 100 GB as fast as you can
          </p>
        </div>
      </div>
    </div>
  );
}
