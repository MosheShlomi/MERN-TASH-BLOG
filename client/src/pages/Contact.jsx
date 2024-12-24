import { useState } from "react";
import { Alert, TextInput, Textarea, Button } from "flowbite-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [updateUserSuccess, setUpdateUserSuccess] = useState("");
  const [updateUserError, setUpdateUserError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      setUpdateUserSuccess("ההודעה נשלחה בהצלחה!");
      setUpdateUserError("");
      setFormData({ email: "", subject: "", message: "" });
    } else {
      setUpdateUserError("הייתה שגיאה בשליחת ההודעה, אנא נסה שוב.");
      setUpdateUserSuccess("");
    }
  };

  const handleSimpleSubmit = (e) => {
    e.preventDefault();

    // Create the mailto URL with query parameters
    const mailtoLink = `mailto:tashblog7@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      formData.message
    )}%0A%0AFrom: ${encodeURIComponent(formData.email)}`;

    // Open the user's email client with the pre-filled data
    window.location.href = mailtoLink;

    setFormData({ email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
          צור קשר
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          יש לך רעיונות לשיפור הבלוג? רוצה לשלוח לנו הצעה או שאלה? נשמח לשמוע
          ממך!
        </p>

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

        <form className="space-y-6" onSubmit={handleSimpleSubmit}>
          <div>
            <TextInput
              type="email"
              placeholder="כתובת אימייל"
              label="אימייל"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <TextInput
              type="text"
              placeholder="נושא ההודעה"
              label="נושא"
              required
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <Textarea
              placeholder="הודעה"
              label="כתוב לנו"
              rows={5}
              required
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-center">
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              className="w-full max-w-xs">
              שלח הודעה
            </Button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            דרכי התקשרות נוספות
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            אם אתה מעדיף לפנות אלינו דרך דרכים אחרות, תוכל לשלוח לנו הודעה:
          </p>
          <div className="mt-4 space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              📧 <span className="font-semibold">אימייל:</span>{" "}
              tashblog7@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
