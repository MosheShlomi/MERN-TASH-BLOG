import React from "react";
import { useSelector } from "react-redux";
import { Button, Label, Spinner, TextInput } from "flowbite-react";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 ">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profileAvatar}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
          />
        </div>

        <TextInput
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" placeholder="Password" id="password" />
        <Button gradientDuoTone="purpleToBlue" type="submit" outline>
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
