import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET() {
  await dbConnect();
  const customers = await Customer.find();
  return Response.json(customers);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const customer = new Customer(data);
  await customer.save();
  return Response.json(customer, { status: 201 });
}
