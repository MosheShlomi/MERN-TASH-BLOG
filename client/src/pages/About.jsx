import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container max-w-6xl mx-auto justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:text-right text-center">
          אודות הבלוג
        </h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          הבלוג הזה נועד לתת מידע ועדכונים חשובים לכל חייל וחיילת בצה"ל שקשור
          לת״ש. כאן תוכלו למצוא מדריכים, טיפים, ומידע עדכני שיעזור לכם להבין את
          הזכויות שלכם, לדעת מהן ההטבות שמגיעות לכם, ולהתמודד עם אתגרים שיכולים
          להיות במיוחד אם אתם אוכלוסיות מיוחדות כמו נשואים.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          המטרה שלנו היא לא רק להעניק לכם את המידע הנחוץ ביותר, אלא גם לעזור לכם
          למצוא תשובות לשאלות שיכולות לעלות לכם ולהרגיש שאתם לא לבד. הבלוג הזה
          מכסה מגוון רחב של נושאים, כולל:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-4">
          <li>זכויות חיילים ותנאים לקבלת ת״ש</li>
          <li>עדכונים על חוקים ותקנות חדשים</li>
          <li>מידע חדש ואינפורמציה מעניינת</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          השירות הצבאי הוא תקופה משמעותית בחיים של כל אחד, ומטרתנו היא להקל
          עליכם ולהשפיע באופן חיובי על החוויה הזו.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-gray-900 rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4 md:text-right text-center">
          יכולות הבלוג
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          הבלוג שלנו מציע אפשרויות שיתוף פעולה והחלפת ידע בין המשתמשים:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-4">
          <li>
            כל משתמש יכול ליצור פוסט, שממתין לאישור המנהל. לאחר האישור, הפוסט
            יופיע ויהיה גלוי לכולם.
          </li>
          <li>כל משתמש יכול לשתף ידע וניסיון בתחומים שבהם הוא מומחה.</li>
          <li>
            משתמשים רשומים יכולים לסמן לייקים על פוסטים, דבר מאוד חשוב שיכול
            לעזור לקוראים למצוא אינפורמציה חשובה!
          </li>
          <li>
            משתמשים רשומים יכולים להוסיף תגובות וליצור דיונים סביב נושאים
            חשובים.
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          יחד, אנחנו יוצרים קהילה שמסייעת ותומכת בכל חייל וחיילת בצה"ל.
        </p>
      </div>

      <div className="flex justify-center md:justify-start mt-4 p-2">
        <Button gradientDuoTone="purpleToPink">
          <Link to="/">חזרה לעמוד הראשי</Link>
        </Button>
      </div>
    </div>
  );
}
