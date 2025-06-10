'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useOrders } from '@/orders/provider'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, } from 'recharts'
import { Order } from '@/orders/order'

const DashboardPage = () => {

  const [greeting, setGreeting] = useState('Hola');
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const orders:Order[] = useOrders();

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

  console.log(orders);

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
  // HASTA ACÁ LA LÓGICA DE LOS ESTADOS DE PEDIDOS PARA PIECHART.
  interface LineChartData {
  year: string;
  orders: number;
}

const getOrdersPerYear = (orders:Order[]): LineChartData[] => {
  const yearCount: Record<string, number> = {};

  orders.forEach(order => { const year = new Date(order.date).getFullYear().toString(); yearCount[year] = (yearCount[year] || 0) + 1;});

  return Object.entries(yearCount).map(([year, orders]) => ({ year, orders })).sort((a, b) => Number(a.year) - Number(b.year));
};

const lineData = getOrdersPerYear(orders || []);

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
    <h1 className='font-bold text-3xl mb-3'>{greeting}, admin!</h1>
    <p className='text-lg text-center'>Bienvenido al panel de administración de {`Tech's Cave`}. Aquí puedes administrar los productos de la tienda.</p>
    
    <section className='flex flex-row w-full p-5 mt-2 gap-5 rounded-2xl'>
      <aside className='w-full flex flex-col gap-5'>
      <article className='flex flex-col bg-black p-5 gap-5 w-full rounded-xl'>
        <Button as={Link} href='/dashboard/add' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faPlus} size='lg'/>}>
          Agregar producto
        </Button>
        <Button as={Link} href='/dashboard/edit' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faPencil} size='lg'/>}>
          Editar producto
        </Button>
        <Button as={Link} href='/dashboard/delete' className='bg-gradient-to-br from-pink-600 to-yellow-600 text-white font-semibold w-full' startContent={<FontAwesomeIcon icon={faTrash} size='lg'/>}>
          Eliminar producto
        </Button>
      </article>
      <article className='bg-black p-5 gap-5 w-full rounded-xl'>
      <div className="mt-4 rounded-2xl">
        <h3 className="text-center font-medium mb-3 text-2xl">Estados de Pedidos</h3>
        <div className="h-64">
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
      </aside>
      <aside className='w-full flex flex-col gap-2'>
      <article className='w-full flex items-center justify-center bg-black p-5 rounded-xl'>
        <div className="bg-gray-900 p-5 w-full rounded-xl">
          <h3 className="text-center font-medium mb-3 text-white text-xl">Órdenes por Año</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#ccc" />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#0088FE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
      </article>
      <article className='w-full bg-black p-5 rounded-xl'>
        <div className='bg-gray-900 rounded-xl p-5'>
          <h2 className='font-semibold text-xl mb-5'>Últimos pedidos</h2>
          {orders?.length > 0 ? (
            <div className="overflow-x-auto overflow-y-scroll">
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
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.payment_id}>
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
                        ${order.items.reduce((total, item) => total + (Number(item.price.toString().replace(/[^0-9.,]/g, '').replace(',', '.')) * item.quantity), 0).toFixed(2)}
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
