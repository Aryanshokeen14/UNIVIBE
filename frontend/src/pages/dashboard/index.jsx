import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getAllPosts,
  incrementPostLikes,
  decrementPostLikes,
  getAllComments,
  createPost,
  postComment,
} from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import UserLayout from "../../layout/userLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const commentListRef = useRef(null);
  const postState = useSelector((state) => state.postReducer);

  const [activePostId, setActivePostId] = useState(null);

  useEffect(() => {
    if (authState.isTokenThere) {
      console.log("AUTH TOKEN");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  useEffect(() => {
    if (postState.postId !== "") {
      document.body.style.overflow = "hidden"; // Disable background scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable when closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [postState.postId]);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileContent(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div>
            <div className={styles.scrollComponent}>
              <div className={styles.wrapper}>
                <div className={styles.createPostContainer}>
                  <div className={styles.imgDiv}
                    style={{ backgroundColor: "",width:"10%", height: "70%", }}
                  >
                    <img
                      className={styles.userProfile}
                      src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                      alt=""
                    />
                  </div>
                  <div style={{width:"90%"}}>
                    <textarea
                    onChange={(e) => setPostContent(e.target.value)}
                    value={postContent}
                    placeholder={"What's in your mind?"}
                    className={styles.textAreaOfContent}
                    name=""
                    id=""
                  ></textarea>
                  </div>
                  <label htmlFor="fileUpload" style={{width:"10%"}}>
                    <div className={styles.Fab}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </label>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    hidden
                    id="fileUpload"
                  />
                  {previewUrl && fileContent && (
                    <div className={styles.previewUploadFile}>
                      <p>File</p>
                    </div>
                  )}
                  {postContent.length > 0 && (
                    <div onClick={handleUpload} className={styles.uploadButton}>
                      Upload
                    </div>
                  )}
                </div>

                <div className={styles.postsContainer}>
                  {postState.posts.map((post) => {
                    const formattedTimeAgo = formatDistanceToNow(
                      new Date(post.createdAt),
                      { addSuffix: true }
                    );
                    console.log(formattedTimeAgo);

                    return (
                      <div key={post._id} className={styles.singleCard}>
                        <div className={styles.singleCard_profileContainer}>
                          <div className={styles.postImageContainer}>
                            <img
                              onClick={() => {
                                router.push(
                                  `/view_profile/${post.userId.username}`
                                );
                              }}
                              className={styles.postImageTag}
                              src={`${BASE_URL}/${post.userId.profilePicture}`}
                              alt=""
                            />
                          </div>
                          <div>
                            <div
                              className={styles.postUserDetails}
                            >
                              <p
                                onClick={() => {
                                  router.push(
                                    `/view_profile/${post.userId.username}`
                                  );
                                }}
                                style={{
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                {post.userId.name}
                              </p>
                              <p style={{ color: "grey" }}>
                                {formattedTimeAgo}
                              </p>
                            </div>
                            <p style={{ color: "grey" }} className={styles.postUsername}>
                              @{post.userId.username}
                            </p>
                            <p
                              className={styles.postTextBody}
                            >
                              {post.body}
                            </p>
                            <div className={styles.singleCard_image}>
                              {post.media.endsWith(".mp4") ||
                              post.media.endsWith(".webm") ? (
                                <video
                                  src={`${BASE_URL}/${post.media}`}
                                  controls
                                  className={styles.postMedia}
                                />
                              ) : post.media.endsWith(".pdf") ? (
                                <iframe
                                  src={`${BASE_URL}/${post.media}`}
                                  className={styles.postMedia}
                                  title="PDF Preview"
                                />
                              ) : (
                                <img
                                  src={`${BASE_URL}/${post.media}`}
                                  alt=""
                                  className={styles.postMedia}
                                />
                              )}
                            </div>

                            <div className={styles.statsContainer}>
                              <div
                                className={styles.singleOption_statsContainer}
                              >
                                <svg
                                  onClick={async () => {
                                    await dispatch(
                                      incrementPostLikes({ post_id: post._id })
                                    );
                                    await dispatch(getAllPosts());
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                  />
                                </svg>
                                {post.likes}

                                {/* </div> */}
                                {/* <div className={styles.singleOption_statsContainer}> */}
                                <svg
                                  onClick={() => {
                                    dispatch(
                                      getAllComments({ post_id: post._id })
                                    );
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                  />
                                </svg>
                                <p>{post.commentCount}</p>
                                {/* </div> */}
                                {/* <div className={styles.singleOption_statsContainer}> */}
                                <svg
                                  onClick={() => {
                                    const text = encodeURIComponent(post.body);
                                    const url =
                                      encodeURIComponent("univibe-two.vercel.app");
                                    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
                                    window.open(
                                      whatsappUrl,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {post.userId._id === authState.user.userId._id ? (
                            <div
                              onClick={() => {
                                setActivePostId((prev) =>
                                  prev === post._id ? null : post._id
                                );
                              }}
                              className={styles.edit}
                            >
                              <p>...</p>
                            </div>
                          ) : (
                            <div style={{ width: "60px" }}></div>
                          )}
                          {post.userId._id === authState.user.userId._id &&
                            activePostId === post._id && (
                              <div
                                onClick={async () => {
                                  await dispatch(
                                    deletePost({ post_id: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                  setActivePostId(null);
                                }}
                                className={styles.deleteButton}
                              >
                                Delete
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {postState.postId !== "" && (
            <div
              onClick={() => {
                dispatch(resetPostId());
                dispatch(getAllPosts());
              }}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.allCommentsContainer}
              >
                <div
                  ref={commentListRef}
                  className={styles.allCommentsContainer_scroll}
                >
                  {postState.comments.length === 0 && (
                    <h2 style={{ color: "black" }}>No Comments</h2>
                  )}
                  {postState.comments.length !== 0 && (
                    <div style={{ width: "100%" }}>
                      {postState.comments.map((postComment, index) => {
                        return (
                          <div
                            key={postComment._id}
                            style={{
                              color: "black",
                              display: "flex",
                              alignItems: "flex-start",
                              width: "100%",
                            }}
                          >
                            <img
                              className={styles.commentImage}
                              src={`${BASE_URL}/${postComment.userId?.profilePicture}`}
                              alt=""
                            />
                            {/* <p style={{color:"grey" ,  width:"15%"}}>@{postComment.userId.name}:</p>&nbsp;
                      <p style={{wordWrap: "break-word", whiteSpace: "normal",overflow:"clip",width:"60%"}}>{postComment.body}</p> */}
                            &nbsp;&nbsp;
                            <p
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                overflow: "clip",
                                width: "80%",
                              }}
                            >
                              <span>{postComment.userId.name}:</span>&nbsp;
                              <span style={{ color: "grey" }}>
                                {postComment.body}
                              </span>
                            </p>
                            <p
                            className={styles.commentDate}
                            >
                              {new Date(postComment.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={styles.postCommentContainer}>
                  <input
                    type=""
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Comment"
                  />
                  <div
                    onClick={async () => {
                      if (!commentText.trim()) return;
                      await dispatch(
                        postComment({
                          post_id: postState.postId,
                          body: commentText,
                        })
                      );
                      await dispatch(
                        getAllComments({ post_id: postState.postId })
                      );
                      setCommentText("");
                      setTimeout(() => {
                        commentListRef.current?.scrollTo({
                          top: commentListRef.current.scrollHeight,
                          behavior: "smooth",
                        });
                      }, 100);
                    }}
                    className={`${styles.postCommentContainer_commentBtn} ${
                      !commentText.trim() ? styles.disabledPostBtn : ""
                    }`}
                  >
                    <p>Post</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <h3>Loading...</h3>
        </DashboardLayout>
      </UserLayout>
    );
  }
}
