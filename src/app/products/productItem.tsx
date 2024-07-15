import { useState } from "react";
import { IProduct } from "@/types/Product";
import useProduct from "@/hooks/useProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, deleteProduct } from "@/api";

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
      <div>
         <input
            type="text"
            id="fname"
            name="name"
            value={product?.name}
            onChange={handleProductDetail}
            placeholder={productItem?.name}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
         />
         <input
            type="number"
            id="price"
            onChange={handleProductDetail}
            value={product?.price}
            name="price"
            placeholder={productItem?.price}
            className=" border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
         />
      </div>
   );

   return (
      <>
         <div className="flex max-w-3xl min-w-[350px] justify-center gap-10 p-4 bg-white border border-gray-200 col-span-1 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
               <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={(e) => {
                     setIsEditing(!isEditing);
                     if (isEditing && product.name.length > 0) {
                        // TODO: install zod for validation
                        handleUpdateProduct(e);
                     }
                  }}
               >
                  {isEditing ? "Save" : "Edit"}
               </button>
               <button
                  onClick={handleDeleteProduct}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
               >
                  Delete
               </button>
            </div>
         </div>
      </>
   );
}
