import { useState } from "react";
const useProduct = () => {
   const [product, setProduct] = useState({
      name: "",
      price: "",
   });

   const handleProductDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setProduct({
         ...product,
         [e.target.name]: e.target.value,
      });
   };

   return {
      product,
      handleProductDetail,
   };
};

export default useProduct;
