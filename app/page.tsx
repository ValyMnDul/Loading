//loadingbar game
"use client";
import { useEffect, useState, useMemo, useRef, startTransition } from "react";

//interfaces
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

//main component
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

  //useEffects
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

    //functions
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

  //click money buton
  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_COOLDOWN) {
      return;
    }
    lastClickTime.current = now;

    setMoney((prev: number) => prev + clickValue);
  };

  //buy an upgrade button
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

  //formats

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

  //RESEt game button
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

  //loading bar procentage
  const progressPrcent = Math.min((totalBytes / TARGET_BYTES) * 100, 100);
  const effectiveSpeed = activeEvent
    ? bytesPerSecond * activeEvent.speedMultiplier
    : bytesPerSecond;

  const timeRemaining = (TARGET_BYTES - totalBytes) / effectiveSpeed;

  //the HTML part
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto pt-5">
        <div className="mb-10 mt-4">
          <h1 className="text-4xl font-bold text-white mb-2">Loading</h1>
          <p className="text-gray-400 text-lg">
            Download 100 GB as fast as you can
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
              Balance
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {formatMoney(money)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
              Download Speed
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {formatSpeed(effectiveSpeed)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">
              Click Value
            </div>
            <div className="text-3xl font-bold text-amber-400">
              {formatMoney(clickValue)}
            </div>
          </div>
        </div>

        {activeEvent && (
          <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 mb-8">
            <div className="lex justify-between items-center">
              <span className="text-orange-200 font-medium">
                {activeEvent.message}
              </span>
              <span className="text-orange-300 text-sm font-mono">
                {eventTimeLeft}s remaining (×{activeEvent.speedMultiplier})
              </span>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-gray-700">
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-gray-400 text-sm uppercase tracking-wider">
                Progress
              </span>
              <span className="text-2xl font-bold text-white">
                {progressPrcent.toFixed(2)}%
              </span>
            </div>
            <div className="text-gray-300 text-lg font-semibold mb-2">
              {formatBytes(totalBytes)} / 100 GB
            </div>
            {progressPrcent < 100 && (
              <div className="text-cyan-400 text-base font-medium">
                ETA: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          <div className="relative w-full bg-gray-900 rounded-full h-10 overflow-hidden border border-gray-700">
            <div
              className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
              style={{ width: `${progressPrcent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-white mix-blend-difference">
                {formatSpeed(effectiveSpeed)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
            <button
            className="w-full md:w-auto bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-16 py-5 rounded-lg text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all active:scale-[0.98] select-none border border-blue-500"
            onClick={handleClick}
            >
              Earn {formatMoney(clickValue)}
            </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upgrades.map((upgrade)=>{
                const canAfford = money >= upgrade.cost;
                return (
                  <button
                  key={upgrade.id}
                  onClick={()=> buyUpgrade(upgrade)}
                  disabled = {!canAfford}
                  className={`p-5 rounded-lg border-2 transition-all text-left ${
                    canAfford
                      ? "bg-gray-700 border-emerald-600 hover:bg-gray-600 hover:border-emerald-500 cursor-pointer"
                      : "bg-gray-900 border-gray-700 opacity-40 cursor-not-allowed"
                  }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{upgrade.icon}</span>
                        <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-gray-400">
                          ×{upgrade.owned}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold mb-2 text-white">
                      {upgrade.name}
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      {upgrade.description}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-emerald-400 font-mono">
                        +{formatSpeed(upgrade.speedBoost)}
                      </div>
                      <div className="text-amber-400 font-bold">
                        {formatMoney(upgrade.cost)}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
        </div>

      </div>
    </div>
  );
}
