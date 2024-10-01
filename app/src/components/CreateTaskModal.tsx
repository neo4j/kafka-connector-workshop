import React, { useState } from "react";

interface CreateTaskModalProps {
  onCreate: (title: string, description: string) => void;
  onClose: () => void;
}

const CreateTaskModal = ({ onCreate, onClose }: CreateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-128">
        <h2 className="text-lg font-bold mb-4">Create Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full mb-2 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => onCreate(title, description)}
        >
          Create
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTaskModal;
