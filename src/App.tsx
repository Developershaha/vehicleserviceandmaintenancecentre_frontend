import Snackbar from "./components/Snackbar";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <ErrorBoundaryWrapper>
        <AppRoutes />
      </ErrorBoundaryWrapper>

      <Snackbar />
    </>
  );
};

export default App;
