import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './Dashboard';
import QuestionPage from './pages/QuestionPage';
import ExamPage from './pages/ExamPage';

import "primereact/resources/themes/tailwind-light/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core styles
import UserPage from './pages/UsersPage';
import AuthGuard from './helper/AuthGuard';
import SubjectPage from './pages/SubjectPage';


export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/' element={<LoginPage />}></Route>
      <Route path='/dashboard' element={<AuthGuard><Dashboard /></AuthGuard>}>
        <Route index element={<QuestionPage />} />
        <Route path="questions" element={<QuestionPage />} />
        <Route path="exams" element={<ExamPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="subjects" element={<SubjectPage />} />
      </Route>
    </Routes>
  )
}