import {BOOKMARK_ADD, BOOKMARK_REMOVE} from './actionTypes';

const initialState = {
  bookmark: [],
};

const markReducer = (state = initialState, action) => {
  console.log(action);

  switch (action.type) {
    case BOOKMARK_ADD: {
      return {
        ...state,
        bookmark: [...state.bookmark, action.payload],
      };
    }
    case BOOKMARK_REMOVE: {
      return {
        ...state,
        bookmark: state.bookmark.filter(item => item.id !== action.payload.id),
      };
    }
  }
  return state;
};
export default markReducer;
