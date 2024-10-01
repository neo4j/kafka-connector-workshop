import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import UserList from "./components/UserList";
import UserService, { User } from "./services/UserService";
import Login from "./components/Login";
import TaskService from "./services/TaskService";

const userService = new UserService();
const taskService = new TaskService();

const App = () => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"board" | "users">("board");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    userService
      .fetch()
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogin = (emailAddress: string) => {
    userService
      .lookup(emailAddress)
      .then((user) => {
        setActiveUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    setActiveUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="bg-neo4j-bg-color min-h-screen">
      <div className="px-16">
        <img src="/neo4j-logo.svg" alt="App Logo" className="h-36 w-36 mb-4" />
      </div>
      <div className="container mx-auto w-2/3">
        {activeUser ? (
          <div>
            <div className="flex justify-between mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("board")}
                  className={`px-4 py-2 mr-2 ${activeTab === "board" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Board
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-2 ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Users
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>

            <div className="mt-8">
              {activeTab === "board" && (
                <Board
                  users={users}
                  activeUser={activeUser}
                  taskService={taskService}
                />
              )}
              {activeTab === "users" && (
                <UserList
                  users={users}
                  setUsers={setUsers}
                  userService={userService}
                />
              )}
            </div>
          </div>
        ) : (
          <Login handleLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default App;
