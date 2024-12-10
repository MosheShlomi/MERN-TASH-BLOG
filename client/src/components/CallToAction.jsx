import React from "react";
import { Modal, Table, Button } from "flowbite-react";
import donateImg from "../assets/images/donate-qr-cafe.svg";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">תמכו בפרויקט ועזרו לנו לעזור לחיילים!</h2>
        <p className="text-gray-500 my-2">
          הבלוג שלנו פועל בהתנדבות מתוך מטרה לספק מידע חשוב על הזכויות שלהם. כדי
          שנוכל להמשיך ולתחזק את הפרויקט, אנו זקוקים לעזרתכם. כל תרומה, קטנה
          כגדולה, תסייע לנו להמשיך את הפעילות ולתמוך בחיילים נוספים.
        </p>
        <p className="my-3">תודה רבה על התמיכה!</p>
        <Button
          gradientDuoTone="redToYellow"
          className="rounded-tl-xl rounded-bl-none">
          <a
            href="https://www.bitpay.co.il/app/me/43112273-B5AA-2FFC-4166-E1595CD325268000"
            target="_blank"
            rel="noopener noreferrer">
            לתרומה
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1 flex justify-center">
        <img
          src={donateImg}
          className="h-[260px] object-fit bg-white rounded px-5"
        />
      </div>
    </div>
  );
}

export default CallToAction;
