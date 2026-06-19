import { useState } from "react";
import { useStackList, useCreateStack, useUpdateStack, useDeleteStack } from "../hooks/useAdmin";
import { Card } from "@/components/ui/Card";
import { Skeleton, SkeletonLine } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

interface FormState {
  name: string;
  description: string;
}

const emptyForm: FormState = { name: "", description: "" };

export default function AdminStackListPage() {
  const { t } = useI18n();
  const { data: stacks, isLoading } = useStackList();
  const createStack = useCreateStack();
  const updateStack = useUpdateStack();
  const deleteStack = useDeleteStack();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  function handleCreate() {
    if (!form.name.trim()) return;
    createStack.mutate(
      { name: form.name.trim(), description: form.description.trim() || undefined },
      {
        onSuccess: () => { setShowForm(false); setForm(emptyForm); },
      },
    );
  }

  function startEdit(stack: { id: number; name: string; description?: string }) {
    setEditingId(stack.id);
    setEditForm({ name: stack.name, description: stack.description || "" });
  }

  function handleUpdate(id: number) {
    if (!editForm.name.trim()) return;
    updateStack.mutate(
      { stackId: id, payload: { name: editForm.name.trim(), description: editForm.description.trim() || undefined } },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleDelete(id: number) {
    deleteStack.mutate(id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div className="mx-auto max-w-container px-gutter py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-lg-mobile italic text-text-primary md:text-display-lg">
            {t("admin.stacks.title")}
          </h1>
          <p className="mt-2 font-body text-body-lg text-text-secondary">
            {t("admin.stacks.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-body text-label-caps uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("common.cancel") : t("admin.stacks.addStack")}
        </button>
      </div>

      {showForm && (
        <Card className="mt-6 p-6">
          <h2 className="font-display text-headline-md italic text-text-primary">{t("admin.stacks.newStack")}</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block font-body text-label-caps uppercase tracking-widest text-text-secondary mb-1">{t("admin.stacks.nameRequired")}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("admin.stacks.namePlaceholder")}
                className="w-full rounded-lg border border-border bg-surface p-3 font-body text-body-md text-text-primary placeholder:text-text-disabled outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block font-body text-label-caps uppercase tracking-widest text-text-secondary mb-1">{t("admin.stacks.description")}</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t("admin.stacks.descriptionPlaceholder")}
                className="w-full rounded-lg border border-border bg-surface p-3 font-body text-body-md text-text-primary placeholder:text-text-disabled outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!form.name.trim() || createStack.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-body text-label-caps uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {createStack.isPending ? t("common.loading") : t("admin.stacks.create")}
            </button>
          </div>
        </Card>
      )}

      <div className="mt-8">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                <SkeletonLine className="flex-1" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!stacks || stacks.length === 0) && (
          <Card className="p-8 text-center">
            <p className="font-body text-body-lg text-text-secondary">{t("admin.stacks.noStacks")}</p>
          </Card>
        )}

        {stacks && stacks.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-container-low">
                  <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">ID</th>
                  <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("auth.name")}</th>
                  <th className="px-4 py-3 text-left font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.description")}</th>
                  <th className="px-4 py-3 text-right font-body text-label-caps uppercase tracking-widest text-text-secondary">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {stacks.map((stack) => (
                  <tr key={stack.id} className="border-b border-border last:border-b-0 hover:bg-surface-container-low">
                    {editingId === stack.id ? (
                      <>
                        <td className="px-4 py-3 font-body text-code-sm text-text-secondary">{stack.id}</td>
                        <td className="px-4 py-3">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full rounded border border-border bg-surface p-2 font-body text-body-md text-text-primary outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full rounded border border-border bg-surface p-2 font-body text-body-md text-text-primary outline-none focus:border-primary"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-border p-2 text-text-secondary hover:bg-surface-dim transition-colors"
                              title={t("common.cancel")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdate(stack.id)}
                              disabled={!editForm.name.trim() || updateStack.isPending}
                              className="rounded-lg bg-primary p-2 text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                              title={t("common.save")}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-body text-code-sm text-text-secondary">{stack.id}</td>
                        <td className="px-4 py-3 font-body text-body-md font-medium text-text-primary">{stack.name}</td>
                        <td className="px-4 py-3 font-body text-body-md text-text-secondary">{stack.description || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(stack)}
                              className="rounded-lg border border-border p-2 text-text-secondary hover:bg-surface-dim transition-colors"
                              title={t("common.edit")}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: stack.id, name: stack.name })}
                              className="rounded-lg border border-border p-2 text-error hover:bg-error/10 transition-colors"
                              title={t("common.delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title={t("admin.stacks.deleteStack")}
      >
        <p className="font-body text-body-md text-text-secondary">
          {t("admin.stacks.deleteConfirm").replace("{name}", deleteTarget?.name || "")}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="rounded-lg border border-border px-4 py-2.5 font-body text-label-caps uppercase tracking-wider text-text-secondary hover:bg-surface-dim transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
            disabled={deleteStack.isPending}
            className="rounded-lg bg-error px-4 py-2.5 font-body text-label-caps uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {deleteStack.isPending ? t("common.loading") : t("common.delete")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
