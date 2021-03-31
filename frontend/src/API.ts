/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AddBookmark = {
  title: string,
  url: string,
  user: string,
};

export type Bookmark = {
  __typename: "Bookmark",
  id?: string,
  title?: string,
  url?: string,
};

export type UpdateBookmark = {
  id: string,
  title: string,
  url: string,
};

export type CreateBookmarkMutationVariables = {
  bookmark?: AddBookmark,
};

export type CreateBookmarkMutation = {
  createBookmark?:  {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null,
};

export type UpdateBookmarkMutationVariables = {
  bookmark?: UpdateBookmark,
};

export type UpdateBookmarkMutation = {
  updateBookmark?:  {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  bookmarkId?: string,
};

export type DeleteBookmarkMutation = {
  deleteBookmark?: string | null,
};

export type GetBookmarksQueryVariables = {
  user?: string,
};

export type GetBookmarksQuery = {
  getBookmarks?:  Array< {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null > | null,
};
