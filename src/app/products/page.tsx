import GetProducts from "@/api/getProducts";
import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import Products from "./products";

export default async function ProductsPage() {
   const queryClient = new QueryClient();

   await queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: GetProducts,
   });

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <Products />
      </HydrationBoundary>
   );
}
