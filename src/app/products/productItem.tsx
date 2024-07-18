import { useState } from "react";
import { IProduct } from "@/types/Product";
import useProduct from "@/hooks/useProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, deleteProduct } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductItem({
   productItem,
}: {
   productItem: IProduct;
}) {
   const [isEditing, setIsEditing] = useState<Boolean>(false);
   const { product, handleProductDetail } = useProduct();
   const queryClient = useQueryClient();

   const updateMutation = useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["products"],
         });
      },
   });

   const handleUpdateProduct = (e: React.FormEvent) => {
      e.preventDefault();
      updateMutation.mutate({
         ...product,
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
            name="name"
            value={product?.name}
            onChange={handleProductDetail}
            placeholder={productItem?.name}
         />
         <Input
            type="number"
            id="price"
            onChange={handleProductDetail}
            value={product?.price}
            name="price"
            placeholder={productItem?.price}
         />
      </div>
   );

   return (
      <>
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
                     setIsEditing(!isEditing);
                     if (isEditing && product.name.length > 0) {
                        // TODO: install zod for validation
                        handleUpdateProduct(e);
                     }
                  }}
               >
                  {isEditing ? "Save" : "Edit"}
               </Button>
               <Button variant={"outline"} onClick={handleDeleteProduct}>
                  Delete
               </Button>
            </div>
         </Card>
      </>
   );
}
