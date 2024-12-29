import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    category: [],
  });

  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
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

  const navigate = useNavigate();

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

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("אנא בחר תמונה!");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("העלאת תמונה נכשלה");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("העלאת תמונה נכשלה");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/preview/${data._id}`);
      }
    } catch (error) {
      setPublishError("משהו נכשל בדרך.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">צור פוסט</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="כותרת"
            id="title"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
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
              <div className="absolute z-10 bg-white dark:border-gray-700 dark:bg-gray-800 border rounded shadow-md p-2 w-full max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category._id} className="block px-2 py-1 border-b border-gray-600">
                    <input
                      type="checkbox"
                      className="ml-2"
                      value={category._id}
                      checked={
                        formData.category?.includes(category._id) || false
                      } // Default to false if undefined
                      onChange={(e) => {
                        const selectedCategories = formData.category || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            category: [...selectedCategories, category._id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            category: selectedCategories.filter(
                              (id) => id !== category._id
                            ),
                          });
                        }
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className="w-16 h-16 ">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "העלה תמונה"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded image"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="רשום משהו..."
          className="h-72 mb-12"
          required
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
          ]}
          modules={modules}
          onChange={(newValue, delta, source) => {
            if (source === "user") {
              setFormData({
                ...formData,
                content: newValue,
              });
            }
          }}
        />

        <Button type="submit" gradientDuoTone="purpleToPink">
          פרסם
        </Button>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
      {formData.content && (
        <div>
          <h2 className="text-xl font-bold flex justify-center mt-8">
            תצוגה מקדימה
          </h2>
          <div
            className="max-w-3xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: formData.content }}></div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
