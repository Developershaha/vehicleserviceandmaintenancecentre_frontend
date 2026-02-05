type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">Delete Vehicle</h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this vehicle?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-1.5
                       text-sm text-gray-700
                       hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-1.5
                       text-sm font-medium text-white
                       hover:bg-red-600
                       active:scale-95 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
