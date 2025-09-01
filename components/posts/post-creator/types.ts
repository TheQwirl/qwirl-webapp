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
