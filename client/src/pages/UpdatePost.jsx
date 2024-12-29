import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CategorySelect from "../components/CategorySelect";

const UpdatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    category: [],
  });
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();
  const { postId } = useParams();

  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/get-post/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        } else {
          if (!currentUser.isAdmin && data.post.status === "rejected") {
            setPublishError("כבר אין לך גישה");
            return;
          }
          setPublishError(null);

          setFormData({
            ...data.post,
            category: data.post.category.map((cat) => cat._id),
          });
        }
      };
      if (currentUser) fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId, currentUser._id]);

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

  const handleUploadImage = async (type = "") => {
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
            if (type === "draft") {
              setFormData({
                ...formData,
                draftVersion: {
                  ...formData.draftVersion,
                  image: downloadURL,
                },
              });
            } else {
              setFormData({ ...formData, image: downloadURL });
            }
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
      const res = await fetch(`/api/post/update-post/${formData._id}`, {
        method: "PUT",
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

        navigate(`/post/preview/${formData._id}`);
      }
    } catch (error) {
      setPublishError("משהו נכשל בדרך.");
    }
  };

  const handleAcceptChanges = async (e) => {
    e.preventDefault();
    formData.applyDraft = true;
    handleSubmit(e);
  };

  const handleDenyChanges = async (e) => {
    e.preventDefault();
    formData.applyDraft = false;
    handleSubmit(e);
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">עדכן פוסט</h1>

      {/* If there is no draft version*/}
      {(currentUser.isAdmin ||
        !(
          formData.userId === currentUser._id &&
          formData.draftVersion &&
          formData.draftVersion.title
        )) && (
        <>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput
                type="text"
                placeholder="כותרת"
                id="title"
                required
                className="flex-1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                value={formData.title}
              />
              <CategorySelect
                selectedCategories={formData.category}
                setSelectedCategories={(newCategories) =>
                  setFormData({ ...formData, category: newCategories })
                }
                categories={categories}
              />
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
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {currentUser.isAdmin && (
              <Select
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                value={formData.status}>
                <option value="pending">ממתין לאישור</option>
                <option value="published">פורסם</option>
                <option value="rejected">נדחה</option>
              </Select>
            )}

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
              value={formData.content}
            />

            <Button type="submit" gradientDuoTone="purpleToPink">
              עדכן פוסט
            </Button>
            {publishError && (
              <Alert color="failure" className="mt-5">
                {publishError}
              </Alert>
            )}
          </form>
          {!formData.draftVersion && (
            <div>
              <h2 className="text-xl font-bold flex justify-center mt-8">
                תצוגה מקדימה
              </h2>
              <div
                className="max-w-3xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{ __html: formData.content }}></div>
            </div>
          )}
        </>
      )}

      {/* if there is also a draft version show them one after another */}
      {currentUser.isAdmin &&
        formData.draftVersion &&
        formData.draftVersion.title && (
          <form className="flex flex-col gap-4 mt-8">
            <h1 className="w-full text-center">שינויים חדשים של יוצר הפוסט</h1>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <TextInput
                type="text"
                placeholder="כותרת"
                id="title"
                required
                className="flex-1"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    draftVersion: {
                      ...formData.draftVersion,
                      title: e.target.value,
                    },
                  })
                }
                value={formData.draftVersion.title}
              />

              <CategorySelect
                selectedCategories={formData.draftVersion.category}
                setSelectedCategories={(newCategories) =>
                  setFormData({
                    ...formData,
                    draftVersion: {
                      ...formData.draftVersion,
                      category: newCategories,
                    },
                  })
                }
                categories={categories}
              />
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
                onClick={() => handleUploadImage("draft")}
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
            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData.draftVersion.image && (
              <img
                src={formData.draftVersion.image}
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
                    draftVersion: {
                      ...formData.draftVersion,
                      content: newValue,
                    },
                  });
                }
              }}
              value={formData.draftVersion.content}
            />
            <div className="flex gap-3">
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="flex-1"
                onClick={handleAcceptChanges}>
                הכנס שינויים
              </Button>
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                outline
                className="flex-1"
                onClick={handleDenyChanges}>
                דחה שינויים
              </Button>
            </div>
            {publishError && (
              <Alert color="failure" className="mt-5">
                {publishError}
              </Alert>
            )}
          </form>
        )}

      {/* If there is also a draft version and user is the creator of the post */}
      {!currentUser.isAdmin &&
        formData.draftVersion &&
        formData.draftVersion.title &&
        formData.userId === currentUser._id && (
          <>
            <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
              <h1 className="w-full text-center">שינויים חדשים שלי</h1>
              <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput
                  type="text"
                  placeholder="כותרת"
                  id="title"
                  required
                  className="flex-1"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      draftVersion: {
                        ...formData.draftVersion,
                        title: e.target.value,
                      },
                    })
                  }
                  value={formData.draftVersion.title}
                />
                <CategorySelect
                  selectedCategories={formData.draftVersion.category}
                  setSelectedCategories={(newCategories) =>
                    setFormData({
                      ...formData,
                      draftVersion: {
                        ...formData.draftVersion,
                        category: newCategories,
                      },
                    })
                  }
                  categories={categories}
                />
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
                  onClick={() => handleUploadImage("draft")}
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
              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}
              {formData.draftVersion.image && (
                <img
                  src={formData.draftVersion.image}
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
                      draftVersion: {
                        ...formData.draftVersion,
                        content: newValue,
                      },
                    });
                  }
                }}
                value={formData.draftVersion.content}
              />
              <Button type="submit" gradientDuoTone="purpleToPink">
                עדכן פוסט
              </Button>
              {publishError && (
                <Alert color="failure" className="mt-5">
                  {publishError}
                </Alert>
              )}
            </form>
          </>
        )}
    </div>
  );
};

export default UpdatePost;
