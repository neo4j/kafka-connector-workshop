import React, { useState } from "react";
import UserService, { User } from "../services/UserService";
import neo4j from "neo4j-driver";
import CreateUserModal from "./CreateUserModal";

interface UserListProps {
  users: User[];
  setUsers: (users: User[]) => void;
  userService: UserService;
}

const UserList = ({ users, setUsers, userService }: UserListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTimestamp = (timestamp: any) => {
    const numericTimestamp = neo4j.isInt(timestamp)
      ? timestamp.toNumber()
      : timestamp;
    return new Date(numericTimestamp).toLocaleString();
  };

  const handleCreateUser = (name: string, emailAddress: string) => {
    userService
      .create(name, emailAddress)
      .then((createdUser) => {
        setIsModalOpen(false);
        setUsers([...users, createdUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex-col justify-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Create User
      </button>
      <div>
        <h2 className="text-lg text-white font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.emailAddress}
              className="flex justify-between space-x-4 bg-gray-800 p-4 rounded-lg border border-gray-600"
            >
              <div className="text-white font-medium">{user.name}</div>
              <div className="text-gray-400">{user.emailAddress}</div>
              <div className="text-gray-500">
                {formatTimestamp(user.creationTimestamp)}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <CreateUserModal
          onCreate={handleCreateUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserList;
