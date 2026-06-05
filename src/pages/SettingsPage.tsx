import { Button } from '../components/common/Button';

export function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Workspace settings</h1>
        <p className="mt-1 text-sm text-slate-500">Edit workspace identity, member invitations, roles, and project defaults.</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">Workspace name<input className="h-10 rounded-md border border-slate-200 px-3 font-normal outline-none focus:border-teal-600" defaultValue="Acme Product" /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Description<textarea className="min-h-28 rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-teal-600" defaultValue="Internal product, engineering, and launch collaboration." /></label>
          <div className="flex justify-end"><Button>Save changes</Button></div>
        </div>
      </div>
    </div>
  );
}
