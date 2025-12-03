import { APP_VERSION_SHORT } from "@/src/lib/version";
import { Badge, Button } from "@workspace/ui";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Badge
        variant="secondary"
        className="bg-blue-500 text-white dark:bg-blue-600 mb-4"
      >
        {APP_VERSION_SHORT}
      </Badge>
      <Button variant="secondary" size="sm">
        click
      </Button>
    </div>
  );
}
