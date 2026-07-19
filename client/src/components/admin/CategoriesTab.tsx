import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { createCategory, updateCategory, deleteCategory } from "../../lib/api";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { AdminTabProps } from "./cloudinaryUpload";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function CategoriesTab({ showToast, showWriteError }: AdminTabProps) {
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
          <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">Filter tags for portfolio</p>
        </div>
        {!isAddingCategory && !editingCategory && (
          <Button onClick={startAddCategory} className="text-[10px] font-bold uppercase tracking-widest">
            <Plus className="w-3.5 h-3.5" /> New Category
          </Button>
        )}
      </div>

      {/* List Categories */}
      {!isAddingCategory && !editingCategory && (
        <div className="border divide-y">
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-4">
              <div>
                <h4 className="font-bold text-sm">{cat.name}</h4>
                <p className="text-xs text-muted-foreground font-mono">Slug ID: {cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditCategory(cat)}
                  className="size-7 border text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="size-7 border text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Category form */}
      {(isAddingCategory || editingCategory) && (
        <form onSubmit={handleSaveCategory} className="space-y-6 pt-4 border-t border-dashed max-w-md">
          <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-yellow-500">
            {isAddingCategory ? "Add Category" : "Edit Category"}
          </h3>
          <div>
            <Label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-muted-foreground">Category Name</Label>
            <Input
              type="text" required
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
            />
          </div>
          <div>
            <Label className="block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono text-muted-foreground">Category Slug</Label>
            <Input
              type="text" required
              value={categoryForm.slug}
              onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="text-xs font-bold uppercase">
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setIsAddingCategory(false); setEditingCategory(null); }} className="text-xs text-muted-foreground uppercase font-mono">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
