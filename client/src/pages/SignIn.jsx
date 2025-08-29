import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  removeErrors
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    dispatch(removeErrors());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white p-3">
        התחברות
      </h1>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500  rounded-lg text-white">
              ת"ש
            </span>{" "}
            בלוג
          </Link>
          <p className="text-sm mt-5">
            התחברו עכשיו כדי ליהנות מגישה מלאה לכל הפוסטים ולהגיב, לשתף תוכן
            ולהצטרף לקהילה שלנו!
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="אימייל" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="סיסמא" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                autoComplete="on"
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">טוען...</span>
                </>
              ) : (
                "התחברות"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>אין לך עדיין חשבון?</span>
            <Link to="/sign-up" className="text-blue-500">
              הרשמה
            </Link>
          </div>
          {errorMessage && (
            <div dir="ltr">
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
