"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import CustomerForm from "../components/forms/CustomerForm";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  async function fetchCustomers() {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    setCustomers(c);
  }

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
  };

  const onCustomerSaved = () => {
    fetchCustomers();
    setEditingCustomer(null);
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <h2 className="text-xl font-bold m-4">{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
          <div className="m-4">
            <CustomerForm 
              customer={editingCustomer} 
              onSave={onCustomerSaved}
              onCancel={cancelEdit}
            />
          </div>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Customers ({customers.length})</h1>
          <ul className="list-disc ml-8">
            {
              customers.map((c) => (
                <li key={c._id} className={editingCustomer?._id === c._id ? "bg-yellow-100 p-2 rounded" : ""}>
                  <button className="border border-black p-1/2 mr-1" onClick={() => editCustomer(c)}>📝</button>
                  <button className="border border-black p-1/2 mr-2" onClick={deleteById(c._id)}>❌</button>
                  <Link href={`/v2/customer/${c._id}`} className="font-bold">
                    {c.name}
                  </Link>{" "}
                  - Member #{c.memberNumber} - {c.interests?.join(', ')}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
