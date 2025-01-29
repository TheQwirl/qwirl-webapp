import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QwirlTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>My Qwirl</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <Button variant="outline">View Details</Button>
            <Button>Edit Qwirl</Button>
          </div>
          <p className="mb-4">Total Responses: 42</p>
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-gray-600">
              Your Qwirl will be displayed here once created.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
