import clientPromise from "@/lib/mongodb";
import { unstable_cache } from "next/cache";
import { Order } from "./order";

export async function fetchOrders(): Promise<Order[]> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const ordersCollection = db.collection<Order>("orders");

  const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();

  return orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
  }));
}

export const getCachedOrders = unstable_cache(
  fetchOrders,
  ["orders"],
  { revalidate: 1800 }
);
