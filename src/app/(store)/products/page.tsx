import { Suspense } from 'react';
import ClientProductsList from './ClientProductList';

export default function ProductsPage() {
  return (
    <section className="flex flex-col items-center dark:text-white text-center p-10 pt-32">
      <Suspense fallback={<div className='h-[80dvh]'>Cargando filtros...</div>}>
        <ClientProductsList />
      </Suspense>
    </section>
  );
}