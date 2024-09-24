"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IProduct } from "@/types/Product";
import { getProducts } from "@/api";
import ProductItem from "./productItem";

export default function Products() {
   const { data, isError, isLoading, error } = useQuery({
      queryKey: ["products"],
      queryFn: () => getProducts(),
   });

   if (isLoading)
      return (
         <div className="flex w-full h-full items-center justify-center">
            <h1 className="loader"></h1>
         </div>
      );
   if (isError)
      return `something went wrong
   ${error}
   `;

   return (
      <div className="flex flex-col items-center gap-4 w-full col-span-1">
         {data
            ?.map((product: IProduct) => {
               return <ProductItem productItem={product} key={product.id} />;
            })
            .reverse()}
      </div>
   );
}
