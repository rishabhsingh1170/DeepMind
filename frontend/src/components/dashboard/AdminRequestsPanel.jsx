import { CheckCircle2, XCircle, Users } from "lucide-react";

export default function AdminRequestsPanel({
  isLoading,
  pendingRequests,
  reviewError,
  reviewMessage,
  reviewingRequestId,
  getUserLabel,
  onApprove,
  onDeny,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Users className="h-5 w-5 text-indigo-600" />
        Pending Access Requests
      </h3>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading requests...</p>
      ) : pendingRequests.length === 0 ? (
        <p className="text-sm text-slate-500">No pending requests right now.</p>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request._id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {getUserLabel(request.employee_id)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Requested at: {String(request.requested_at || "")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(request._id)}
                    disabled={reviewingRequestId === request._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeny(request._id)}
                    disabled={reviewingRequestId === request._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" />
                    Deny
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewError && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {reviewError}
        </p>
      )}
      {reviewMessage && (
        <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {reviewMessage}
        </p>
      )}
    </div>
  );
}
