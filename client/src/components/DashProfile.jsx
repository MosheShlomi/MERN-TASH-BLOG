import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const [imageFileUploadProgress, setimageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setimageFileUploadError] = useState(null);
  const [imageFileUploading, setimageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [sitemapUpdated, setSitemapUpdated] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setimageFileUploading(true);
    setimageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setimageFileUploadError(
          "לא ניתן להעלות תמונה (הקובץ חייב להיות קטן מ-2MB)."
        );
        setimageFileUploadProgress(null);
        setImageFile(null);
        setimageFileUrl(null);
        setimageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageFileUrl(downloadURL);
          setFormData({ ...formData, profileAvatar: downloadURL });
          setimageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("לא בוצעו שינויים!");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("אנא המתן להעלאת התמונה!");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("פרופיל המשתמש עודכן בהצלחה!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(data.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const generateSitemap = async () => {
    setSitemapUpdated(false);
    try {
      const res = await fetch("api/generate-sitemap", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setSitemapUpdated(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">פרופיל</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress ? (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          ) : null}

          <img
            src={imageFileUrl || currentUser.profileAvatar}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            referrerPolicy="no-referrer"
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          dir="ltr"
        />
        <TextInput
          type="email"
          placeholder="אימייל"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          dir="ltr"
        />
        <TextInput
          type="password"
          placeholder="סיסמא חדשה(אם צריך)"
          autoComplete="on"
          id="password"
          onChange={handleChange}
          dir="ltr"
        />
        <Button
          gradientDuoTone="purpleToBlue"
          type="submit"
          outline
          disabled={loading || imageFileUploading}>
          {loading ? "טוען..." : "עדכן פרופיל"}
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          מחק חשבון
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          יציאה
        </span>
      </div>
      {currentUser.isAdmin && (
        <div className="w-full flex justify-center my-2">
          <Button
            onClick={generateSitemap}
            gradientDuoTone="purpleToBlue"
            type="button"
            outline
            disabled={sitemapUpdated}>
            {!sitemapUpdated ? " עדכן את ה-SITEMAP" : "ה-SITEMAP עודכן"}
          </Button>
        </div>
      )}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              האם אתה בטוח שברצונך למחוק את חשבונך?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                כן, בהחלט
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                לא, בטל
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
