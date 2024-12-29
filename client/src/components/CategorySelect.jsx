import { Button } from "flowbite-react";
import React, { useRef, useState, useEffect } from "react";

const CategorySelect = ({
  selectedCategories,
  setSelectedCategories,
  categories,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        className="w-full"
        gradientDuoTone="purpleToPink"
        size="sm"
        onClick={() => setDropdownOpen(!dropdownOpen)}>
        בחר קטגוריות ↓
      </Button>
      {dropdownOpen && (
        <div className="absolute z-10 bg-stone-50 dark:border-gray-700 dark:bg-gray-800 border rounded shadow-md p-2 w-full max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category._id} className="block px-2 py-1 border-b border-gray-600">
              <input
                type="checkbox"
                className="ml-2"
                value={category._id}
                checked={selectedCategories.includes(category._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([
                      ...selectedCategories,
                      category._id,
                    ]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((id) => id !== category._id)
                    );
                  }
                }}
              />
              {category.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
