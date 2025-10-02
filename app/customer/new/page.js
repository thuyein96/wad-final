import CustomerForm from '../../v2/components/forms/CustomerForm';

export default function NewCustomerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Customer</h1>
      <CustomerForm />
    </div>
  );
}