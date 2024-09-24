"use client";

import {
   dehydrate,
   HydrationBoundary,
   useQueryClient,
} from "@tanstack/react-query";
import Products from "./products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/api";
import { z } from "zod";

export const newProductSchema = z.object({
   name: z
      .string()
      .min(3, { message: "product name must be at least 3 characters" }),
   price: z.number().min(1, { message: "product price must be at least 1" }),
});

export type NewProduct = z.infer<typeof newProductSchema>;

export default function ProductsPage() {
   const queryClient = useQueryClient();
   // await queryClient.prefetchQuery({
   //    queryKey: ["products"],
   //    queryFn: GetProducts,
   // });

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

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="p-4 w-full min-h-screen bg-slate-200 flex flex-col lg:flex-row gap-4 ">
            <Card className="p-4 max-h-80 col-span-1 lg:sticky lg:top-4 lg:left-8">
               <form
                  onSubmit={handleSubmit(handleSubmitProduct)}
                  className="flex flex-col gap-4 "
               >
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-4 ">
                     <div className="flex flex-col">
                        <Input
                           type="text"
                           id="fname"
                           {...register("name")}
                           placeholder="name"
                           className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                        />

                        {errors.name && (
                           <p className="text-red-500 text-md">
                              {errors.name.message}
                           </p>
                        )}
                     </div>
                     <div className="flex flex-col">
                        <Input
                           type="number"
                           min={1}
                           id="price"
                           {...register("price", { valueAsNumber: true })}
                           placeholder="price"
                        />

                        {errors.price && (
                           <p className="text-red-500 text-md">
                              {errors.price.message}
                           </p>
                        )}
                     </div>

                     <Button type="submit">
                        {mutation.status === "pending"
                           ? "loading..."
                           : "add product"}
                     </Button>
                  </div>
               </form>
            </Card>

            <Products />
         </div>
      </HydrationBoundary>
   );
}
