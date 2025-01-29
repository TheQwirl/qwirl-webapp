import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface CategoryListProps {
  categories: string[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className=" flex flex-wrap  gap-2 mt-4"
    >
      {categories.map((category, index) => (
        <Badge key={index} variant="secondary">
          {category}
        </Badge>
      ))}
    </motion.div>
  );
}
