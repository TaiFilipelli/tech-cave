'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { normalizedItemSchema, NormalizedItem } from '@/lib/schemas/normalizedItemSchema';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { addToast, Button, Input, Select, SelectItem } from '@heroui/react';
import Link from 'next/link';
import brandsApi from '@/brands/api';
import typesApi from '@/productTypes/api';
import { Brand } from '@/brands/brand';
import { Type } from '@/productTypes/type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';

type FormData = NormalizedItem & {
    nextId: number;
}

export default function AddNormalizedItemPage() {
  const { data: session } = useSession();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(normalizedItemSchema.extend({
        nextId: z.number().min(1),
    })),
    defaultValues: {
      name: '',
      type: 'brand',
      nextId: 1,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const selectedType = watch('type');

  useEffect(() => {
    async function fetchNormalizedData() {
      try {
        const [fetchedBrands, fetchedTypes] = await Promise.all([
          brandsApi.list(),
          typesApi.list(),
        ]);
        setBrands(fetchedBrands);
        setTypes(fetchedTypes);
        setDataLoaded(true);
      } catch (error) {
        addToast({ title: "Error al cargar datos", description: "No se pudo obtener la lista de marcas y tipos: " + (error as Error).message, color: "danger" });
        setDataLoaded(true);
      }
    }
    fetchNormalizedData();
  }, []);

  useEffect(() => {
    const currentList = selectedType === 'brand' ? brands : types;
    const maxId = currentList.reduce((max, item) => Math.max(max, Number(item.id)), 0);
    const nextId = maxId + 1 || 1;
    setValue('nextId', nextId, { shouldDirty: false, shouldValidate: true });
  }, [selectedType, brands, types, setValue]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!session?.accessToken || isLoading) return;

    setIsLoading(true);

    const sheetName = data.type === 'brand' ? 'Marcas' : 'Tipos';
    const itemName = data.name.trim();

    try {
        // Prevención de duplicados (insensible a mayúsculas)
        if (data.type === 'brand' && brands.some(b => b.marca.toLowerCase() === itemName.toLowerCase())) {
             addToast({ title: "Error", description: `La marca '${itemName}' ya existe.`, color: "warning" });
             setIsLoading(false);
             return;
        }
        if (data.type === 'type' && types.some(t => t.tipo.toLowerCase() === itemName.toLowerCase())) {
             addToast({ title: "Error", description: `El tipo de producto '${itemName}' ya existe.`, color: "warning" });
             setIsLoading(false);
             return;
        }

      const response = await fetch('/api/addNormalizedItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.accessToken}` },
        body: JSON.stringify({
          accessToken: session?.accessToken,
          sheetName: sheetName,
          values: [[data.nextId.toString(), itemName]],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al crear el item');
      }

      addToast({ title: `${sheetName} creado con éxito!`, color: "success" });
      // Actualizar estado local para reflejar el nuevo item y limpiar formulario
      if (data.type === "brand") {
        const newBrand: Brand = { id: data.nextId, marca: itemName };
        setBrands((prev) => [...prev, newBrand]);
      } else {
        const newType: Type = { id: data.nextId, tipo: itemName };
        setTypes((prev) => [...prev, newType]);
      }

      reset({ name: '', type: data.type as 'brand' | 'type', nextId: data.nextId + 1 });
    } catch (e:unknown) {
      addToast({ title: "Error al crear item", description: `${(e as Error).message}`, color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
        <section className='flex flex-col items-center justify-center h-screen px-8'>
            <div className='text-center p-20 text-xl'>Cargando datos iniciales...</div>
        </section>
    );
  }

  return (
    <section className='flex flex-col items-center justify-center h-screen px-8'>
      <h1 className='text-3xl font-bold mb-4'>Agregar Marca o Tipo de Producto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-xl bg-black p-6 rounded-xl text-white'>
        <div className='flex flex-col gap-4'>
            <Select
                label="Tipo de Item a crear"
                placeholder="Seleccione uno"
                {...register('type')}
                selectedKeys={[selectedType]}
                onSelectionChange={(key) => setValue('type', Array.isArray(key) ? key[0] as 'brand' | 'type' : (key as unknown as string as 'brand' | 'type'))}
                errorMessage={errors.type?.message}
                isInvalid={!!errors.type}
            >
                <SelectItem key="brand">Marca</SelectItem>
                <SelectItem key="type">Tipo de Producto</SelectItem>
            </Select>

            <Input
                label={`Nombre de la nueva ${selectedType === 'brand' ? 'Marca' : 'Categoría'}`}
                placeholder={`Ej: ${selectedType === 'brand' ? 'ASUS' : 'Procesador'}`}
                {...register('name')}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
                className='text-black'
            />
            <p className='text-sm text-gray-400'>Próximo ID a utilizar: {watch('nextId')}</p>

            <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
                startContent={!isLoading && <FontAwesomeIcon icon={faPlus} />}
                className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white p-2 rounded-lg font-semibold mt-4'
            >
                Agregar {selectedType === 'brand' ? 'Marca' : 'Tipo'}
            </Button>
        </div>
      </form>
      <Link href={'/dashboard'} className='hover:underline text-xl my-5 max-[850px]:my-2'>Volver atrás</Link>
    </section>
  );
}