import { BASE_URL } from "./index";

async function getData() {
   const options = {
      method: "GET",
      headers: {
         accept: "application/json",
      },
   };

   const response = fetch(`${BASE_URL}/products`, options)
      .then((res) => res.json())
      .catch((error) => console.log(error));

   return response;
}

export default async function GetProducts() {
   const data = await getData();
   return data;
}
