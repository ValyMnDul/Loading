'use client'

import {useEffect ,useState, useCallback } from 'react' ;

interface Upgrade {
  id:string;
  name:string;
  description:string;
  cost:number;
  speedBoost:number;
  owned:number;
  costMultiplier:number;
  emoji:string;
}

interface RandomEvent {
  message:string;
  speedMultiplier:number;
  duration:number;
}

export default function Main(){

  const [money, setMoney] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [bytesPerSecond, setBytesPerSecond] = useState(1);
  const [totalBytes, setTotalBytes] = useState(0);
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [eventTimeLeft, setEventTimeLeft] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const [upgrades,setUpgrades] = useState<Upgrade[]>([
    {
      id: "blow",
      name: "Blow on Router",
      description: "Classic tech support",
      cost: 10,
      speedBoost: 5,
      owned: 0,
      costMultiplier: 1.15,
      emoji: "💨",
    },
    {
      id: "restart",
      name: "Restart Router",
      description: "Turn it off and on again",
      cost: 50,
      speedBoost: 20,
      owned: 0,
      costMultiplier: 1.2,
      emoji: "🔄",
    },
    {
      id: "move",
      name: "Move Router 2cm Left",
      description: "Science-backed technique",
      cost: 200,
      speedBoost: 50,
      owned: 0,
      costMultiplier: 1.25,
      emoji: "⬅️",
    },
    {
      id: "disconnect",
      name: "Disconnect Other Devices",
      description: "Kick everyone off",
      cost: 1000,
      speedBoost: 100,
      owned: 0,
      costMultiplier: 1.3,
      emoji: "📵",
    },
    {
      id: "call",
      name: "Call ISP Support",
      description: "Wait time: 45 minutes",
      cost: 5000,
      speedBoost: 500,
      owned: 0,
      costMultiplier: 1.35,
      emoji: "☎️",
    },
    {
      id: "threaten",
      name: "Threaten to Switch",
      description: "They'll take you seriously",
      cost: 25000,
      speedBoost: 2000,
      owned: 0,
      costMultiplier: 1.4,
      emoji: "😤",
    },
    {
      id: "karen",
      name: "Scream at Customer Service",
      description: "KAREN MODE ACTIVATED",
      cost: 100000,
      speedBoost: 10000,
      owned: 0,
      costMultiplier: 1.5,
      emoji: "🗣️",
    },
    {
      id: "fiber",
      name: "Upgrade to Fiber",
      description: "Actually good internet",
      cost: 500000,
      speedBoost: 50000,
      owned: 0,
      costMultiplier: 1.6,
      emoji: "🌐",
    },
    {
      id: "isp",
      name: "Become the ISP",
      description: "If you can't beat them...",
      cost: 5000000,
      speedBoost: 500000,
      owned: 0,
      costMultiplier: 2,
      emoji: "🏢",
    },
  ]);
  
  return <></>
}