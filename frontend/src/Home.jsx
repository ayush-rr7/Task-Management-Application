import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";

const Task = () => {
  // const [task, setTask] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Status: "",
  });

  const [task, setTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:3002/api";
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL); //`${}` this helps to embed variable inside string like API_URL+ "/api"
      setTask(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.Title.trim()) return;

      const res = editId
        ? await axios.put(`${API_URL}/${editId}`, formData) //plain object
        : await axios.post(API_URL, formData);

      // setTask((t) => [...t, res.data]);
      setTask((prev) =>
        editId
          ? prev.map((task) => (task._id === editId ? res.data : task))
          : [...prev, res.data],
      );

      // if(res.status===201)
      setFormData({
        Title: "",
        Description: "",
        Status: "",
      });
      setEditId(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEdit = (task) => {
    const { _id, __v, ...rest } = task;
    setFormData(rest);
    setEditId(_id);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      setTask((t) => t.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  // console.log(task[0].Title);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-5xl font-bold text-center   text-indigo-600 mb-8">
            📋 Task Planner
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="Title"
              value={formData.Title}
              placeholder="Enter task title"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            />
            <input
              name="Description"
              value={formData.Description}
              placeholder="Enter task description..."
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            />
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            >
              <option value="">Select Status</option>
              <option value="Pending ⏳">Pending⏳</option>
              <option value="In Progress 🔃">In Progress🔃</option>
              <option value="Completed ✅">Completed✅</option>
            </select>
            <button
              type="submit"
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105"
            >
              {editId ? "Update Task" : "Add Task"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    Title: "",
                    Description: "",
                    Status: "",
                  });
                }}
                 className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition font-semibold transform hover:scale-105"
                    >
               
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="space-y-4 p-6">
            {task.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p className="text-lg">
                  No tasks yet. Add one to get started! 🚀
                </p>
              </div>
            ) : (
              task.map((t) => (
                <div
                  key={t._id}
                  className="bg-linear-to-r from-slate-50 to-indigo-50 rounded-xl p-6 border-l-4 border-indigo-500 hover:shadow-lg transition transform hover:scale-102"
                >
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {t.Title}
                    </h3>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-600">{t.Description}</p>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {t.Status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg transition font-semibold transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition font-semibold transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
