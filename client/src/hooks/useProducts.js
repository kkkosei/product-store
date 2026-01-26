import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, getAllProducts, getProductById, getMyProducts } from "../lib/api";

export const useProducts = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  return result;
};

export const useCreateProduct = () => {
  const result = useMutation({ mutationFn: createProduct });
  return result;
};

export const useProduct = (id) => {
  return useQuery({
    queryKey:["product", id],
    queryFn: () => getProductById(id),
    enabled: !! id
  }) 
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["myProducts"]})
    }
  });
};

export const useMyProducts = () => {
  return useQuery({ queryKey:["myProducts"], queryFn:getMyProducts })

};