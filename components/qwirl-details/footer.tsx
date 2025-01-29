import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, UserPlus, BarChart2 } from "lucide-react";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="mt-8 flex flex-wrap justify-center gap-4"
    >
      <Button className="bg-blue-500 hover:bg-blue-600">
        <Share2 className="mr-2 h-4 w-4" /> Share Your Qwirl Stats
      </Button>
      <Button className="bg-green-500 hover:bg-green-600">
        <UserPlus className="mr-2 h-4 w-4" /> Invite Friends to Answer
      </Button>
      <Button className="bg-purple-500 hover:bg-purple-600">
        <BarChart2 className="mr-2 h-4 w-4" /> Analyze Similar Qwirls
      </Button>
    </motion.div>
  );
}
