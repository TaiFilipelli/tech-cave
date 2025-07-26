import { Product } from '@/lib/schemas/productCreationSchema';

export default function SummaryStep({ values, onBack }: {
  values: Product,
  onBack: () => void,
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Resumen del producto</h2>
      <ul className="list-disc pl-4">
        <li>{values.name}</li>
        <li>{values.type}</li>
        <li>{values.brand}</li>
        <li>${values.price}</li>
        <li>{values.description}</li>
        <li>{values.stock} unidades</li>
        <img src={values.img} alt={values.name} width={200} height={200} />
      </ul>

      <div className="flex gap-4 mt-4">
        <button type="button" onClick={onBack}>Atrás</button>
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Confirmar</button>
      </div>
    </div>
  );
}
