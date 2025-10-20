import { z } from "zod";

export const normalizedItemSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío").max(50, "El nombre es muy largo"),
  type: z.enum(["brand", "type"], "Elija un tipo."),
});

export type NormalizedItem = z.infer<typeof normalizedItemSchema>;