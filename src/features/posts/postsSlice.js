import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client'

// const initialState = [
//   {id: '1', title: 'First Post!', content: 'Hello!'},
//   {id: '2', title: 'Second Post', content: 'More text'}
// ]

const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded(state, action) {
    //   state.push(action.payload)
    // },
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId
          }
        }
      }
    },
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { postAdded, postUpdated } = postsSlice.actions

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export default postsSlice.reducer