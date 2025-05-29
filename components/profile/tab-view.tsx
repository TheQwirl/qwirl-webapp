import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabView({ activeTab, setActiveTab }: TabViewProps) {
  return (
    <div className="mb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="myQwirl">My Qwirl</TabsTrigger>
          <TabsTrigger value="myPeople">My People</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
