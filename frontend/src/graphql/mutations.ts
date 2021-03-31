/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBookmark = /* GraphQL */ `
  mutation CreateBookmark($bookmark: AddBookmark!) {
    createBookmark(bookmark: $bookmark) {
      id
      title
      url
    }
  }
`;
export const updateBookmark = /* GraphQL */ `
  mutation UpdateBookmark($bookmark: UpdateBookmark!) {
    updateBookmark(bookmark: $bookmark) {
      id
      title
      url
    }
  }
`;
export const deleteBookmark = /* GraphQL */ `
  mutation DeleteBookmark($bookmarkId: String!) {
    deleteBookmark(bookmarkId: $bookmarkId)
  }
`;
