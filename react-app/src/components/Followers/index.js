import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import * as followActions from '../../store/follow'

import FollowCard from "../FollowCard";

const Followers = () => {

  // This is a display of everyone the current use is following

  const dispatch = useDispatch();

  const followers = useSelector(state => state.follows.followers)
  const following = useSelector(state => state.follows.following)
  const currentUser = useSelector(state => state.session.user)

  const [loaded, setLoaded] = useState(false)

  useEffect(async () => {
    dispatch(followActions.getAllFollowing(currentUser.id));
    await dispatch(followActions.getAllFollowers(currentUser.id))
    setLoaded(true);
  }, [dispatch])

  // This is a list of everyone the current use is following
  const followingList = Object.values(following)
  const followerList = Object.values(followers)
    return (
      <div>
      <div>
        {loaded && (
        <h4>{followerList.length} Followers</h4>)}
      </div>
      <div>
        {followerList.map(user => (
          <FollowCard key={user.id} user={user} followingList={followingList} currentUser={currentUser}/>
          ))}
      </div>
    </div>
  )
}

export default Followers;