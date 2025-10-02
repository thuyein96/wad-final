import Product from "@/models/Product";

export async function GET(request, { params }) {
  console.log(params)
  const id = params._id;
  const product = await Product.findById(id).populate("category");
  console.log({ product });
  return Response.json(product);
}

export async function PUT(request, { params }) {
  const id = params.id;
  const data = await request.json();
  const product = await Product.findByIdAndUpdate(id, data, { new: true }).populate("category");
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}
