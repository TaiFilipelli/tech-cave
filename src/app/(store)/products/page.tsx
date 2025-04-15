import { Suspense } from 'react';
import ClientProductsList from './ClientProductList';

export default function ProductsPage() {
  return (
    <section className="flex items-center text-center p-10">
      <h2 className="text-5xl font-bold mb-5">Productos</h2>
      <Suspense fallback={<div>Cargando filtros...</div>}>
        <ClientProductsList />
      </Suspense>
    </section>
  );
}