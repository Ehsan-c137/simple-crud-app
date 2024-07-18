import { useState } from "react";
import { IProduct } from "@/types/Product";
import useProduct from "@/hooks/useProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, deleteProduct } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";

export const newProductSchema = z.object({
   newName: z
      .string()
      .min(3, { message: "product name must be at least 3 characters" }),
   newPrice: z.number().min(1, { message: "product price must be at least 1" }),
});

export type NewProduct = z.infer<typeof newProductSchema>;

export default function ProductItem({
   productItem,
}: {
   productItem: IProduct;
}) {
   const queryClient = useQueryClient();
   const [isEditing, setIsEditing] = useState(false);
   const {
      register,
      handleSubmit,
      getValues,
      formState: { errors, isValid, isSubmitting },
   } = useForm<NewProduct>({
      resolver: zodResolver(newProductSchema),
      mode: "onChange",
      defaultValues: {
         newName: productItem.name,
         newPrice: Number(productItem.price),
      },
   });

   const updateMutation = useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["products"],
         });
      },
   });

   const handleUpdateProduct = (e: React.FormEvent) => {
      const { newName, newPrice } = getValues();

      e.preventDefault();
      updateMutation.mutate({
         name: newName,
         price: `${newPrice}`,
         id: productItem.id,
      });
   };

   const deleteMutation = useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["products"],
         });
      },
   });

   const handleDeleteProduct = (e: React.FormEvent) => {
      e.preventDefault();
      deleteMutation.mutate(productItem.id);
   };

   const EditElement = () => (
      <div className="flex flex-col gap-2">
         <Input
            type="text"
            id="fname"
            {...register("newName")}
            placeholder={productItem?.name}
         />
         <Input
            type="number"
            id="price"
            {...register("newPrice")}
            name="price"
            placeholder={productItem?.price}
         />
      </div>
   );

   return (
      <motion.div layout>
         <Card className="flex max-w-3xl min-w-[350px] justify-center gap-10 p-4  col-span-1 rounded-lg shadow">
            <div className="w-full max-w-sm flex">
               {isEditing ? (
                  <EditElement />
               ) : (
                  <div>
                     <a href="#">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                           {productItem?.name}
                        </h5>
                     </a>
                     <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                           {productItem?.price}$
                        </span>
                     </div>
                  </div>
               )}
            </div>
            <div className="flex items-center gap-4">
               <Button
                  onClick={(e) => {
                     if (!errors.newName && !errors.newPrice) {
                        handleUpdateProduct(e);
                     }

                     setIsEditing(!isEditing);
                  }}
               >
                  {isEditing ? "Save" : "Edit"}
               </Button>
               <Button variant={"outline"} onClick={handleDeleteProduct}>
                  Delete
               </Button>
            </div>
         </Card>
      </motion.div>
   );
}
