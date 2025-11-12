"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Food and Beverages",
    icon: "🍕",
    description: "Culinary preferences and dining experiences",
  },
  {
    name: "Future and Imagination",
    icon: "🚀",
    description: "Dreams, aspirations, and what-if scenarios",
  },
  {
    name: "Nature and Environment",
    icon: "🌿",
    description: "Outdoor activities and environmental views",
  },
  {
    name: "Personal Preferences",
    icon: "⭐",
    description: "Individual tastes and lifestyle choices",
  },
  {
    name: "Philosophy and Soul",
    icon: "🤔",
    description: "Deep thoughts and spiritual beliefs",
  },
  {
    name: "Pop Culture and Entertainment",
    icon: "🎬",
    description: "Movies, music, and entertainment preferences",
  },
  {
    name: "Relationships and Social Life",
    icon: "💕",
    description: "Connections, friendships, and social dynamics",
  },
  {
    name: "Sports and Games",
    icon: "⚽",
    description: "Athletic activities and competitive interests",
  },
  {
    name: "Technology and Trends",
    icon: "📱",
    description: "Tech preferences and modern trends",
  },
  {
    name: "Travel and Exploration",
    icon: "✈️",
    description: "Adventures and places to discover",
  },
];

interface CategorySelectionStepProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategorySelectionStep({
  selectedCategories,
  onCategoriesChange,
}: CategorySelectionStepProps) {
  const handleCategoryToggle = (categoryName: string) => {
    const isSelected = selectedCategories.includes(categoryName);

    if (isSelected) {
      // Remove category
      onCategoriesChange(
        selectedCategories.filter((cat) => cat !== categoryName)
      );
    } else {
      // Add category if under limit
      if (selectedCategories.length < 5) {
        onCategoriesChange([...selectedCategories, categoryName]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection Counter */}
      <div className="flex items-center justify-center gap-2">
        <Badge
          variant={selectedCategories.length > 0 ? "default" : "secondary"}
        >
          {selectedCategories.length} / 5 selected
        </Badge>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.name);
          const isDisabled = !isSelected && selectedCategories.length >= 5;

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md h-full",
                  isSelected && "ring-2 ring-primary bg-primary/5",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() =>
                  !isDisabled && handleCategoryToggle(category.name)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm leading-tight">
                          {category.name}
                        </h4>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex-shrink-0"
                          >
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          <h4 className="font-medium text-sm">Your selected interests:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryName) => {
              const category = categories.find(
                (cat) => cat.name === categoryName
              );
              return (
                <Badge
                  key={categoryName}
                  variant="default"
                  className="flex items-center gap-1"
                >
                  <span>{category?.icon}</span>
                  <span className="text-xs">{categoryName}</span>
                </Badge>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
