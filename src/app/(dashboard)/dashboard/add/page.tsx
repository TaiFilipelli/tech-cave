'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type Product } from '@/lib/schemas/productCreationSchema';
import { useState } from 'react';
import StepSelectTypeBrand from '@/components/steps/StepSelectTypeBrand';
import StepBasicInfo from '@/components/steps/StepBasicInfo';
import SummaryStep from '@/components/steps/SummaryStep';
import { useProducts } from '@/product/provider';
import { useSession } from 'next-auth/react';
import { addToast } from '@heroui/react';
import Link from 'next/link';

type ProductForm = Product;

export default function AddPage() {
  const [step, setStep] = useState(0);
  const { register, handleSubmit, trigger, formState, getValues } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      type: '',
      price: 0,
      description: '',
      brand: '',
      stock: 0,
      img: '',
    },
  });

  const products = useProducts();
  const { data: session } = useSession();

  const nextStep = async () => {
    const isValid = await trigger(stepFields[step]); 
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    try {
      const lastProduct = products[products.length - 1];
      const nextId = Number(lastProduct.id) + 1;

      const response = await fetch('/api/addProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.accessToken}` },
        body: JSON.stringify({
          accessToken: session?.accessToken,
          range: 'Productos!A:H',
          values: [[
            nextId.toString(),
            data.name,
            data.type,
            data.price.toString(),
            data.description,
            data.brand,
            data.stock.toString(),
            data.img,
          ]]
        }),
      });

      if (!response.ok) throw new Error('Error al crear producto');
      addToast({ title: "Producto creado con éxito!", color: "success" });

    } catch (e:unknown) {
      addToast({ title: "Error al crear producto", description: `${(e as Error).message}`, color: "danger" });
    }
  };

  return (
    <section className='flex flex-col items-center justify-center h-screen px-8'>
      <h1 className='text-3xl font-bold mb-4'>Agregar producto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-2xl bg-black p-6 rounded-xl'>
        {step === 0 && <StepSelectTypeBrand register={register} errors={formState.errors} onNext={nextStep} />}
        {step === 1 && <StepBasicInfo register={register} errors={formState.errors} onNext={nextStep} onBack={prevStep} />}
        {step === 2 && <SummaryStep values={getValues()} onBack={prevStep} />}
      </form>
      <Link href={'/dashboard'} className='hover:underline text-xl my-5 max-[850px]:my-2'>Volver atrás</Link>
    </section>
  );
}

const stepFields: (keyof ProductForm)[][] = [
  ['type', 'brand'],
  ['name', 'price', 'description', 'stock', 'img'],
  [],
];
