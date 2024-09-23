"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { IProduct } from "@/types/Product";
import { getProducts, createProduct } from "@/api";
import ProductItem from "./productItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";

export const newProductSchema = z.object({
   name: z
      .string()
      .min(3, { message: "product name must be at least 3 characters" }),
   price: z.number().min(1, { message: "product price must be at least 1" }),
});

export type NewProduct = z.infer<typeof newProductSchema>;

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
      <div className="p-4 w-full min-h-screen bg-slate-200 flex flex-col lg:flex-row gap-4 ">
         <Card className="p-4 max-h-80 col-span-1">
            <form
               onSubmit={handleSubmit(handleSubmitProduct)}
               className="flex flex-col gap-4 "
            >
               <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-4 ">
                  <Input
                     type="text"
                     id="fname"
                     {...register("name")}
                     placeholder="name"
                     className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                  />

                  {errors.name && (
                     <p className="text-red-500">{errors.name.message}</p>
                  )}

                  <Input
                     type="number"
                     min={1}
                     id="price"
                     {...register("price", { valueAsNumber: true })}
                     placeholder="price"
                  />

                  {errors.price && (
                     <p className="text-red-500">{errors.price.message}</p>
                  )}

                  <Button type="submit">
                     {mutation.status === "pending"
                        ? "loading..."
                        : "add product"}
                  </Button>
               </div>
            </form>
         </Card>
         <div className="flex flex-col items-center gap-4 w-full col-span-1">
            {data
               .map((product: IProduct) => {
                  return <ProductItem productItem={product} key={product.id} />;
               })
               .reverse()}
         </div>
      </div>
   );
}
