"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  async function fetchCustomers() {
    const data = await fetch(`${API_BASE}/customer`);
    const c = await data.json();
    setCustomers(c);
  }

  const createCustomer = (data) => {
    // Convert interests string to array
    if (data.interests) {
      data.interests = data.interests.split(',').map(interest => interest.trim());
    }
    
    const method = editingCustomer ? "PUT" : "POST";
    const url = editingCustomer ? `${API_BASE}/customer/${editingCustomer._id}` : `${API_BASE}/customer`;
    
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCustomers();
      setEditingCustomer(null);
      reset();
    });
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    setValue("name", customer.name);
    setValue("dateOfBirth", customer.dateOfBirth?.split('T')[0]); // Format date for input
    setValue("memberNumber", customer.memberNumber);
    setValue("interests", customer.interests?.join(', ') || '');
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    reset();
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${API_BASE}/customer/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64 ">
        <h2 className="text-xl font-bold m-4">{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleSubmit(createCustomer)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Date of Birth:</div>
            <div>
              <input
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Member Number:</div>
            <div>
              <input
                name="memberNumber"
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Interests:</div>
            <div>
              <input
                name="interests"
                type="text"
                placeholder="e.g. movies, football, gym, gaming"
                {...register("interests")}
                className="border border-black w-full"
              />
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value={editingCustomer ? "Update" : "Add"}
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              />
              {editingCustomer && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Customers ({customers.length})</h1>
        <ul className="list-disc ml-8">
          {
            customers.map((c) => (
              <li key={c._id} className={editingCustomer?._id === c._id ? "bg-yellow-100 p-2 rounded" : ""}>
                <button className="border border-black p-1/2 mr-1" onClick={deleteById(c._id)}>❌</button>
                <button className="border border-black p-1/2 mr-2" onClick={() => editCustomer(c)}>✏️</button>
                <Link href={`/customer/${c._id}`} className="font-bold">
                  {c.name}
                </Link>{" "}
                - Member #{c.memberNumber} - {c.interests?.join(', ')}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
