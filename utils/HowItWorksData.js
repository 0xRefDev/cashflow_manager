import { Wallet } from "@/icons/Wallet";
import { Reports } from "@/icons/Reports";
import { Stats } from "@/icons/Stats";
import { Goal } from "@/icons/Goal";

export const gridCards = [
  {
    icon: <Stats />,
    title: "Real-time Tracking",
    description: "Every transaction synced across all accounts instantly. No more manual entry, no more guesswork.",
    color: "#3FFF8B",
    className: "lg:col-span-2"
  },
  {
    icon: <Wallet />,
    title: "Smart Budgeting",
    description: "Create and manage budgets with ease, and get alerts when you&apos;re close to your limits.",
    color: "#81ECFF",
    className: "lg:col-span-1"
  },
  {
    icon: <Reports />,
    title: "Visual Reports",
    description: "Editorial-grade data visualizations that tell the story of your wealth journey.",
    color: "#6E9BFF",
    className: "lg:col-span-1"
  },
  {
    icon: <Goal />,
    title: "Goal Planning",
    description: "Define your financial milestones and let our AI map the clearest path to achieve them.",
    color: "#60B7DE",
    className: "lg:col-span-2"
  },
]