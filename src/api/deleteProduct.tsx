import { BASE_URL } from ".";

export default async function deleteProduct(id: string) {
   const options = {
      method: "DELETE",
      headers: {
         "Content-type": "application/json",
      },
   };

   try {
      const repsone = await fetch(`${BASE_URL}/products/${id}`, options);
      const deletedProduct = await repsone.json();
      console.log(deletedProduct);
   } catch (error) {
      console.log(error);
   }
}
