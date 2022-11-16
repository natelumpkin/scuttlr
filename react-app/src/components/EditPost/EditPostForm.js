import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../store/post';
import './EditPost.css'

const CreatePostForm = ({ setShowModal, post }) => {
    const author = useSelector(state => state.session.user)
    const [errors, setErrors] = useState([]);
    const [title, setTitle] = useState(post.title);
    const [text, setText] = useState(post.text)
    // const [mediaUrl, setMediaUrl] = useState('');
    const [titleCharCount, setTitleCharCount] = useState(post.title.length);
    const [textCharCount, setTextCharCount] = useState(post.text.length);
    // const [mediaCharCount, setMediaCharCount] = useState(0)
    const dispatch = useDispatch();

    const postType = post.postType

    const defaultProfileImage = "https://img.freepik.com/premium-vector/handdrawn-vintage-hermit-crab-vector-illustration_147266-58.jpg?w=360"


    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const postData = {
            title,
            text
        }

        const editedPost = await dispatch(updatePost(post.id, postData))
            .catch(async (response) => {
                const data = await response.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });

        if (editedPost) setShowModal(false)
    };

    return (
        <div>
            {/* // ---------- POST FORM FOR TEXT ---------- \\ */}
            {postType === 'text' && (
                <form className='create-post-form' onSubmit={onSubmit}>
                    <div>
                        <div id='text-profile-image-container'>
                            <img id='author-profile-image' src={author.profileImageUrl || defaultProfileImage} />
                        </div>
                        <div id='text-username'>{author.username}</div>
                    </div>
                    <div id='text-form-title-input'>
                        <input
                            name='title'
                            type='text'
                            placeholder='Title'
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setTitleCharCount(e.target.value.length)
                            }}
                            maxLength={100}
                            onFocus={(e) => setTitleCharCount(e.target.value.length)}
                            required
                        />
                        <div>{titleCharCount}/100</div>
                    </div>
                    <div id='text-form-text-input'>
                        <textarea
                            id='textarea-input'
                            name='text'
                            type='text'
                            placeholder='Go ahead, put anything.'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                setTextCharCount(e.target.value.length)
                            }}
                            maxLength={1000}
                            onFocus={(e) => setTextCharCount(e.target.value.length)}
                            required
                        />
                        <div>{textCharCount}/1000</div>
                    </div>
                    <div className='form-footer'>
                        <button className='cancel-button' onClick={() => setShowModal(false)}>Close</button>
                        <button className='save-edit-button' type="submit">Save</button>
                    </div>
                </form>
            )}


            {/* // ---------- POST FORM FOR IMAGE ---------- \\ */}
            {postType === 'image' && (
                <form className='create-post-form' onSubmit={onSubmit}>
                    <div>
                        <div id='text-profile-image-container'>
                            <img id='author-profile-image' src={author.profileImageUrl || defaultProfileImage} />
                        </div>
                        <div className='post-form-username'>{author.username}</div>
                    </div>
                    <div className='media-text-container'>
                        <textarea
                            name='text'
                            type='text'
                            placeholder='Go ahead, put anything.'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                setTextCharCount(e.target.value.length)
                            }}
                            maxLength={1000}
                            onFocus={(e) => setTextCharCount(e.target.value.length)}
                        />
                        <div>{textCharCount}/1000</div>
                    </div>
                    <div className='form-footer'>
                        <button className='cancel-button' onClick={() => setShowModal(false)}>Close</button>
                        <button className='save-edit-button' type="submit">Save</button>
                    </div>
                </form>
            )}


            {/* // ---------- POST FORM FOR QUOTE ---------- \\ */}
            {postType === 'quote' && (
                <form className='create-post-form' onSubmit={onSubmit}>
                    <div>
                        <div id='text-profile-image-container'>
                            <img id='author-profile-image' src={author.profileImageUrl || defaultProfileImage} />
                        </div>
                        <div className='post-form-username'>{author.username}</div>
                    </div>
                    <div className='quote-text-container'>
                        <textarea
                            name='quote'
                            type='text'
                            placeholder='Something someone else said here.'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                setTextCharCount(e.target.value.length)
                            }}
                            maxLength={1000}
                            onFocus={(e) => setTextCharCount(e.target.value.length)}
                            required
                        />
                        <div>{textCharCount}/1000</div>
                    </div>
                    <div className='quote-author-container'>
                        <input
                            name='title'
                            type='text'
                            placeholder='Author'
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setTitleCharCount(e.target.value.length)
                            }}
                            maxLength={100}
                            onFocus={(e) => setTitleCharCount(e.target.value.length)}
                            required
                        />
                        <div>{titleCharCount}/100</div>
                    </div>
                    <div className='form-footer'>
                        <button className='cancel-button' onClick={() => setShowModal(false)}>Close</button>
                        <button className='save-edit-button' type="submit">Save</button>
                    </div>
                </form>
            )}


            {/* // ---------- POST FORM FOR VIDEO ---------- \\ */}
            {postType === 'video' && (
                <form className='create-post-form' onSubmit={onSubmit}>
                    <div>
                        <div id='text-profile-image-container'>
                            <img id='author-profile-image' src={author.profileImageUrl || defaultProfileImage} />
                        </div>
                        <div className='post-form-username'>{author.username}</div>
                    </div>
                    <div className='media-text-container'>
                        <textarea
                            name='text'
                            type='text'
                            placeholder='Go ahead, put anything.'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                setTextCharCount(e.target.value.length)
                            }}
                            maxLength={1000}
                            onFocus={(e) => setTextCharCount(e.target.value.length)}
                            required
                        />
                        <div>{textCharCount}/1000</div>
                    </div>
                    <div className='form-footer'>
                        <button className='cancel-button' onClick={() => setShowModal(false)}>Close</button>
                        <button className='save-edit-button' type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreatePostForm;