import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
         <Button>
            <Link href="/products">show all products</Link>
         </Button>
      </div>
   );
}
