import { headers } from "next/headers";
import { BASE_URL } from "./index";
import { IProduct } from "@/types/Product";

export default async function updateProduct(data: IProduct) {
   const options = {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   };

   try {
      const response = await fetch(`${BASE_URL}/products/${data.id}`, options);
      const updatedProduct = await response.json();
      console.log(updatedProduct);
   } catch (error) {
      console.log(error);
   }
}
