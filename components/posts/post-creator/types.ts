import { LucideIcon } from "lucide-react";

export interface PollOption {
  id: number;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  tags: string[];
  category: string;
}

export interface PollTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  options: PollOption[];
}
