import { ShieldCheck, XCircle } from "lucide-react";

export default function AdminApprovedAccessPanel({
  approvedRequests,
  accessError,
  accessMessage,
  revokingEmployeeId,
  getUserLabel,
  onRevoke,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
        <ShieldCheck className="h-5 w-5 text-indigo-600" />
        Approved Access
      </h3>

      {approvedRequests.length === 0 ? (
        <p className="text-sm text-slate-500">No approved users yet.</p>
      ) : (
        <div className="space-y-3">
          {approvedRequests.map((request) => (
            <div
              key={request._id}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-emerald-900">
                    {getUserLabel(request.employee_id)}
                  </p>
                  <p className="text-xs text-emerald-800">
                    Approved at: {String(request.reviewed_at || "")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRevoke(request)}
                  disabled={revokingEmployeeId === request.employee_id}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                >
                  <XCircle className="h-4 w-4" />
                  {revokingEmployeeId === request.employee_id
                    ? "Revoking..."
                    : "Revoke Access"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {accessError && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {accessError}
        </p>
      )}
      {accessMessage && (
        <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {accessMessage}
        </p>
      )}
    </div>
  );
}
