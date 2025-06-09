import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { unstable_cache } from "next/cache";
import { Order } from "@/orders/order";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const ordersCollection = db.collection("orders");

        const result = await ordersCollection.insertOne(body);

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

export async function GET(): Promise<Order[]> {
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
    GET,
    ["orders"],
    {revalidate: 1800}
);