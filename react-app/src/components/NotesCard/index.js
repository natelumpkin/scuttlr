import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import './NotesCard.css';
import CommentsCard from './CommentsCard.js';
import LikesCommentCard from './LikesCommentCard.js';
import CommentInput from './CommentInput.js';
import * as commentActions from "../../store/comment";
import * as likeActions from "../../store/like";


const NotesCard = ({ post, numlikes, numcomments }) => {
  const dispatch = useDispatch();
  const commentObj = useSelector(state => state.comments.posts[post.id]) || []
  const comments = Object.values(commentObj)
  const likeObj = useSelector(state => state.likes.posts[post.id]) || []
  const currentuser = useSelector(state => state.session.user) || []
  const likes = Object.values(likeObj)
  // const history = useHistory();
  const [current, setCurrent] = useState(true)
  // const [errors, setErrors] = useState([])


  useEffect(() => {
    dispatch(commentActions.grabAllComments(post.id))
    dispatch(likeActions.getPostLikes(post.id))
  }, [dispatch, post])


  let displayComments;
  if (comments.length > 0) {
    displayComments = comments.map(comment => {
      return <CommentsCard key={comment.id} comment={comment} user={currentuser} />
    })
  } else {
    displayComments = (
      <div className="empty-comments-container">
        <div className="empty-comments-holder">
          <i className="fa-regular fa-comment interface-text empty-comments-bubble"></i>
          <h3> Be the first to Reply! </h3>
        </div>
      </div>
    )
  }
  let displayLikes;
  if (likes.length > 0) {
    displayLikes = likes.map(like => {
      return <LikesCommentCard key={like.id} like={like} post={post} />
    })
  } else {
    displayLikes = (
      <div className="empty-comments-container">
        <div className="empty-comments-holder">
          <i className="fa-regular fa-heart interface-text empty-comments-bubble"></i>
          <h3> Give the first Like! </h3>
        </div>
      </div>
    )
  }

  if (currentuser.id) {
    return (
      <div className="notescard_overall_container">
        <div className="notescard_navigation_container">
          <div className={current ? "notescard_nav_bubble_selected" : ""}>
            <button onClick={() => setCurrent(true)}><i className="fa-regular fa-comment"></i> {numcomments ? numcomments : "0"}</button>
          </div>
          <div className={!current ? "notescard_nav_heart_selected" : ""}>
            <button onClick={() => setCurrent(false)}><i className="fa-regular fa-heart"></i> {numlikes ? numlikes : "0"}</button>
          </div>
        </div>
        {current ? <CommentInput postid={post.id} /> : null}
        <div className="notescard_comment_like_container">
          {current ? displayComments : displayLikes}
        </div>
      </div>
    )
  } else {
    return null
  }

}

export default NotesCard;
