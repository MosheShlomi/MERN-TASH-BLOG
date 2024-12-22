import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { BiCategory } from "react-icons/bi";
import { MdOutlinePostAdd } from "react-icons/md";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                icon={HiChartPie}
                as="div"
                active={tab === "dash" || !tab}>
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div">
              פרופיל
            </Sidebar.Item>
          </Link>
          {!currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                className="cursor-pointer"
                as="div">
                פוסטים שלי
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  className="cursor-pointer"
                  as="div">
                  פוסטים
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=drafts">
                <Sidebar.Item
                  active={tab === "drafts"}
                  icon={MdOutlinePostAdd}
                  className="cursor-pointer"
                  as="div">
                  פוסטים לאישור
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  className="cursor-pointer"
                  as="div">
                  משתמשים
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  className="cursor-pointer"
                  as="div">
                  תגובות
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=categories">
                <Sidebar.Item
                  active={tab === "categories"}
                  icon={BiCategory}
                  className="cursor-pointer"
                  as="div">
                  ניהול קטגוריות
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}>
            יציאה
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
