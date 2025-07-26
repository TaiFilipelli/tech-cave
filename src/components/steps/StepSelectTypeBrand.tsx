import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Product } from '@/lib/schemas/productCreationSchema';

const types = ["Procesador", "Placa de Video", "Placa Madre", "Memoria RAM", "Almacenamiento SSD", "Almacenamiento HDD", "Fuente de Alimentación", "Otros"];
const brands = ["AMD", "Intel", "NVIDIA", "Asrock", "ASUS", "Patriot", "Corsair", "ADATA", "T-CREATE", "WD", "Cougar", "HYTE"];

export default function StepSelectTypeBrand({
  register, errors, onNext,
}: {
  register: UseFormRegister<Product>,
  errors: FieldErrors<Product>,
  onNext: () => void
}) {
  return (
    <section className='flex flex-col gap-4'>
      <label className='text-lg font-semibold'>Tipo:
        <input list="types" {...register('type')} className="text-black p-2 rounded-lg mx-2 font-normal" />
        <datalist id="types">{types.map((t, i) => <option key={i} value={t} />)}</datalist>
        {errors.type && <span className="text-red-500">{errors.type.message}</span>}
      </label>

      <label className='text-lg font-semibold'>Marca:
        <input list="brands" {...register('brand')} className="text-black p-2 rounded-lg mx-2 font-normal" />
        <datalist id="brands">{brands.map((b, i) => <option key={i} value={b} />)}</datalist>
        {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
      </label>

      <button type="button" onClick={onNext} className='bg-gradient-to-br from-purple-400 to-purple-600 text-white p-2 rounded-lg font-semibold'>Siguiente</button>
    </section>
  );
}
