'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, SortDescriptor } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useOrders } from '@/orders/provider'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { Order } from '@/orders/order'
import { Product } from '@/product/products'
import { useProducts } from '@/product/provider'
import { useSession } from 'next-auth/react'

const DashboardPage = () => {

  const [greeting, setGreeting] = useState('Hola');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({column: "date", direction: "descending"});
  const [productSortDescriptor, setProductSortDescriptor] = useState<SortDescriptor>({column: "name", direction: "ascending"});
  const orders:Order[] = useOrders();
  const products:Product[] = useProducts();
  const { data: session } = useSession();

  type OrderStatus = 'approved' | 'pending' | 'rejected'

  const headerColumns = [
    {name: 'ID', uid: 'payment_id', sortable:true},
    {name: 'Estado', uid: 'status', sortable:true},
    {name: 'Fecha', uid: 'date', sortable:true},
    {name: 'Total', uid: 'total', sortable:true},
    {name: 'Email', uid: 'user_email', sortable:true}
  ];

  const productsHeaderColumns = [
    {name: 'Nombre', uid: 'name', sortable:true},
    {name: 'Categoria', uid: 'type', sortable:true},
    {name: 'Precio', uid: 'price', sortable:true},
    {name: 'Marca', uid: 'brand', sortable:true},
    {name: 'Stock', uid: 'stock', sortable:true}
  ];

  const STATUS_COLORS: Record<OrderStatus, string> = {
    approved: '#10B981',
    pending: '#F59E0B',
    rejected: '#EF4444'
  }

  interface StatusData {
    name: OrderStatus
    value: number
    color: string
  } 

 const getStatusData = (orders: Order[]): StatusData[] => {
  const statusMap: Record<string, number> = {};

  orders.forEach(({ status }) => {
    if (STATUS_COLORS[status as OrderStatus]) {
      statusMap[status] = (statusMap[status] || 0) + 1;
    }
  });

  return Object.entries(statusMap).map(([status, value]) => ({
    name: status as OrderStatus,
    value,
    color: STATUS_COLORS[status as OrderStatus]
  }));
}

  const statusData = getStatusData(orders || []);
  // LOGICA PARA PIECHART DE ESTADOS DE PEDIDOS.

  type TypeData = {
  name: string
  value: number
  color: string
}

const TYPE_COLORS: Record<string, string> = {
  'Procesador':'#2427d1', 
  'Motherboard':'#F59E0B', 
  'Memoria RAM':'#10B981', 
  'SSD/HDD':'#EF4444',
  'Placa de Video':'#8B5CF6', 
  'Fuente de Alimentacion':'#10B981',
  'Otros':'#F43F5E'
}

const getTypeData = (orders: Order[]): TypeData[] => {
  const typeCount: Record<string, number> = {}

orders.forEach(order => {
    order.items.forEach(item => {
      const type = item.type || 'Otros';
      const quantity = item.cantidad || 0;

      typeCount[type] = (typeCount[type] || 0) + quantity;
    });
  });


  return Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
    color: TYPE_COLORS[name] || '#999999'
  }));
}

 const typeData = getTypeData(orders || []);

  // HASTA ACÁ LA LÓGICA DE LOS PIECHART (STATUS Y TIPO DE PRODUCTOS EN PEDIDOS).

  interface LineChartData {
  month: string;
  orders: number;
}

const getOrdersPerMonth = (orders: Order[]): LineChartData[] => {
  const monthCount: Record<string, number> = {};

  orders.forEach(order => {
    const date = new Date(order.date);
    const year = date.getFullYear();

    if (year === 2025) { 
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
    }
  });

  return Object.entries(monthCount)
    .map(([month, orders]) => ({ month, orders }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

  const lineData = getOrdersPerMonth(orders || []);
  // LÓGICA PARA EL GRÁFICO DE LÍNEA DE PEDIDOS POR MES.	
  const getRevenuePerMonth = (orders: Order[]) => {
    const revenueMap: Record<string, number> = {};

  orders.forEach(order => {
    if (order.status !== "approved") return;

    const month = order.date.slice(0, 7);

    order.items.forEach(item => {
      const priceNumber = parseFloat(
        item.price.replace(/[^0-9.-]+/g, "").replace(",", "")
      );
      const total = priceNumber * item.cantidad;

      revenueMap[month] = (revenueMap[month] || 0) + total;
    });
  });

  const result = Object.entries(revenueMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month,
      total: total,
    }));

  return result;
}

  const revenueData = getRevenuePerMonth(orders || []);

   const sortedOrders = React.useMemo(() => {
    return [...orders].sort((a: Order, b: Order) => {
      const first = a[sortDescriptor.column as keyof Order];
      const second = b[sortDescriptor.column as keyof Order];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [orders, sortDescriptor]);

  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a: Product, b: Product) => {
      const first = a[productSortDescriptor.column as keyof Product];
      const second = b[productSortDescriptor.column as keyof Product];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return productSortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [products, productSortDescriptor]);

  const calculateTotal = (items: Order['items']) => {
    return items.reduce((total, item) => total + 
      (Number(item.price.toString().replace(/[^0-9,]/g, '').replace(/\./g, '').replace(',', '.')) * item.cantidad), 0);
  };

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) {
      setGreeting('Buenos días')
    } else if (hour >= 12 && hour < 20) {
      setGreeting('Buenas tardes')
    } else {
      setGreeting('Buenas noches')
    }
  }, []);

  return (
  <section className='flex flex-col items-center justify-center py-6 px-10 max-[500px]:px-2'>
    <section className='flex flex-col w-full p-5 max-[750px]:p-0 mt-2 gap-5 rounded-2xl'>
      <aside className='w-full flex flex-row max-[1160px]:flex-col gap-5'>
        <article className='bg-black text-white p-5 rounded-xl flex flex-col justify-center max-[1160px]:w-full gap-5 w-1/2'>
          <div className='flex flex-row gap-2 justify-center items-center'>
            {session && session.user.image && <Avatar src={session!.user.image!} size='lg'/>}
            <h2 className='font-bold text-2xl'>{greeting}, admin!</h2>
          </div>
          <section className='flex flex-row gap-5 justify-between items-center text-center'>
            <div className='w-full flex flex-col'>
              <span className='text-3xl font-bold bg-gradient-to-br from-red-500 to-yellow-600 bg-clip-text text-transparent'>{orders.length}</span>
              <article className='text-xl'>pedidos totales</article>
            </div>
            <div className='w-full flex flex-col'>
              <span className='text-3xl font-bold bg-gradient-to-br from-red-500 to-yellow-600 bg-clip-text text-transparent'>{orders.length}</span>
              <article className='text-xl'>pedidos totales</article>
            </div>
          </section>
        </article>
        <div className='w-1/2 max-[1160px]:w-full flex flex-row gap-3'>
      <article className='bg-black text-white p-5 gap-5 w-1/2 rounded-xl'>
      <div className="mt-4 rounded-2xl">
        <h3 className="text-center font-medium mb-3 text-2xl">Estados de Pedidos</h3>
        <div className="h-[14rem]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}/>
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => (<span className="text-sm text-white">{value}</span>)}/>
              <Tooltip  formatter={(value, name) => { const label = typeof name === 'string' ? name : name.toString(); return [value, label.charAt(0).toUpperCase() + label.slice(1)];}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </article>
      <article className='bg-black p-5 gap-5 w-1/2 rounded-xl'>
      <div className="mt-4 rounded-2xl">
        <h3 className="text-center font-medium mb-3 text-2xl">Categorias más vendidas</h3>
        <div className="h-[16rem]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}/>
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => (<span className="text-sm text-gray-300">{value}</span>)}/>
              <Tooltip  formatter={(value, name) => { const label = typeof name === 'string' ? name : name.toString(); return [value, label.charAt(0).toUpperCase() + label.slice(1)];}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </article>
        </div>
      </aside>
      <aside className='w-full flex flex-row max-[1000px]:flex-col gap-2'>
        <article className='flex items-center justify-center bg-black p-5 rounded-xl w-1/2 max-[1000px]:w-full'>
        <div className="bg-gray-900 p-5 w-full rounded-xl">
          <h3 className="text-center font-medium mb-3 text-white text-xl">Órdenes por Mes</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ccc"/>
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#0088FE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
      </article>
      <article className='flex items-center justify-center bg-black p-5 rounded-xl w-1/2 max-[1000px]:w-full'>
        <div className="bg-gray-900 p-5 w-full rounded-xl">
          <h3 className="text-center font-medium mb-3 text-white text-xl">Ingresos por mes</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ccc"/>
                <YAxis stroke="#ccc" allowDecimals={true} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#00C49F" fillOpacity={0.3} fill="#00C49F" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
       </div>
      </article>
      </aside>
      <aside className='w-full flex flex-row max-[800px]:flex-col gap-2 h-[42rem] max-[800px]:h-full'>
        <article className='flex flex-col bg-black p-5 gap-5 w-1/2 max-[800px]:w-full rounded-xl max-[800px]:h-[30rem]'>
        <header className='w-full flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Inventario</h2>
          <Dropdown className='bg-black border-white border'>
            <DropdownTrigger>
              <Button variant="shadow" className='bg-white shadow-purple-950 text-black font-semibold text-lg' startContent={<FontAwesomeIcon icon={faPencil}/>}>Modificar</Button>
            </DropdownTrigger>
            <DropdownMenu className='bg-black'>
              <DropdownItem key='add'>
                <Button as={Link} href='/dashboard/add' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faPlus} size='lg'/>}>
                  Agregar producto
                </Button>
              </DropdownItem>
              <DropdownItem key='edit'>
                <Button as={Link} href='/dashboard/edit' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faPencil} size='lg'/>}>
                  Editar producto
                </Button>
              </DropdownItem>
              <DropdownItem key='delete'>
                <Button as={Link} href='/dashboard/delete' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faTrash} size='lg'/>}>
                  Eliminar producto
                </Button>
              </DropdownItem>
              <DropdownItem key='download'>
                <Button as={Link} href='https://docs.google.com/spreadsheets/d/1O_9reXr8yzEZDllwOo_YKOtJ3HZqKJd7dkF_cWrqa1g/export?format=xlsx' download target='_blank' rel='noopener noreferrer' className='bg-gradient-to-br from-green-600 to-blue-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faDownload} size='lg' />}>
                  Descargar hoja
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
          {products?.length > 0 ? (
            <div className="overflow-x-scroll overflow-y-scroll scrollbar-thin bg-gray-900 rounded-xl p-5">
              <Table aria-label='Inventario productos' 
                 classNames={{ base: "overflow-scroll scrollbar-thin", wrapper:"bg-transparent", table: "min-w-full divide-y divide-gray-700 bg-gray-900 rounded-xl",}}
                 sortDescriptor={productSortDescriptor}
                 onSortChange={setProductSortDescriptor}>
                <TableHeader columns={productsHeaderColumns} className=''>
                  {(column) => (
                    <TableColumn key={column.uid} allowsSorting={column.sortable}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={sortedProducts.slice(0,10)} emptyContent={"No se encontraron items"}>
                  {(product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-4 py-3 whitespace-nowrap">{product.name}</TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">{product.type}</TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">${Number(product.price.toString().replace(/[^0-9,]/g, '').replace(/\./g, '').replace(',', '.'))}</TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">{product.brand}</TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">{product.stock}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className='text-gray-400'>No cargan los productos. Verifique la hoja de cálculo.</p>
          )}
      </article>
      <article className="w-1/2 max-[800px]:w-full bg-black p-5 rounded-xl h-full">
        <h2 className="font-semibold text-xl mb-5">Últimos pedidos</h2>
        <div className="overflow-x-scroll overflow-y-scroll scrollbar-thin bg-gray-900 rounded-xl p-5">
          {orders?.length > 0 ? (
            <Table aria-label="Últimos pedidos" 
              classNames={{ base: "overflow-scroll scrollbar-thin", wrapper:"bg-transparent", table: "min-w-full divide-y divide-gray-700 bg-gray-900 rounded-xl",}}
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
            >
            <TableHeader columns={headerColumns} className=''>
             {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
            </TableHeader>
            <TableBody items={sortedOrders.slice(0, 10)} emptyContent={"No se encontraron órdenes."}>
              {(order) => (
                <TableRow key={order.payment_id}>
                  <TableCell>{order.payment_id}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${calculateTotal(order.items)}</TableCell>
                  <TableCell>${order.user_email}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-400">No hay pedidos recientes.</p>
        )}
      </div>
    </article>
      </aside>
    </section>
    
    <Link href={'/'} className='underline text-white text-lg my-5'>Volver atrás</Link>
  </section>
)
}

export default DashboardPage
