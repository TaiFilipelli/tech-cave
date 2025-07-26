import {z} from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  stock: z.number().int().nonnegative("El stock debe ser 0 o mayor"),
  img: z.string().url("Debe ser una URL válida"),
  type: z.string().min(1, "Debe seleccionar un tipo"),
  brand: z.string().min(1, "Debe seleccionar una marca"),
});
export type Product = z.infer<typeof productSchema>;