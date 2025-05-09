import { Suspense } from "react";
import ProductDetailsClient from "./ProductDetailsPage";

export default function Page() {

  return (
    <Suspense fallback={<div className="p-20 text-center text-xl">Cargando producto...</div>}>
      <ProductDetailsClient/>
    </Suspense>
  );
}
