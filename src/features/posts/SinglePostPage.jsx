import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { selectPostById } from './postsSlice'

export const SinglePostPage = (props) => {
  const { match } = props
  const { postId } = match.params

  console.log(props)

  const post = useSelector((state) => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>页面未找到！</h2>
      </section>
    )
  }

  return (
    <section className="post">
      <h2>{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <p>
        <PostAuthor userId={post.user} />
      </p>
      <Link to={`/editPost/${post.id}`}>Edit Post</Link>
    </section>
  )
}
