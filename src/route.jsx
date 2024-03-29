import { createBrowserRouter, redirect } from "react-router-dom";

import LandingPage from "./page/landingPage";
import Home from "./page/home";
import Login from "./page/auth/login";
import Register from "./page/auth/register";
import Profile from "./page/profile";
import RequireAuth from "./components/RequireAuth";
import { store } from "./store";
import { userApiSlice } from "./store/api/userApiSlice";
import { rankApiSlice } from "./store/api/rankApiSlice";
import { battleApiSlice } from "./store/api/battleApiSlice";
import History from "./page/history";
import Board from "./page/board";
import Ranking from "./page/board/ranking";
import Quizz from "./page/quizz";
import Result from "./page/quizz/result";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    loader: null,
  },
  {
    path: "/signin",
    element: <Login />,
    loader: null,
  },
  {
    path: "/signup",
    element: <Register />,
    loader: null,
  },
  {
    path: null,
    element: <RequireAuth />,
    loader: null,
    children: [
      {
        path: "/home",
        element: <Home />,
        loader: async () => {
          const { user } = store.getState().auth;
          let id = user?._id || 0;
          if (user == null || user._id == null) {
            const u = store.dispatch(
              userApiSlice.endpoints.getMyInfo.initiate()
            );

            try {
              const response = await u.unwrap();
              console.log(response);
              id = response.user._id;
            } catch (e) {
              // see https://reactrouter.com/en/main/fetch/redirect
              console.log(e);
              return redirect("/signin");
            } finally {
              u.unsubscribe();
            }
          }

          const data = store.dispatch(
            battleApiSlice.endpoints.getCategoryBattle.initiate()
          );

          try {
            const response = await data.unwrap();
            return response;
          } catch (e) {
            console.error(e);
            // see https://reactrouter.com/en/main/fetch/redirect
            return null;
          } finally {
            data.unsubscribe();
          }
        },
      },
      {
        path: "/quizz",
        element: <Quizz />,
        loader: async () => {
          const { category, mode } = store.getState().quizz;
          console.log(category?.id, mode);

          let c =
            category !== null && category?.id !== null
              ? `?category=${category?.id}`
              : "";
          console.log(c);
          const data = store.dispatch(
            battleApiSlice.endpoints.getQuestionBattle.initiate(c)
          );

          try {
            const response = await data.unwrap();
            console.log(response);
            return response;
          } catch (e) {
            // see https://reactrouter.com/en/main/fetch/redirect
            return redirect("/signin");
          } finally {
            data.unsubscribe();
          }
        },
      },
      {
        path: "/quizz/result",
        element: <Result />,
        loader: null,
      },
      {
        path: "/board/*",
        element: <Board />,
        children: [
          {
            path: "",
            element: <Ranking type={"all"} />,
            loader: async () => {
              const data = store.dispatch(
                rankApiSlice.endpoints.getTopBoard.initiate()
              );

              try {
                const response = await data.unwrap();
                return response;
              } catch (e) {
                // see https://reactrouter.com/en/main/fetch/redirect
                return redirect("/signin");
              } finally {
                data.unsubscribe();
              }
            },
          },
          {
            path: "me",
            element: <Ranking type={"me"} />,
            loader: async () => {
              const data = store.dispatch(
                rankApiSlice.endpoints.getMyBoard.initiate()
              );

              try {
                const response = await data.unwrap();
                return response;
              } catch (e) {
                // see https://reactrouter.com/en/main/fetch/redirect
                return redirect("/signin");
              } finally {
                data.unsubscribe();
              }
            },
          },
        ],
      },
      {
        path: "/history",
        element: <History />,
        loader: async () => {
          const { user } = store.getState().auth;
          let id = user?._id || 0;
          if (user == null || user._id) {
            const u = store.dispatch(
              userApiSlice.endpoints.getMyInfo.initiate()
            );

            try {
              const response = await u.unwrap();
              console.log(response);
              id = response.user._id;
            } catch (e) {
              // see https://reactrouter.com/en/main/fetch/redirect
              console.log(e);
              return redirect("/signin");
            } finally {
              u.unsubscribe();
            }
          }
          console.log(user);

          const data = store.dispatch(
            battleApiSlice.endpoints.getMyBattle.initiate(id)
          );

          try {
            const response = await data.unwrap();
            return response;
          } catch (e) {
            // see https://reactrouter.com/en/main/fetch/redirect
            return redirect("/signin");
          } finally {
            data.unsubscribe();
          }
        },
      },
      {
        path: "/Profile",
        element: <Profile />,
        loader: async () => {
          const { user } = store.getState().auth;
          if (user == null) {
            const p = store.dispatch(
              userApiSlice.endpoints.getMyInfo.initiate()
            );

            try {
              const response = await p.unwrap();
              return response;
            } catch (e) {
              // see https://reactrouter.com/en/main/fetch/redirect
              return redirect("/signin");
            } finally {
              p.unsubscribe();
            }
          }
          return null;
        },
      },
    ],
  },
]);

export default router;
