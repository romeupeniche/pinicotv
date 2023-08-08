import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Container from "./components/Container";
import Series from "./pages/Series";
import SeriePage from "./pages/SeriePage";
import Account from "./pages/Account";
import { useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { setSeries } from "./store/seriesSlice";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "./store/accountSlice";
import Watch from "./pages/Watch";
import { setAvatars } from "./store/avatarsSlice";

function App() {
  const dispatch = useDispatch();
  const videosCollectionRef = collection(db, "series");
  const historyCollectionRef = collection(db, "history");
  const assetsCollectionRef = collection(db, "assets");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#c70808",
        dark: "#8b0000",
      },
      utils: {
        green: "#2e7d32",
        grey: {
          light: "#999",
          dark: "#222",
        },
      },
    },
    typography: {
      fontFamily: "'SF Pro Display', sans-serif",
    },
  });

  useEffect(() => {}, [dispatch, videosCollectionRef, assetsCollectionRef]);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const accountsHistory = await getDocs(historyCollectionRef);
      const fetchedAccountsHistory = accountsHistory.docs.map((doc) => {
        return {
          data: doc.data(),
          id: doc.id,
        };
      });
      const currentUserHistory = fetchedAccountsHistory.find(
        (account) => account.id === user.uid
      );

      if (currentUserHistory) {
        delete currentUserHistory?.uid;
        dispatch(
          setUser({
            user: {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
            },
            history: currentUserHistory.data ?? null,
          })
        );
      } else {
        dispatch(
          setUser({
            user: {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
            },
            history: null,
          })
        );
      }

      const videosData = await getDocs(videosCollectionRef);
      if (videosData) {
        const fetchedData = videosData.docs.map((doc) => ({
          ...doc.data(),
          title: doc.id,
        }));
        const transformedData = fetchedData.reduce((acc, curr) => {
          const { title, ...rest } = curr;
          acc[title] = rest;
          return acc;
        }, {});

        dispatch(setSeries(transformedData));
      }

      const avatarsData = await getDocs(assetsCollectionRef);
      if (avatarsData) {
        const avatarsArray = avatarsData.docs.map((doc) => doc.data().imgs)[0];
        dispatch(setAvatars(avatarsArray));
      }
    } else {
      dispatch(setUser(null));
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/series" element={<Series />} />
            <Route path="/series/:uid" element={<SeriePage />} />
            <Route path="/series/:uid/watch" element={<Watch />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
