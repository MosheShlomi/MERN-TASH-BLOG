import { Modal, Table, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashDrafts() {
  const { currentUser } = useSelector((state) => state.user);
  const [draftPosts, setDraftPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const hebrewNames = {
    pending: "ממתין לאישור",
    published: "פורסם",
    rejected: "נדחה",
  };

  const statusColors = {
    pending: "text-yellow-600 dark:text-yellow-400",
    published: "text-green-600 dark:text-green-400",
    rejected: "text-red-600 dark:text-red-400",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-draft-posts`);
        const data = await res.json();
        if (res.ok) {
          setDraftPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = draftPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-draft-posts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setDraftPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete-post/${postToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setDraftPosts((prev) =>
          prev.filter((post) => post._id !== postToDelete._id)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const changePostStatus = async (postId, newStatus) => {
    try {
      const res = await fetch(`/api/post/change-status/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(`Failed to change post status: ${data.message}`);
        return;
      }

      setDraftPosts((prev) => {
        if (newStatus === "published") {
          return prev.filter((post) => post._id !== postId);
        } else if (newStatus === "rejected") {
          return prev.map((post) =>
            post._id === postId ? { ...post, status: newStatus } : post
          );
        }
        return prev;
      });
    } catch (error) {
      console.error(`Error changing post status: ${error.message}`);
    }
  };

  return (
    <div className=" table-auto w-full text-center overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {!loading && draftPosts.length === 0 && (
        <p className="text-xl text-gray-500">אין לך עדיין פוסטים!</p>
      )}
      {loading && <p className="text-xl text-gray-500">טוען...</p>}

      {!loading && currentUser.isAdmin && draftPosts.length > 0 && (
        <>
          <Table hoverable className="shadow-md text-right">
            <Table.Head>
              <Table.HeadCell>תאריך עדכון</Table.HeadCell>
              <Table.HeadCell>תמונה ראשית</Table.HeadCell>
              <Table.HeadCell>כותרת</Table.HeadCell>
              <Table.HeadCell>קטגוריה</Table.HeadCell>
              <Table.HeadCell>
                <span>סטטוס</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span>עריכה</span>
              </Table.HeadCell>
              <Table.HeadCell>פעולות</Table.HeadCell>

              <Table.HeadCell>מחיקה</Table.HeadCell>
            </Table.Head>
            {draftPosts.map((post, index) => (
              <Table.Body className="divide-y" key={`${post._id}-${index}`}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString("he-IL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/preview/${post._id}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/preview/${post._id}`}
                      className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  {post.category ? (
                    <Table.Cell>
                      {post.category.map((cat) => cat.name).join(", ")}
                    </Table.Cell>
                  ) : (
                    <div></div>
                  )}
                  <Table.Cell>
                    <span className={statusColors[post.status]}>
                      {hebrewNames[post.status]}
                    </span>
                    <br />
                    {!currentUser.isAdmin &&
                      post.updateStatus === "pending" && (
                        <span className="text-xs border-t border-gray-300 text-yellow-600 dark:border-gray-700 dark:text-yellow-400 p-1 block">
                          בקשה לעדכון נשלחה
                        </span>
                      )}
                    {!currentUser.isAdmin &&
                      post.updateStatus === "accepted" && (
                        <span className="text-xs border-t border-gray-300 text-green-600 dark:border-gray-700 dark:text-green-400 p-1 block">
                          בקשה לעדכון אושרה
                        </span>
                      )}
                    {!currentUser.isAdmin &&
                      post.updateStatus === "rejected" && (
                        <span className="text-xs border-t border-gray-300 text-red-600 dark:border-gray-700 dark:text-red-400 p-1 block">
                          בקשה לעדכון נידחתה
                        </span>
                      )}
                    {currentUser.isAdmin && post.updateStatus === "pending" && (
                      <span className="text-xs border-t border-gray-300 text-yellow-600 dark:border-gray-700 dark:text-yellow-400 p-1 block">
                        קיימת בקשה לעדכון
                      </span>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 hover:underline cursor-pointer">
                        עריכה
                      </span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {post.status !== "rejected" && (
                      <>
                        {post.status === "pending" && (
                          <span className="flex flex-nowrap">
                            <span
                              onClick={() => {
                                changePostStatus(post._id, "published");
                              }}
                              className="font-medium text-yellow-500 hover:underline cursor-pointer">
                              פרסם
                            </span>{" "}
                            /{" "}
                            <span
                              onClick={() => {
                                changePostStatus(post._id, "rejected");
                              }}
                              className="font-medium text-pink-500 hover:underline cursor-pointer">
                              דחה
                            </span>
                          </span>
                        )}
                      </>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostToDelete(post);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer">
                      מחיקה
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center py-7 text-sm ">
              הצג עוד
            </button>
          )}
        </>
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
              האם אתה בטוח שברצונך למחוק את הפוסט הזה?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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
}

export default DashDrafts;
