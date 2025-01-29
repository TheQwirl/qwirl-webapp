import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabView({ activeTab, setActiveTab }: TabViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="myQwirl">My Qwirl</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="myPeople">My People</TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
