import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { createCategory, updateCategory, deleteCategory } from "../../lib/api";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";

export default function CategoriesTab({ showToast, showWriteError }: AdminTabProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { categories, refetch } = useData();

  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  const startAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "" });
  };

  const startEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setIsAddingCategory(false);
    setCategoryForm({ name: cat.name, slug: cat.slug });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isAddingCategory) {
        await createCategory(categoryForm);
        showToast("Category created successfully");
      } else {
        await updateCategory(editingCategory.id, categoryForm);
        showToast("Category updated successfully");
      }
      setIsAddingCategory(false);
      setEditingCategory(null);
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to " + (isAddingCategory ? "create" : "update") + " category: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      showToast("Category deleted successfully");
      await refetch();
    } catch (e: any) {
      showWriteError("Failed to delete category: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tighter uppercase font-sans">Portfolio Categories</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">Filter tags for portfolio</p>
        </div>
        {!isAddingCategory && !editingCategory && (
          <button
            onClick={startAddCategory}
            className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border cursor-pointer transition-all ${
              isLight ? "bg-black text-white border-black" : "bg-white text-black border-white"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> New Category
          </button>
        )}
      </div>

      {/* List Categories */}
      {!isAddingCategory && !editingCategory && (
        <div className="border border-white/5 divide-y divide-white/5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-4">
              <div>
                <h4 className="font-bold text-sm">{cat.name}</h4>
                <p className="text-xs text-gray-500 font-mono">Slug ID: {cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditCategory(cat)}
                  className="p-1.5 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Category form */}
      {(isAddingCategory || editingCategory) && (
        <form onSubmit={handleSaveCategory} className="space-y-6 pt-4 border-t border-dashed border-white/10 max-w-md">
          <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-yellow-500">
            {isAddingCategory ? "Add Category" : "Edit Category"}
          </h3>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Name</label>
            <input
              type="text" required
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-gray-400">Category Slug</label>
            <input
              type="text" required
              value={categoryForm.slug}
              onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              className={`w-full p-3 border text-sm focus:outline-none rounded-none ${isLight ? "bg-zinc-50 border-black/10 focus:border-black" : "bg-zinc-900 border-white/10 focus:border-white"}`}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className={`px-4 py-2 text-xs font-bold uppercase ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
              {submitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => { setIsAddingCategory(false); setEditingCategory(null); }} className="text-xs text-gray-500 hover:text-white uppercase font-mono">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
