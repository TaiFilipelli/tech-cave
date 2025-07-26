import { Product } from "@/lib/schemas/productCreationSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export default function StepBasicInfo({ register, errors, onNext, onBack }: {
  register: UseFormRegister<Product>,
  errors: FieldErrors<Product>,
  onNext: () => void,
  onBack: () => void,
}) {
  return (
    <section className="flex flex-col gap-4 text-black">
      <input placeholder="Nombre" {...register('name')} className="text-black p-2 rounded-lg mx-2 font-normal"/>
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input type="number" placeholder="Precio ($)" {...register('price', { valueAsNumber: true })} className="text-black p-2 rounded-lg mx-2 font-normal"/>
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <input placeholder="Descripción del producto" {...register('description')} className="text-black p-2 rounded-lg mx-2 font-normal"/>
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <input type="number" placeholder="Stock inicial" {...register('stock', { valueAsNumber: true })} className="text-black p-2 rounded-lg mx-2 font-normal"/>
      {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}

      <input placeholder="URL de imagen" {...register('img')} className="text-black p-2 rounded-lg mx-2 font-normal"/>
      {errors.img && <p className="text-red-500">{errors.img.message}</p>}

      <article className="flex flex-row justify-around gap-4 mt-4 w-full">
        <button type="button" onClick={onBack} className="bg-red-500 text-white p-2 rounded-lg font-semibold w-1/2">Atrás</button>
        <button type="button" onClick={onNext} className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-2 rounded-lg font-semibold w-1/2">Siguiente</button>
      </article>
    </section>
  );
}
