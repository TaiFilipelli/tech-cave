'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { /*Avatar*/ Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useOrders } from '@/orders/provider'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { Order } from '@/orders/order'
import { Product } from '@/product/products'
import { useProducts } from '@/product/provider'
// import { useSession } from 'next-auth/react'

const DashboardPage = () => {

  const [greeting, setGreeting] = useState('Hola');
  const orders:Order[] = useOrders();
  const products:Product[] = useProducts();
  // const { data: session } = useSession();

  type OrderStatus = 'approved' | 'pending' | 'rejected'

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
  'Procesador':'#6366F1', 
  'Motherboard':'#F59E0B', 
  'Memoria RAM':'#10B981', 
  'SSD/HDD':'#EF4444',
  'Placa de Video':'#8B5CF6', 
  'Fuente de Alimentacion':'#3B82F6',
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
  <section className='flex flex-col items-center justify-center p-10'>
    <section className='flex flex-col w-full p-5 mt-2 gap-5 rounded-2xl'>
      <aside className='w-full flex flex-row gap-5'>
        <article className='bg-black p-5 rounded-xl flex flex-col justify-center gap-5 w-1/2'>
          <div className='flex flex-row text-center gap-2 justify-center items-center'>
            {/* <Avatar src={session!.user.image!} size='lg'/> */}
            <h2 className='font-bold text-2xl mb-3'>{greeting}, admin!</h2>
          </div>
          <section className='flex flex-row gap-5 justify-between items-center text-center'>
            <div className='w-full flex flex-wrap'>
              <article className='text-xl'><span className='text-2xl font-bold'>{orders.length}</span> pedidos totales</article>
            </div>
            <div className='w-full flex flex-wrap'>
              <article className='text-xl'><span className='text-2xl font-bold'>{orders.length}</span> pedidos totales</article>
            </div>
          </section>
        </article>
      <article className='bg-black p-5 gap-5 w-[25%] rounded-xl'>
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
              <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => (<span className="text-sm text-gray-300">{value}</span>)}/>
              <Tooltip  formatter={(value, name) => { const label = typeof name === 'string' ? name : name.toString(); return [value, label.charAt(0).toUpperCase() + label.slice(1)];}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </article>
      <article className='bg-black p-5 gap-5 w-[25%] rounded-xl'>
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
      </aside>
      <aside className='w-full flex flex-row gap-2'>
        <article className='flex items-center justify-center bg-black p-5 rounded-xl w-1/2'>
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
      <article className='flex items-center justify-center bg-black p-5 rounded-xl w-1/2'>
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
      <aside className='w-full flex flex-row gap-2'>
        <article className='flex flex-col bg-black p-5 gap-5 w-1/2 h-[50rem] rounded-xl'>
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
            </DropdownMenu>
          </Dropdown>
        </header>
          {products?.length > 0 ? (
            <div className="overflow-x-scroll overflow-y-scroll scrollbar-thin">
              <table className="min-w-full divide-y divide-gray-700 bg-gray-900 rounded-xl">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marca</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{product.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${Number(product.price.toString().replace(/[^0-9,]/g, '').replace(/\./g, '').replace(',', '.'))}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{product.brand}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-400'>No cargan los productos. Verifique la hoja de cálculo.</p>
          )}
      </article>
      <article className='w-full bg-black p-5 rounded-xl'>
        <h2 className='font-semibold text-xl mb-5'>Últimos pedidos</h2>
        <div className='bg-gray-900 rounded-xl p-5'>
          {orders?.length > 0 ? (
            <div className="overflow-x-auto overflow-y-scroll scrollbar-thin">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.slice(0, 10).map((order, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">#{order.payment_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'approved' ? 'bg-green-500' : 
                          order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(order.date).toLocaleDateString()}, {new Date(order.date).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        ${order.items.reduce((total, item) => total + (Number(item.price.toString().replace(/[^0-9,]/g, '').replace(/\./g, '').replace(',', '.')) * item.cantidad), 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{order.user_email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-400'>No hay pedidos recientes.</p>
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
