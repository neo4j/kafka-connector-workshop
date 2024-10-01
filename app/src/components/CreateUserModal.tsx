import React, { useState } from "react";

interface CreateUserModalProps {
  onCreate: (name: string, emailAddress: string) => void;
  onClose: () => void;
}

const CreateUserModal = ({ onCreate, onClose }: CreateUserModalProps) => {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-128">
        <h2 className="text-lg font-bold mb-4">Create User</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email address"
          className="w-full mb-2 p-2 border rounded"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => onCreate(name, emailAddress)}
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

export default CreateUserModal;
