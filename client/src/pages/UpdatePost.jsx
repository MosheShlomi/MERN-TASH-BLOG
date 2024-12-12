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

const UpdatePost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();
  const { postId, postUserId } = useParams();

  useEffect(() => {
    if (!currentUser.isAdmin && postUserId !== currentUser._id) {
      navigate("/");
    }
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/get-posts?postId=${postId}&status=all`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormData(data.posts[0]);
          console.log(formData);
          
        }
      };
      if (currentUser) fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

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
      const res = await fetch(
        `/api/post/update-post/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("משהו נכשל בדרך.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">עדכן פוסט</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}>
            <option value="uncategorized">בחר קטגוריה</option>
            <option value="תשמש">תשמש</option>
            <option value="מיוחדת">מיוחדת</option>
            <option value="חוגר">חוגר</option>
          </Select>
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
          onChange={(value) => setFormData({ ...formData, content: value })}
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

      <div>
        <h2 className="text-xl font-bold flex justify-center mt-8">
          תצוגה מקדימה
        </h2>
        <div
          className="max-w-3xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: formData.content }}></div>
      </div>
    </div>
  );
};

export default UpdatePost;
