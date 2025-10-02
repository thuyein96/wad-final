import CustomerForm from '../../v2/components/forms/CustomerForm';

async function fetchCustomer(id) {
  const res = await fetch(`/api/customer/${id}`);
  return res.json();
}

export default async function CustomerDetailPage({ params }) {
  const customer = await fetchCustomer(params.id);
  if (!customer || customer.error) return <div>Customer not found</div>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
      <div className="mb-4 space-y-2">
        <div><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</div>
        <div><strong>Member Number:</strong> {customer.memberNumber}</div>
        <div><strong>Interests:</strong> {customer.interests?.join(', ') || 'None'}</div>
      </div>
      <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
      <CustomerForm customer={customer} />
    </div>
  );
}
