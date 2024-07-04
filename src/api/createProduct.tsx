import { IProduct } from "@/types/Product";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BASE_URL } from "./index";

export default async function createProduct(data: IProduct) {
   const options = {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   };

   try {
      const response = await fetch(`${BASE_URL}/products`, options);
      const newProduct = await response.json();

      console.log(newProduct);
   } catch (error) {
      console.log(error);
   }
}
