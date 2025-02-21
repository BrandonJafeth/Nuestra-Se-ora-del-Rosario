import React, { useEffect, useState } from "react";
import { useNotes } from "../../hooks/useNotes"; // Hook para obtener las notas
import { useDeleteNote } from "../../hooks/useDeleteNote"; // Hook para eliminar notas
import LoadingSpinner from "./LoadingSpinner"; // Spinner opcional
import ConfirmationModal from "./ConfirmationModal"; // Modal de confirmación

const NotesComponent: React.FC = () => {
  const { data: notesData, isLoading, error } = useNotes();
  const { mutate: deleteNote, isLoading: isDeleting } = useDeleteNote();
  const [notes, setNotes] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null); // Estado para la nota a eliminar

  // Guardar las notas en el estado cuando estén disponibles
  useEffect(() => {
    if (notesData) {
      setNotes(notesData.data);
    }
  }, [notesData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error al cargar las notas: {String(error)}</p>;

  const handleDelete = () => {
    if (!confirmDelete) return;

    deleteNote(confirmDelete, {
      onSuccess: () => {
        setConfirmDelete(null);
      },
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Notas
      </h2>

      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No tienes notas pendientes.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id_Note}
              className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <strong className="text-blue-800 dark:text-blue-300 text-lg">{note.reason}</strong>
                <p className="text-gray-700 dark:text-gray-400 mt-1">{note.description}</p>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  <p>Fecha: {new Date(note.createdAt).toLocaleDateString("es-CR")} </p>
                </span>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                onClick={() => setConfirmDelete(note.id_Note)}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 Modal de Confirmación antes de eliminar */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta nota?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default NotesComponent;
