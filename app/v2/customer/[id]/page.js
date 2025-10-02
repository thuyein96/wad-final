export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetch(`${API_BASE}/customer/${params.id}`, { cache: "no-store" });
  const customer = await data.json();
  console.log({ customer });
  // const id = params.id;
  if (!customer || customer.error) {
    return (
      <div className="m-4">
        <h1 className="text-2xl font-bold text-red-600">Customer Not Found</h1>
        <p>The requested customer could not be found.</p>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="font-bold text-xl text-blue-800 mb-2">{customer.name}</p>
        <div className="space-y-2">
          <p><strong>Member Number:</strong> #{customer.memberNumber}</p>
          <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Interests:</strong> {customer.interests?.length > 0 ? customer.interests.join(', ') : 'None specified'}</p>
        </div>
      </div>
    </div>
  );
}
