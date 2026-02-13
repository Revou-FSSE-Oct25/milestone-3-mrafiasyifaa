import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import Link from "next/link";

const NoAccess = ({ details }: { details?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-lightColor p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="flex justify-center">
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center font-medium">
            {details
              ? details
              : "You do not have permission to access this page. Please log in with an authorized account or return to the home page."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Link href="/" className="w-full">
            <Button 
              variant="default" 
              className="w-full bg-revoshop-accent hover:bg-revoshop-accent-hover font-semibold" 
              size="lg"
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-revoshop-accent text-revoshop-accent hover:bg-revoshop-accent hover:text-white" 
              size="lg"
            >
              Login with Different Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;