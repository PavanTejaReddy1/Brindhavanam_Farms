"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, X } from "lucide-react";
import { usePolling } from "@/lib/hooks/usePolling";

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  shortDescription: string;
  category: string;
  variants: Array<{ id: string; label: string; pricePerDay: number }>;
  stock: number;
  stockStatus: string;
  featured: boolean;
  active: boolean;
  displayPrice: string;
  sizes: string[];
}

export default function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    category: "dairy",
    image: "",
    stock: 100,
    featured: false,
    active: true,
    variants: [{ id: "", label: "", pricePerDay: 0 }],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth("/api/products");
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use polling to auto-refresh products every 30 seconds
  usePolling(fetchProducts, { interval: 30000, immediate: false });

  const handleToggle = async (productId: string, currentActive: boolean) => {
    try {
      await fetchWithAdminAuth(`/api/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ active: !currentActive }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await fetchWithAdminAuth(`/api/products/${productId}`, {
          method: "DELETE",
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      category: "dairy",
      image: "",
      stock: 100,
      featured: false,
      active: true,
      variants: [{ id: "", label: "", pricePerDay: 0 }],
    });
    setShowAddModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
      active: product.active,
      variants: product.variants,
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || formData.name.length < 2) {
        alert("Product name must be at least 2 characters");
        return;
      }
      if (!formData.slug || formData.slug.length < 2) {
        alert("Product slug is required");
        return;
      }
      if (!formData.description || formData.description.length < 10) {
        alert("Description must be at least 10 characters");
        return;
      }
      if (!formData.shortDescription || formData.shortDescription.length < 5) {
        alert("Short description must be at least 5 characters");
        return;
      }
      if (!formData.variants || formData.variants.length === 0) {
        alert("At least one variant is required");
        return;
      }
      const invalidVariant = formData.variants.find(v => !v.id || !v.label || v.pricePerDay === undefined);
      if (invalidVariant) {
        alert("All variants must have ID, label, and price per day");
        return;
      }

      if (editingProduct) {
        await fetchWithAdminAuth(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await fetchWithAdminAuth("/api/products", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setShowAddModal(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to save product");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        alert("Admin not authenticated");
        return;
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { id: "", label: "", pricePerDay: 0 }],
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 100) return "Low Stock";
    return "In Stock";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-700";
      case "Low Stock": return "bg-yellow-100 text-yellow-700";
      case "Out of Stock": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading products...</p>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#10271C]">Products</h1>
              <p className="text-[#666]">Manage all products and inventory</p>
            </div>
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10271C] text-white text-sm font-medium hover:bg-[#0F291D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Products Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Sizes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Active</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr key={product._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-[#10271C]">{product.name}</p>
                          <p className="text-xs text-[#666]">#{product._id?.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">{product.displayPrice}</td>
                        <td className="px-6 py-4 text-sm text-[#666]">{product.sizes?.join(", ") || "-"}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full ${getStockColor(stockStatus)}`}>
                            {stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleToggle(product._id, product.active)}>
                            {product.active ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors"
                            >
                              <Edit className="w-4 h-4 text-[#10271C]" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product._id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-[#666]">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold text-[#10271C]">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-[#666]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Product Image</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                    />
                    {uploading && <p className="text-sm text-[#666]">Uploading...</p>}
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10271C] mb-2">Variants</label>
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="ID (e.g., 500ml)"
                        value={variant.id}
                        onChange={(e) => updateVariant(index, "id", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g., 500ml)"
                        value={variant.label}
                        onChange={(e) => updateVariant(index, "label", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="number"
                        placeholder="Price/day"
                        value={variant.pricePerDay}
                        onChange={(e) => updateVariant(index, "pricePerDay", parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 rounded-lg border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                      />
                      {formData.variants.length > 1 && (
                        <button
                          onClick={() => removeVariant(index)}
                          className="p-2 rounded-lg hover:bg-red-50"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addVariant}
                    className="text-sm text-[#D4AF37] font-medium hover:underline"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-[#10271C]">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-[#10271C]">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[#10271C]/10 text-[#10271C] font-medium hover:bg-[#F8F6F0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#10271C] text-white font-medium hover:bg-[#0F291D] transition-colors"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
