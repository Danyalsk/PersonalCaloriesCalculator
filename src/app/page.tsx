"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Scale,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FoodItem = {
  id: number;
  name: string;
  calories: number;
  quantity: number;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  date: Date;
};

const predefinedFoodItems = [
  { name: "Wheat Roti", caloriesPer100g: 297 },
  { name: "Chicken", caloriesPer100g: 239 },
  { name: "Mutton", caloriesPer100g: 294 },
  { name: "Egg", caloriesPer100g: 155 },
  { name: "Rice", caloriesPer100g: 130 },
  // Assuming 100g protein powder contains around 400 calories
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

export default function Home() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("foodItems");
      return saved
        ? JSON.parse(saved, (key, value) =>
            key === "date" ? new Date(value) : value
          )
        : [];
    }
    return [];
  });
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedMealType, setSelectedMealType] =
    useState<(typeof mealTypes)[number]>("Snack");
  const [calorieGoal, setCalorieGoal] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("calorieGoal") || "2000";
    }
    return "2000";
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem("calorieGoal", calorieGoal);
  }, [calorieGoal]);

  const addItem = () => {
    if (selectedFood && quantity) {
      const foodItem = predefinedFoodItems.find(
        (item) => item.name === selectedFood
      );
      if (foodItem) {
        const quantityInGrams = parseFloat(quantity);
        const calories = (foodItem.caloriesPer100g * quantityInGrams) / 100;
        setFoodItems([
          ...foodItems,
          {
            id: Date.now(),
            name: foodItem.name,
            calories: Math.round(calories),
            quantity: quantityInGrams,
            mealType: selectedMealType,
            date: selectedDate,
          },
        ]);
        setSelectedFood("");
        setQuantity("");
      }
    }
  };

  const deleteItem = (id: number) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const filteredFoodItems = foodItems.filter(
    (item) => item.date.toDateString() === selectedDate.toDateString()
  );

  const totalCalories = filteredFoodItems.reduce(
    (sum, item) => sum + item.calories,
    0
  );
  const goalProgress = Math.min(
    (totalCalories / Number(calorieGoal)) * 100,
    100
  );

  return (
    <div className="s">
      <div className="min-h-screen bg-black text-white py-8 px-4 font-sans flex items-center ">
        <Card className="max-w-md mx-auto bg-gray-900 border-gray-700 shadow-lg mb-16">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Scale className="mr-2 h-6 w-6 text-gray-400" />
              Precision Calorie Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="number"
                placeholder="Daily Calorie Goal"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full sm:w-2/3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`
                    w-full sm:w-1/3 bg-gray-800 border-gray-700 text-white hover:bg-gray-700
                    focus:ring-2 focus:ring-gray-400 focus:outline-none
                  `}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-gray-800 border-gray-700"
                  align="start"
                >
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border border-gray-700"
                    classNames={{
                      months: "space-y-4",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium text-gray-300",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-7 w-7 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell:
                        "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-700 rounded-md",
                      day_selected:
                        "bg-white text-gray-900 hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900",
                      day_today: "bg-gray-600 text-white",
                      day_outside: "text-gray-500 opacity-50",
                      day_disabled: "text-gray-500 opacity-50",
                      day_range_middle:
                        "aria-selected:bg-gray-700 aria-selected:text-gray-300",
                      day_hidden: "invisible",
                    }}
                    components={{
                      IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                      IconRight: () => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white ">
                <span>Daily Progress</span>
                <span>
                  {totalCalories} / {calorieGoal} cal
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Select value={selectedFood} onValueChange={setSelectedFood}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-gray-500 focus:border-gray-500">
                  <SelectValue placeholder="Select a food item" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {predefinedFoodItems.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name} ({item.caloriesPer100g} cal/100g)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity (grams)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500"
              />
              <Select
                value={selectedMealType}
                onValueChange={(value) =>
                  setSelectedMealType(value as (typeof mealTypes)[number])
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-gray-500 focus:border-gray-500">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={addItem}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {filteredFoodItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center bg-transparent p-3 rounded-lg border border-gray-700 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col">
                      <span className="text-white">{item.name}</span>
                      <span className="text-xs text-gray-400">
                        {item.mealType} - {item.quantity}g
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-400">
                        {item.calories} cal
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
          <div className="max-w-md mx-auto text-center text-xl font-bold text-white">
            Total Calories: <span className="text-2xl">{totalCalories}</span>{" "}
            cal
          </div>
        </div>
      </div>
    </div>
  );
}
