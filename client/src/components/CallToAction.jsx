import React from "react";
import { Modal, Table, Button } from "flowbite-react";
import donateImg from "../assets/images/donate-qr.png";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl"> הצטרפו למשימה🌟: תמכו בחיילים עכשיו!</h2>
        <p className="dark:text-gray-300 text-gray-500 my-2">
          הבלוג שלנו הוא פרויקט התנדבותי שמטרתו לספק מידע חשוב על זכויות
          החיילים. התמיכה שלכם מאפשרת לנו לשמור על פעילות האתר ולהגיע לעוד ועוד
          חיילים שזקוקים לעזרה. כל תרומה, קטנה או גדולה, עושה שינוי אמיתי
          ומסייעת לנו להמשיך ולהשפיע.
        </p>
        <p className="my-3">
          תודה רבה💙 על האמונה במטרה שלנו ועל התמיכה הנדיבה שלכם!
        </p>
        <a
          className="w-full"
          href="https://www.bitpay.co.il/app/me/43112273-B5AA-2FFC-4166-E1595CD325268000"
          target="_blank"
          rel="noopener noreferrer">
          <Button
            gradientDuoTone="pinkToOrange"
            className="rounded-tl-xl rounded-bl-none w-full text-white">
            תרמו – ותהיו חלק מהשינוי
          </Button>
        </a>
      </div>
      <div className="p-7 flex-1 flex justify-center items-center">
        <a
          className=""
          href="https://www.bitpay.co.il/app/me/43112273-B5AA-2FFC-4166-E1595CD325268000"
          target="_blank"
          rel="noopener noreferrer">
          <img
            src={donateImg}
            className="h-[260px] object-fit !bg-white rounded"
            loading="lazy"
            style={{
              background: `url("/src/assets/images/default-img.jpeg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </a>
      </div>
    </div>
  );
}

export default CallToAction;
