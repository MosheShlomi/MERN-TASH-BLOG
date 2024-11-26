import React from "react";
import { Modal, Table, Button } from "flowbite-react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JS?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JS Projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none">
          <a href="#" target="_blank" rel="noopener noreferrer">
            100 JS Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://campus.epam.com/static/plan/4462/selfstudy03375353.png" />
      </div>
    </div>
  );
}

export default CallToAction;
