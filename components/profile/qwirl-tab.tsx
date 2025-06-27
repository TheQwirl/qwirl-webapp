import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { components } from "@/lib/api/v1";

interface QwirlTabProps {
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}

export default function QwirlTab({ user }: QwirlTabProps) {
  console.log("QwirlTab user:", user);
  return (
    <div>
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
    </div>
  );
}
