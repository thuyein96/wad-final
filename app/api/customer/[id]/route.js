import dbConnect from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET(_, { params }) {
  await dbConnect();
  const customer = await Customer.findById(params.id);
  if (!customer) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(customer);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const data = await req.json();
  const customer = await Customer.findByIdAndUpdate(params.id, data, { new: true });
  if (!customer) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(customer);
}

export async function DELETE(_, { params }) {
  await dbConnect();
  const customer = await Customer.findByIdAndDelete(params.id);
  if (!customer) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ success: true });
}
