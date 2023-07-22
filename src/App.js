import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './pages/Layout';
import About from './pages/About';
import Login from './pages/Login';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import Student from './pages/Student';
import Representative from './pages/Representative';
import Registration from './pages/Registration';
import Payment from './pages/Payment';
import StudentEdit from './pages/StudentEdit';
import RepresentativeEdit from './pages/RepresentativeEdit';
import Workshop from './pages/Workshop';
import WorkshopEdit from './pages/WorkshopEdit';
import User from './pages/User';
import UserEdit from './pages/UserEdit';
import PrivateRoutes from './utils/PrivateRoutes';
import { useQuery, gql, useMutation } from '@apollo/client';

const VERIFY_TOKEN = gql`
  query TokenValid {
    tokenIsValid(token: "${(localStorage && localStorage.getItem("accessToken") && localStorage.getItem("accessToken").substring(7)) || ''}")
  }
`;

const LOG_OUT = gql`
  mutation Logout {
    logout(token: "${(localStorage && localStorage.getItem("accessToken") && localStorage.getItem("accessToken").substring(7)) || ''}")
  }
`;

const LOG_IN = gql`
  mutation Auth($authentication: AuthenticationInput) {
    authenticate(authentication: $authentication) {
      accessToken
    }
  }
`;

const App = () => {
  const [auth, setAuth] = React.useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [isFirstVisit, setIsFirstVisit] = React.useState(true);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [selectedRepresentative, setSelectedRepresentative] = React.useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);



  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const { loading, error, data } = useQuery(VERIFY_TOKEN, {
    onCompleted: (data) => {
      setAuth(data.tokenIsValid);
      setIsFirstVisit(false);
    },
  });
  const [logoutMutation, { loading: logoutLoading, error: logoutError }] = useMutation(LOG_OUT);
  const [submitLogin, { loading: loginLoading, error: loginError }] = useMutation(LOG_IN);


  const handleLogin = (email, password) => {
    submitLogin({
      variables: {
        authentication: { email, password }
      }
    }).then((response) => {
      const token = response.data.authenticate.accessToken;
      localStorage.setItem('accessToken', 'Bearer ' + token);
      setAuth(true);
    }).catch((error) => {
      setOpenSnackbar(true);
    });
  };

  const handleLogout = () => {
    logoutMutation()
      .then((response) => {
        if (response.data.logout) {
          localStorage.removeItem('accessToken');
          setAuth(false);
        }
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  const handleSelectedStudent = (student) => {
    setSelectedStudent(student);
  }

  const handleSelectedRepresentative = (representative, student) => {
    setSelectedRepresentative(representative);
    setSelectedStudent(student);
  }

  const handleSelectedWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
  }

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
  }

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  React.useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout auth={auth} onLogout={handleLogout} />}>
          {auth && isFirstVisit ? <Route path="/student" element={<Student />} exact /> : <Route index element={<Home />} />}
          {/*<Route path="/about" element={<About />} />*/}
          <Route element={<PrivateRoutes auth={auth} />} >
            <Route path="/student" element={<Student onChangeStudent={handleSelectedStudent} />} exact />
            <Route path="/student/edit/:id" element={<StudentEdit student={selectedStudent} />} exact />
            <Route path="/representative" element={<Representative onChangeRepresentative={handleSelectedRepresentative}/>} />
            <Route path="/representative/edit/:id" element={<RepresentativeEdit representative={selectedRepresentative} student={selectedStudent} />} exact />
            <Route path="/payment" element={<Payment />} exact />
            <Route path="/registration" element={<Registration />} exact />
            <Route path="/workshop" element={<Workshop onChangeWorkshop={handleSelectedWorkshop}/>} exact />
            <Route path="/workshop/edit/:id" element={<WorkshopEdit workshop={selectedWorkshop}/>} exact />
            <Route path="/user" element={<User onChangeUser={handleSelectedUser}/>} exact />
            <Route path="/user/edit/:id" element={<UserEdit user={selectedUser}/>} exact />

          </Route>
          <Route
            path="/login"
            element={
              auth ? (
                <Navigate to="/student" replace />
              ) : (
                <Login
                  openSnackbar={openSnackbar}
                  closeSnackbar={closeSnackbar}
                  onLogin={handleLogin}
                  loading={loginLoading}
                  error={loginError}
                />
              )
            }
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
