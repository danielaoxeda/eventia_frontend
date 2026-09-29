interface RegisterMessagesProps {
  error: string;
  success: string;
}

export default function RegisterMessages({
  error,
  success,
}: RegisterMessagesProps) {
  return (
    <>
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}
    </>
  );
}