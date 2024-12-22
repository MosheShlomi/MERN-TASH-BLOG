import React, { useState, useEffect } from "react";
import { Button, Table, TextInput } from "flowbite-react";

const DashCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/get-categories`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.error("שגיאה בשליפת הקטגוריות:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data]);
        setNewCategory("");
      }
    } catch (error) {
      console.error("שגיאה בהוספת קטגוריה:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setCategories(categories.filter((category) => category._id !== id));
      }
    } catch (error) {
      console.error("שגיאה במחיקת קטגוריה:", error);
    }
  };

  const updateCategory = async (id) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName }),
      });

      if (res.ok) {
        setCategories(
          categories.map((category) =>
            category._id === id ? { ...category, name: editedName } : category
          )
        );
        setEditingCategory(null);
        setEditedName("");
      } else {
        const data = await res.json();
        console.error(data.message || "שגיאה בעדכון קטגוריה");
      }
    } catch (error) {
      console.error("שגיאה בעדכון קטגוריה:", error);
    }
  };

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4 text-right">ניהול קטגוריות</h1>

      <div className="mb-3 flex gap-2 border-b border-slate-600">
        <TextInput
          type="text"
          placeholder="הוסף קטגוריה חדשה"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 rounded-md w-64"
        />

        <Button
          type="button"
          size="sm"
          gradientDuoTone="purpleToBlue"
          onClick={addCategory}
          className="m-2 rounded-md hover:bg-blue-700">
          הוסף
        </Button>
      </div>

      {categories && (
        <>
          <Table hoverable className="shadow-md text-right mt-3">
            <Table.Head>
              <Table.HeadCell>שם קטגוריה</Table.HeadCell>
              <Table.HeadCell colSpan={2} className="text-center">
                פעולות
              </Table.HeadCell>
            </Table.Head>
            {categories.map((category) => (
              <Table.Body key={category._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {editingCategory === category._id ? (
                      <>
                        <TextInput
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="rounded-md w-32"
                        />
                      </>
                    ) : (
                      category.name
                    )}
                  </Table.Cell>
                  {editingCategory === category._id ? (
                    <>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            updateCategory(category._id);
                          }}
                          className="text-teal-500 hover:underline cursor-pointer">
                          שמור
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setEditingCategory(null);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer">
                          ביטול
                        </span>
                      </Table.Cell>
                    </>
                  ) : (
                    <>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setEditingCategory(category._id);
                            setEditedName(category.name);
                          }}
                          className="text-teal-500 hover:underline cursor-pointer">
                          עריכה
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            deleteCategory(category._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer">
                          מחיקה
                        </span>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      )}
    </div>
  );
};

export default DashCategories;
