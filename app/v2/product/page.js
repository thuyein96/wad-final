"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import ProductForm from "../components/forms/ProductForm";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  async function fetchProducts() {
    const data = await fetch(`${APIBASE}/product`);
    const p = await data.json();
    setProducts(p);
  }

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const onProductSaved = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${APIBASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <h2 className="text-xl font-bold m-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <div className="m-4">
            <ProductForm 
              product={editingProduct} 
              onSave={onProductSaved}
              onCancel={cancelEdit}
            />
          </div>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Products ({products.length})</h1>
          <ul className="list-disc ml-8">
            {
              products.map((p) => (
                <li key={p._id} className={editingProduct?._id === p._id ? "bg-yellow-100 p-2 rounded" : ""}>
                  <button className="border border-black p-1/2 mr-1" onClick={() => editProduct(p)}>📝</button>
                  <button className="border border-black p-1/2 mr-2" onClick={deleteById(p._id)}>❌</button>
                  <Link href={`/v2/product/${p._id}`} className="font-bold">
                    {p.name}
                  </Link>{" "}
                  - {p.description} - ${p.price}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
