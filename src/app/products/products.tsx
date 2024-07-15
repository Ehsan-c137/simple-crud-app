"use client";

import GetProducts from "@/api/getProducts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IProduct } from "@/types/Product";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import createProduct from "@/api/createProduct";
import ProductItem from "./productItem";
import useProduct from "@/hooks/useProduct";

export default function Products() {
   const { product: newProduct, handleProductDetail } = useProduct();

   const queryClient = useQueryClient();

   const { data, isError, isLoading, error } = useQuery({
      queryKey: ["products"],
      queryFn: () => GetProducts(),
   });

   const mutation = useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
         // TODO: add toast
         queryClient.invalidateQueries({ queryKey: ["products"] });
      },
   });

   const submitProduct = (e: React.FormEvent) => {
      e.preventDefault();
      mutation.mutate({
         ...newProduct,
         id: Date.now().toString(),
      });
   };

   if (isLoading) return "loading...";
   if (isError)
      return `something went wrong
   ${error}
   `;

   return (
      <div className=" bg-gray-300 p-4 w-full min-h-screen">
         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link href="/">Home</Link>
         </button>
         <div className="max-w-lg lg:ms-auto mx-auto text-center bg-slate-600 p-4 rounded-xl mb-4">
            <form onSubmit={submitProduct}>
               <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-4 ">
                  <input
                     type="text"
                     id="fname"
                     name="name"
                     value={newProduct.name}
                     onChange={handleProductDetail}
                     placeholder="name"
                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                  />
                  <input
                     type="number"
                     id="price"
                     onChange={handleProductDetail}
                     value={newProduct.price}
                     name="price"
                     placeholder="price"
                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                  />
               </div>
               <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >
                  add product
               </button>
            </form>
         </div>
         <div className="flex flex-wrap justify-center gap-8 w-full">
            {data.map((product: IProduct) => {
               return <ProductItem productItem={product} key={product.id} />;
            })}
         </div>
      </div>
   );
}
