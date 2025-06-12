export interface Order{
    payment_id:string,
    status:string,
    user_email:string,
    date: string,
    items: OrderItem[],
}

export interface OrderItem{
    id: string,
    name: string,
    price: string,
    cantidad: number,
    type:string,
}