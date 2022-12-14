import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import React from "react"
import ReactPlayer from "react-player"

// import formatVideoLink from "../../utils/formatVideoLink"
import NotesCard from "../NotesCard"
import DeletePostModal from "../DeletePost/DeletePostModal"
import EditPostModal from '../EditPost/EditPostModal'
import LoginForm from '../auth/Login/LoginForm'
import './PostCard.css'
import * as followActions from "../../store/follow"

import * as likeActions from "../../store/like"
import * as commentActions from "../../store/comment"

import { Modal } from '../../context/Modal';

const PostCard = ({ post }) => {
  const [showBox, setShowBox] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const user = useSelector(state => state.session.user)
  const follows = useSelector(state => state.follows)
  const likes = useSelector(state => state.likes)
  const comments = useSelector(state => state.comments)
  const dispatch = useDispatch()

  const [liked, setLiked] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      await dispatch(likeActions.getPostLikes(post.id))
      await dispatch(commentActions.grabAllComments(post.id))
    }
    fetchData();
    setLoaded(true)
  }, [dispatch, post])

  const likedList = []

  useEffect(() => {
    if (user) {
      const likedPost = likedList.includes(user.id.toString())
      setLiked(likedPost)
    } else {
      setShowBox(false)
    }
  }, [likedList, user])

  const followUser = (userId) => {
    dispatch(followActions.createNewFollow(userId))
    // .then(dispatch(postActions.getAllPosts()))
  }

  const likePost = (postId) => {
    dispatch(likeActions.addPostLike(postId))
    let id = `likebutton-${postId}`
    const likeButton = document.getElementById(id)
    if (likeButton) likeButton.classList.add('liked')
  }

  const unlikePost = (postId) => {
    dispatch(likeActions.removePostLike(postId))

  }

  let numComments
  let notes
  if (comments.posts[post.id]) {
    numComments = Object.keys(comments.posts[post.id]).length
  }


  for (let userId in likes.posts[post.id]) {
    likedList.push(userId)
  }

  const numLikes = likedList.length;
  if (numComments) {

    notes = numLikes + numComments
  } else {
    notes = numLikes
  }
  // Brad Code
  // This notesCount will display the results from above but also allow an onClick

  // If user, display normal notes button else
  // display current notes or nothing if no notes.
  // Also added singular - may not be wanted - change if so
  let notesCount;
  if (notes > 1) {
    notesCount = `${notes} notes`
  } else if (notes === 1) {
    notesCount = `${notes} note`
  }

  const NotesButton = () => {
    if (notes > 0) {
      return (
        <button className="notes-button" onClick={() => setShowBox(!showBox)}>
          {notesCount}
        </button>
      )
    } else {
      return null
    }
  }

  const CloseNotesButton = () => {
    return (
      <button className="close-notes-button" onClick={() => setShowBox(!showBox)}>
        x Close notes
      </button>
    )
  }

  const LoginFormModal = ({ showModal, setShowModal }) => {

    return (
      <>
        <i className="fa-regular fa-comment interface-text postcard-comment-button" onClick={() => setShowModal(true)}></i>

        {showModal && (
          <Modal onClose={() => setShowModal(false)} >
            <LoginForm setShowModal={setShowModal} showModal={showModal} />
          </Modal>
        )}
      </>)
  }

  const followingList = Object.keys(follows.following)

  const following = followingList.includes(post.User.id.toString())


  // if postType is text,
  // only render title and text
  // if postType is quote,
  // only render title and text
  // if postType is image,
  // only render image and text
  // if postType is video,
  // only render video and text
  if (loaded && post.postType === 'text') {
    return (
      <div className="postCard-outer-container">
        <div className="postCard-userImage-holder">
          <div className="postCard-userImage">
            <img alt='profile' src={post.User.profileImageUrl} />
            {/* Post Id: {post.id}
            Post type: {post.postType} */}
          </div>
        </div>
        <div className="postCard-content-holder top-padding">
          <div className="postCard-author-username-holder post-padding">
            <Link to={`/users/${post.User.id}`}>
              {post.User && (
                post.User.username
              )}
            </Link>
            {/* If following is false and there is session.user.id and post.User.id is not currentUser.id, then render the follow button */}
            {user && !following && user.id && post.User.id !== user.id && (
              <button className="postcard-follow-button" onClick={() => followUser(post.User)}>Follow</button>
            )}
          </div>
          <div className="postcard-title-holder post-padding">
            <h2>{post.title}</h2>
          </div>
          <div className="postcard-text-holder post-padding">
            <p>{post.text}</p>
          </div>
          <div className="postcard-edit-delete-holder post-padding">
            {user && user.id === post.User.id && (<>
              <DeletePostModal post={post} />
              <EditPostModal post={post} />
            </>
            )}
          </div>
          <div className="post-interface-border post-padding"></div>
          <div className="postcard-bottom-container post-padding">
            <div className="postcard-notes-holder">

            {user ? <div className="postcard-notes-holder">
              {showBox ? <CloseNotesButton /> : <NotesButton />}
            </div> :
              notes > 0 ? (<div className="postcard-notes-holder notes-button"> {notesCount}</div>)  : null
            }

            </div>
            <div className="postcard-comments-likes-holder">
              {user ? (<button className="postcard-comment-button" onClick={(e) => setShowBox(!showBox)}><i className="fa-regular fa-comment interface-text"></i></button>)
                : (<LoginFormModal setShowModal={setShowModal} showModal={showModal} />)}

              {loaded && user && !liked && (<button id={`likebutton-${post.id}`} className="postcard-like" onClick={() => likePost(post.id)}><i className="fa-regular fa-heart interface-text"></i></button>)}
              {loaded && user && liked && (<button className="postcard-unlike" onClick={() => unlikePost(post.id)}><i className="fa-solid fa-heart interface-text"></i></button>)}
            </div>
          </div>
          <div>{showBox ? <NotesCard post={post} numlikes={numLikes} numcomments={numComments} /> : null}</div>
          {/* {showModal && (<LoginFormModal showModal={showModal} setShowModal={setShowModal} />)} */}
        </div>
      </div>
    )
  } else if (loaded && post.postType === "quote") {
    return (
      <div className="postCard-outer-container">
        <div className="postCard-userImage-holder">
          <div className="postCard-userImage">
            <img alt='profile' src={post.User.profileImageUrl} />
            {/* Post Id: {post.id}
            Post type: {post.postType} */}
          </div>
        </div>
        <div className="postCard-content-holder top-padding">
          <div className="postCard-author-username-holder post-padding">
            <Link to={`/users/${post.User.id}`}>
              {post.User && (
                post.User.username
              )}
            </Link>
            {user && !following && user.id && post.User.id !== user.id && (
              <button className="postcard-follow-button" onClick={() => followUser(post.User)}>Follow</button>
            )}
          </div>
          <div className="postcard-quote-holder post-padding">
            <h2>"{post.text}"</h2>
          </div>
          <div className="postcard-source-holder post-padding">
            <p>- {post.title}</p>
          </div>
          <div className="postcard-edit-delete-holder post-padding">
            {user && user.id === post.User.id && (<>
              <DeletePostModal post={post} />
              <EditPostModal post={post} />
            </>
            )}
          </div>
          <div className="post-interface-border post-padding"></div>
          <div className="postcard-bottom-container post-padding">
            <div className="postcard-notes-holder">

              {user ? <div className="postcard-notes-holder">
                {showBox ? <CloseNotesButton /> : <NotesButton />}
              </div> :
                notes > 0 ? (<div className="postcard-notes-holder notes-button"> {notesCount}</div>) : null
              }

            </div>
            <div className="postcard-comments-likes-holder">
              {user ? (<button className="postcard-comment-button" onClick={(e) => setShowBox(!showBox)}><i className="fa-regular fa-comment interface-text"></i></button>)
                : (<LoginFormModal setShowModal={setShowModal} showModal={showModal} />)}
              {loaded && user && !liked && (<button id={`likebutton-${post.id}`} className="postcard-like" onClick={() => likePost(post.id)}><i className="fa-regular fa-heart interface-text"></i></button>)}
              {loaded && user && liked && (<button className="postcard-unlike" onClick={() => unlikePost(post.id)}><i className="fa-solid fa-heart interface-text"></i></button>)}
            </div>
          </div>
          <div>{showBox ? <NotesCard post={post} numlikes={numLikes} numcomments={numComments} /> : null}</div>
        </div>
      </div>
    )
  } else if (loaded && (post.postType === 'image' || post.postType === 'photo')) {
    return (
      <div className="postCard-outer-container">
        <div className="postCard-userImage-holder">
          <div className="postCard-userImage">
            <img alt='profile' src={post.User.profileImageUrl} />
            {/* Post Id: {post.id}
            Post type: {post.postType} */}
          </div>
        </div>
        <div className="postCard-content-holder top-padding">
          <div className="postCard-author-username-holder post-padding">
            <Link to={`/users/${post.User.id}`}>
              {post.User && (
                post.User.username
              )}
            </Link>
            {user && !following && user.id && (post.User.id !== user.id) && (
              <button className="postcard-follow-button" onClick={() => followUser(post.User)}>Follow</button>
            )}
          </div>
          <div className="postcard-photo-holder top-padding">
            {post.Media[0] && (<img alt='profile' src={post.Media[0].mediaUrl} />)}
          </div>
          <div className="postcard-caption-holder post-padding">
            <p>{post.text}</p>
          </div>
          <div className="postcard-edit-delete-holder post-padding">
            {user && user.id === post.User.id && (<>
              <DeletePostModal post={post} />
              <EditPostModal post={post} />
            </>
            )}
          </div>
          <div className="post-interface-border post-padding"></div>
          <div className="postcard-bottom-container post-padding">
            <div className="postcard-notes-holder">

              {user ? <div className="postcard-notes-holder">
                {showBox ? <CloseNotesButton /> : <NotesButton />}
              </div> :
                notes > 0 ? (<div className="postcard-notes-holder notes-button"> {notesCount}</div>) : null
              }

            </div>
            <div className="postcard-comments-likes-holder">
              {user ? (<button className="postcard-comment-button" onClick={(e) => setShowBox(!showBox)}><i className="fa-regular fa-comment interface-text"></i></button>)
                : (<LoginFormModal setShowModal={setShowModal} showModal={showModal} />)}
              {loaded && user && !liked && (<button className="postcard-like" id={`likebutton-${post.id}`} onClick={() => likePost(post.id)}><i className="fa-regular fa-heart interface-text"></i></button>)}
              {loaded && user && liked && (<button className="postcard-unlike" onClick={() => unlikePost(post.id)}><i className="fa-solid fa-heart interface-text"></i></button>)}
            </div>
          </div>
          <div>{showBox ? <NotesCard post={post} numlikes={numLikes} numcomments={numComments} /> : null}</div>
        </div>
      </div>
    )
  } else if (loaded && post.postType === 'video') {

    return (
      <div className="postCard-outer-container">
        <div className="postCard-userImage-holder">
          <div className="postCard-userImage">
            <img alt='profile' src={post.User.profileImageUrl} />
            {/* Post Id: {post.id}
            Post type: {post.postType} */}
          </div>
        </div>
        <div className="postCard-content-holder top-padding">
          <div className="postCard-author-username-holder post-padding">
            <Link to={`/users/${post.User.id}`}>
              {post.User.username}
            </Link>
            {user && !following && user.id && post.User.id !== user.id && (
              <button className="postcard-follow-button" onClick={() => followUser(post.User)}>Follow</button>
            )}
          </div>
          <div className="postcard-video-holder top-padding">
            {post.Media[0] && (
              <ReactPlayer width={540} height={280} className='react-player' url={post.Media[0].mediaUrl} controls={true}></ReactPlayer>)}
          </div>
          <div className="postcard-caption-holder post-padding">
            <p>{post.text}</p>
          </div>
          <div className="postcard-edit-delete-holder post-padding">
            {user && user.id === post.User.id && (<>
              <DeletePostModal post={post} />
              <EditPostModal post={post} />
            </>
            )}
          </div>
          <div className="post-interface-border post-padding"></div>
          <div className="postcard-bottom-container post-padding">
            <div className="postcard-notes-holder">

              {user ? <div className="postcard-notes-holder">
                {showBox ? <CloseNotesButton /> : <NotesButton />}
              </div> :
                notes > 0 ? (<div className="postcard-notes-holder notes-button"> {notesCount}</div>) : null
              }

            </div>
            <div className="postcard-comments-likes-holder">
              {user ? (<button className="postcard-comment-button" onClick={(e) => setShowBox(!showBox)}><i className="fa-regular fa-comment interface-text"></i></button>)
                : (<LoginFormModal setShowModal={setShowModal} showModal={showModal} />)}
              {loaded && user && !liked && (<button className="postcard-like" id={`likebutton-${post.id}`} onClick={() => likePost(post.id)}><i className="fa-regular fa-heart interface-text"></i></button>)}
              {loaded && user && liked && (<button className="postcard-unlike" onClick={() => unlikePost(post.id)}><i className="fa-solid fa-heart interface-text"></i></button>)}
            </div>
          </div>
          <div>{showBox ? <NotesCard post={post} numlikes={numLikes} numcomments={numComments} /> : null}</div>
        </div>
      </div>
    )
  }
  else {
    return (
      <h2>Posts still loading {':<'} sowwwwwwyyyyyyy</h2>
    )
  }
}


export default PostCard;
