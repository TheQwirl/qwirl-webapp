export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  isHidden: boolean;
  userAnswer: number;
  position: number;
}
