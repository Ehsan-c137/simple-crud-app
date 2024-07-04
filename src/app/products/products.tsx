"use client";

import GetProducts from "@/api/getProducts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IProduct } from "@/types/Product";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import createProduct from "@/api/createProduct";
import { randomUUID } from "crypto";

export default function Products() {
   const [newProduct, setNewProduct] = useState({
      name: "",
      price: "",
   });

   const queryClient = useQueryClient();

   const { data, isError, isLoading } = useQuery({
      queryKey: ["products"],
      queryFn: () => GetProducts(),
   });

   const mutation = useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
         console.log("new product created");
         queryClient.invalidateQueries({ queryKey: ["products"] });
      },
   });

   const handleProductDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewProduct({
         ...newProduct,
         [e.target.name]: e.target.value,
      });
   };

   const submitProduct = (e: React.FormEvent) => {
      e.preventDefault();
      mutation.mutate({
         ...newProduct,
         id: randomUUID(),
      });

      return false;
   };

   if (isLoading) return "loading...";
   if (isError) return "something went wrong";

   return (
      <div className=" bg-gray-300 p-4 w-full">
         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link href="/">Home</Link>
         </button>
         <div className="max-w-lg lg:ms-auto mx-auto text-center bg-slate-600 p-4 rounded-xl mb-4">
            <form>
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
                     type="text"
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
                  onSubmit={() => submitProduct}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >
                  add product
               </button>
            </form>
         </div>
         <div className="flex flex-wrap justify-center gap-8 w-full">
            {data.map((product: IProduct) => {
               return (
                  <div
                     className="flex items-center justify-center"
                     key={product.id}
                  >
                     <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div>
                           <a href="#">
                              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                 {product?.name}
                              </h5>
                           </a>
                           <div className="flex items-center justify-between">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                 {product?.price}$
                              </span>

                              {/* <AddToCart id={props.params.id} /> */}
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
   );
}
