"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { IProduct } from "@/types/Product";
import Link from "next/link";
import { getProducts, createProduct } from "@/api";
import ProductItem from "./productItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const newProductSchema = z.object({
   name: z
      .string()
      .min(3, { message: "product name must be at least 3 characters" }),
   price: z.number().min(1, { message: "product price must be at least 1" }),
});

type NewProduct = z.infer<typeof newProductSchema>;

export default function Products() {
   const queryClient = useQueryClient();
   const { data, isError, isLoading, error } = useQuery({
      queryKey: ["products"],
      queryFn: () => getProducts(),
   });

   const {
      register,
      handleSubmit,

      formState: { errors, isValid, isSubmitting },
   } = useForm<NewProduct>({
      resolver: zodResolver(newProductSchema),
      mode: "onChange",
      defaultValues: {
         name: "",
         price: 0,
      },
   });

   const mutation = useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
         // TODO: add toast
         queryClient.invalidateQueries({ queryKey: ["products"] });
      },
   });

   const handleSubmitProduct = (data: NewProduct) => {
      // FIX: price should't be string
      mutation.mutate({
         price: `${data.price}`,
         name: data.name,
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
            <form onSubmit={handleSubmit(handleSubmitProduct)}>
               <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-4 ">
                  <input
                     type="text"
                     id="fname"
                     {...register("name")}
                     placeholder="name"
                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                  />
                  {errors.name && (
                     <p className="text-red-500">{errors.name.message}</p>
                  )}
                  <input
                     type="number"
                     id="price"
                     {...register("price", { valueAsNumber: true })}
                     placeholder="price"
                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                  />
                  {errors.price && (
                     <p className="text-red-500">{errors.price.message}</p>
                  )}
               </div>
               <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >
                  {mutation.status === "pending" ? "loading..." : "add product"}
               </button>
            </form>
         </div>
         <div className="flex flex-col items-center gap-8 w-full">
            {data
               .map((product: IProduct) => {
                  return <ProductItem productItem={product} key={product.id} />;
               })
               .reverse()}
         </div>
      </div>
   );
}
