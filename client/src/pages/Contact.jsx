import { Alert, TextInput, Textarea, Button } from "flowbite-react";
import { useForm, ValidationError } from "@formspree/react";

const Contact = () => {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_ID);

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

        {state.succeeded && (
          <Alert color="success" className="mt-5">
            ההודעה נשלחה בהצלחה! תודה שפנית אלינו.
          </Alert>
        )}

        {!state.succeeded && (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 dark:text-white pb-2">
                אימייל
              </label>
              <TextInput
                type="email"
                id="email"
                name="email"
                required
                placeholder="כתובת אימייל"
                className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-800 dark:text-white pb-2">
                נושא
              </label>
              <TextInput
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="נושא ההודעה"
                className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <ValidationError
                prefix="Subject"
                field="subject"
                errors={state.errors}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-800 dark:text-white pb-2">
                הודעה
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="כתוב לנו"
                className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>

            <div className="flex justify-center">
              <Button
                gradientDuoTone="greenToBlue"
                type="submit"
                className="w-full max-w-xs mt-2"
                disabled={state.submitting}>
                שלח הודעה
              </Button>
            </div>
          </form>
        )}

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
