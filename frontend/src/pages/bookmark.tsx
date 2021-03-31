import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Button,
  Input,
  Text,
  IconButton,
  Box,
  Spinner,
} from "theme-ui";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { swiss } from "@theme-ui/presets";
import { Formik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import Home from "./index";
import { Navbar } from "../components/Navbar";
import { Router, RouteComponentProps } from "@reach/router";
import { API } from 'aws-amplify';import { createBookmark, deleteBookmark, updateBookmark } from "../graphql/mutations";
import { getBookmarks } from "../graphql/queries";
import { IdentityContext } from "../cognitoIdentity/IdentityProvider";

let Dashboard = (props: RouteComponentProps) => {
  const { user } = useContext(IdentityContext)
  const [loading, setLoading] = useState(true)
  const [bookmarkData, setBookmarkData] = useState<any>(null)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const addBookmarkToDB = async (title: string, url: string, user: string) => {
    setLoading(true)
    await API.graphql({
      query: createBookmark,
      variables: {
        bookmark: {
          title,
          url,
          user
        }
      }
    })
    await fetchBookmarks()
  };

  const editBookmark = async (id, title: string, url: string) => {
    setLoading(true)
    await API.graphql({
      query: updateBookmark,
      variables: {
        bookmark: {
          id,
          title,
          url
        }
      }
    })
    await fetchBookmarks()
  };

  const deleteBookmarkFromDb = async(id) => {
    setLoading(true)
    await API.graphql({
      query: deleteBookmark,
      variables: {
        bookmarkId: id
      }
    })
    await fetchBookmarks()
  };

  const fetchBookmarks = async() => {
    const data = await API.graphql({
      query: getBookmarks,
      variables: {
        user: user
      }
    })
    console.log(data);
    setBookmarkData(data)
    setLoading(false)
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("*Enter Bookmark Title"),
    url: yup
      .string()
      .required("*Enter Bookmark url")
      .matches(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        "Enter correct url"
      ),
  });

  const handleEdit = async (refId: any) => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Enter Title",
        input: "text",
      },
      {
        titleText: "Enter Url",
        input: "text",
      },
    ]);
    if (result.value) {
      const { value } = result;
      editBookmark(refId, value[0], value[1]);
    }
  };


  return (
    <Container>
      <Navbar />
      <h1 style={{ color: swiss.colors.primary, textAlign: "center" }}>
        Bookmark App
      </h1>
      <Formik
        initialValues={{ title: "", url: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          resetForm({
            values: { title: "", url: "" },
          });
          addBookmarkToDB(values.title, values.url, user);
        }}
      >
        {({ values, handleSubmit, handleChange, touched, errors }) => (
          <Box
            as="form"
            sx={{
              margin: "0 auto",
            }}
            mt="4"
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Input
                name="title"
                sx={{ width: "40%", margin: "5px auto" }}
                placeholder="Enter Title"
                value={values.title}
                onChange={handleChange}
              />
              {touched.title && errors.title ? (
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "red",
                    textAlign: "center",
                    marginLeft: "30%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                >
                  {errors.title}
                </p>
              ) : null}
              <Input
                name="url"
                sx={{ width: "40%", margin: "5px auto" }}
                placeholder="Enter Url"
                value={values.url}
                onChange={handleChange}
              />
              {touched.url && errors.url ? (
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "red",
                    textAlign: "center",
                    marginLeft: "30%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                >
                  {errors.url}
                </p>
              ) : null}

              <Button sx={{ marginLeft: "30%" }} type="submit">
                Add Bookmark
              </Button>
            </div>
          </Box>
        )}
      </Formik>

      {loading ? (
        <div style={{ margin: "15px auto", textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <ul style={{ padding: "0px" }}>
          {bookmarkData &&
            bookmarkData.data.getBookmarks.map((bookmark, ind) => {
              return (
                <Box
                  as="li"
                  key={ind}
                  sx={{
                    backgroundColor: swiss.colors.highlight,
                    width: ["90%", null, "60%"],
                    margin: "20px auto",
                    padding: "5px",
                    borderRadius: "5px",
                    listStyle: "none",
                  }}
                  my="3"
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      width: "fit-content",
                      marginLeft: "auto",
                    }}
                  >
                    <IconButton
                      aria-label="Toggle swiss mode"
                      onClick={() => {
                        handleEdit(bookmark.id);
                      }}
                    >
                      <EditIcon htmlColor={swiss.colors.primary} />
                    </IconButton>
                    <IconButton
                      aria-label="Toggle swiss mode"
                      onClick={() => {
                        deleteBookmarkFromDb(bookmark.id);
                      }}
                    >
                      <DeleteIcon htmlColor={swiss.colors.primary} />
                    </IconButton>
                  </span>
                  <Text
                    sx={{
                      fontSize: 6,
                      fontWeight: "bold",
                      marginLeft: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    {bookmark.title}
                  </Text>
                  <Text
                    sx={{
                      fontSize: 3,
                      marginLeft: "20px",
                      textDecoration: "underline",
                      color: swiss.colors.secondary,
                    }}
                  >
                    {bookmark.url}
                  </Text>
                </Box>
              );
            })}
        </ul>
      )}
    </Container>
  );
};

export default () => {
  const { user } = useContext(IdentityContext);

  if (!user) {
    return <Home />;
  }
  return (
    <Router>
      <Dashboard path="/bookmark" />
    </Router>
  );
};
